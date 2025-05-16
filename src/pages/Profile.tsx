
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ExternalWalletForm from "@/components/profile/ExternalWalletForm";
import BankAccountForm from "@/components/profile/BankAccountForm";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
});

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      form.setValue("email", user.email || "");
      
      // Load user metadata
      if (user.user_metadata) {
        form.setValue("firstName", user.user_metadata.first_name || "");
        form.setValue("lastName", user.user_metadata.last_name || "");
      }
      
      // Fetch additional profile data if needed
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (profile) {
          form.setValue("firstName", profile.first_name || user.user_metadata?.first_name || "");
          form.setValue("lastName", profile.last_name || user.user_metadata?.last_name || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    
    loadUserData();
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
        }
      });
      
      if (updateError) throw updateError;
      
      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = () => {
    const firstName = form.watch("firstName") || "";
    const lastName = form.watch("lastName") || "";
    return ((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || "U";
  };

  return (
    <DashboardLayout>
      <div className="container section-padding">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="wallets">External Wallets</TabsTrigger>
            <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 bg-rupiah-blue text-white">
                      <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your email address" 
                                {...field} 
                                disabled={true} 
                                className="bg-muted"
                              />
                            </FormControl>
                            <FormDescription>
                              Email cannot be changed.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Details about your IDRS account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Account Created</div>
                      <div className="text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Account ID</div>
                      <div className="text-sm text-muted-foreground truncate">{user?.id || "Unknown"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Verification Status</div>
                      <div className="text-sm flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Verified
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Delete Account</CardTitle>
                    <CardDescription>Permanently delete your account and all data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action is irreversible. All your data, including wallet information and transaction history,
                      will be permanently deleted.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="wallets">
            <Card>
              <CardHeader>
                <CardTitle>External Wallets</CardTitle>
                <CardDescription>Add your external Solana wallets for receiving IDRS</CardDescription>
              </CardHeader>
              <CardContent>
                <ExternalWalletForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bank-accounts">
            <Card>
              <CardHeader>
                <CardTitle>Bank Accounts</CardTitle>
                <CardDescription>Add your Indonesian bank accounts for withdrawals</CardDescription>
              </CardHeader>
              <CardContent>
                <BankAccountForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
