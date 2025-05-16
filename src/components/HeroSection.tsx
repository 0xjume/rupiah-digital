
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, Bell, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      emailInputRef.current?.focus();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert email into the waitlist_emails table
      const { error } = await supabase
        .from('waitlist_emails')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique violation code
          toast.info("This email is already on our waitlist!");
        } else {
          console.error("Error submitting email:", error);
          toast.error("An error occurred. Please try again later.");
        }
      } else {
        toast.success("Thank you for joining our waitlist!");
        setEmail("");
      }
    } catch (error) {
      console.error("Exception when submitting email:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="pt-32 pb-20 hero-pattern overflow-hidden">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Empowering Indonesia's Digital Economy with{" "}
              <span className="text-rupiah-red">Stability</span> and{" "}
              <span className="text-rupiah-blue">Privacy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Rupiah Digital ($IDRS) is an IDR-backed stablecoin on Solana, 
              offering low-cost transactions with enhanced privacy and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button className="bg-rupiah-red hover:bg-red-700 text-white px-8 py-6 text-lg">
                  Try Devnet
                </Button>
              </Link>
              <Link to="/whitepaper">
                <Button variant="outline" className="border-rupiah-blue text-rupiah-blue hover:bg-rupiah-blue/90 hover:text-white px-8 py-6 text-lg">
                  Read Whitepaper
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in">
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-rupiah-gold/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-rupiah-red/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Coming Soon</h3>
                    <p className="text-sm text-gray-500">Join our waitlist to be the first to know</p>
                  </div>
                  <div className="bg-rupiah-blue rounded-full h-10 w-10 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/4e74266e-c51b-4c4f-8e74-a432655c57de.png" 
                      alt="IDRS Logo" 
                      className="h-8 w-8"
                    />
                  </div>
                </div>
                
                <Card className="border-none shadow-none bg-rupiah-light mb-6">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                      <div className="h-3 w-3 rounded-full bg-rupiah-red"></div>
                      <p>Launching Q3 2025</p>
                    </div>
                    <h4 className="text-xl font-bold mt-2">Rupiah Digital ($IDRS)</h4>
                    <p className="text-gray-600 mt-1">The first Indonesian Rupiah stablecoin with privacy features</p>
                  </CardContent>
                </Card>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      ref={emailInputRef}
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-10 py-6"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-rupiah-red hover:bg-red-700 text-white py-6"
                    disabled={isSubmitting}
                  >
                    Join Waitlist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-xs text-center text-gray-500">
                    We'll notify you when Rupiah Digital launches and never share your email with third parties.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
