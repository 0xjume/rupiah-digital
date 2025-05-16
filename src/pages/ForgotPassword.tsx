
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container max-w-md mx-auto p-4">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 bg-rupiah-red rounded-full flex items-center justify-center">
                <span className="text-white font-poppins font-bold text-2xl">Rp</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">
              Rupiah <span className="text-rupiah-red">Digital</span>
            </h1>
          </Link>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{resetSent ? "Check Your Email" : "Forgot Password"}</CardTitle>
            <CardDescription>
              {resetSent 
                ? "We've sent you an email with instructions to reset your password." 
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          
          {!resetSent ? (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-rupiah-red hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
                <p className="text-sm text-center">
                  Remember your password?{" "}
                  <Link to="/login" className="text-rupiah-red hover:underline">
                    Back to Login
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <p className="text-sm mb-4">
                If you don't receive an email within a few minutes, check your spam folder or try again.
              </p>
              <Button 
                className="w-full bg-rupiah-red hover:bg-red-700"
                onClick={() => setResetSent(false)}
              >
                Try Again
              </Button>
              <p className="text-sm text-center">
                <Link to="/login" className="text-rupiah-red hover:underline">
                  Back to Login
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
