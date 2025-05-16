
import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { walletService } from "@/services/walletService";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to initialize a wallet for a new user
  const initializeUserWallet = async () => {
    try {
      // Get wallet info from the database
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .maybeSingle();
      
      if (wallet && !wallet.public_key) {
        // If wallet exists but doesn't have keys, check for temp data
        const tempWalletData = localStorage.getItem('temp_wallet_data');
        
        if (tempWalletData) {
          const { publicKey, encryptedPrivateKey } = JSON.parse(tempWalletData);
          
          if (publicKey && encryptedPrivateKey) {
            // Update the wallet with the generated keys
            await walletService.saveWallet(
              wallet.id,
              publicKey,
              encryptedPrivateKey
            );
            
            toast.success("Solana wallet initialized successfully");
          }
          
          // Clear the temporary data
          localStorage.removeItem('temp_wallet_data');
        }
      }
    } catch (error) {
      console.error("Error initializing wallet:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state event:", event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          toast.success("Signed in successfully!");
          
          // Initialize wallet after sign in (using setTimeout to avoid auth deadlock)
          setTimeout(() => {
            initializeUserWallet();
          }, 0);
          
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out successfully");
          navigate('/login');
        }
        // Removed the invalid 'SIGNED_UP' event check
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      // If user is already logged in, initialize wallet
      if (currentSession?.user) {
        setTimeout(() => {
          initializeUserWallet();
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      // Get the current URL to use as the site URL for redirects
      const siteUrl = window.location.origin;
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${siteUrl}/login?verified=true` // Redirect to login page after email verification
        }
      });
      
      if (error) throw error;
      
      // Show the email verification message here since we can't catch the SIGNED_UP event
      toast.success("Sign up successful! Please verify your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
