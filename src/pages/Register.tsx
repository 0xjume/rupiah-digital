
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { walletService } from "@/services/walletService";
import { toast } from "sonner";
import crypto from 'crypto-js';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  
  // Split name into first and last name
  const getFirstName = () => {
    const nameParts = name.trim().split(/\s+/);
    return nameParts[0] || "";
  };
  
  const getLastName = () => {
    const nameParts = name.trim().split(/\s+/);
    return nameParts.slice(1).join(" ") || "";
  };
  
  // If the user is already logged in, redirect to the dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  // Generate a deterministic encryption key from the user's password
  const generateEncryptionKey = (email: string, password: string) => {
    // Create a deterministic key from email and password
    // This way user can recover their wallet with the same credentials
    return crypto.SHA256(email + password).toString();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate an encryption key from user credentials
      const encryptionKey = generateEncryptionKey(email, password);
      
      // Generate a new Solana wallet
      const walletData = await walletService.generateWallet(encryptionKey);
      
      if (!walletData || !walletData.publicKey || !walletData.encryptedPrivateKey) {
        throw new Error("Failed to generate wallet");
      }
      
      // Store the wallet public key temporarily to associate with user after signup
      localStorage.setItem('temp_wallet_data', JSON.stringify({
        publicKey: walletData.publicKey,
        encryptedPrivateKey: walletData.encryptedPrivateKey
      }));
      
      // Sign up the user
      await signUp(email, password, getFirstName(), getLastName());
      
      // Note: The wallet will be associated with the user in the AuthContext
      // after successful signup using the data stored in localStorage
      
      toast.success("Account created successfully! A Solana wallet has been generated for you.");
      
      // Redirect to login page after successful registration
      setRedirectToLogin(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container max-w-md mx-auto p-4">
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 bg-rupiah-red rounded-full flex items-center justify-center">
              <span className="text-white font-poppins font-bold text-2xl">Rp</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1">
            Rupiah <span className="text-rupiah-red">Digital</span>
          </h1>
          <p className="text-muted-foreground">Create your IDRS wallet account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Enter your details to sign up for an account with Solana wallet
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your password is used to secure your Solana wallet. Make sure it's strong and you remember it.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms}
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      setAgreeTerms(checked);
                    }
                  }}
                  required
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms-of-service" className="text-rupiah-red hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-rupiah-red hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-rupiah-red hover:bg-red-700"
                disabled={isLoading || !agreeTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account & Wallet...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
              <p className="text-sm text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-rupiah-red hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
