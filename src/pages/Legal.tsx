
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText, Shield } from "lucide-react";

const Legal = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
          
          <p className="text-lg mb-8">
            Rupiah Digital is committed to regulatory compliance and transparency. 
            Below you'll find our legal documentation and policies.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-rupiah-red" />
                  Terms of Service
                </CardTitle>
                <CardDescription>
                  Our user agreement and rules of engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This document covers your rights and responsibilities when using 
                  the Rupiah Digital platform and services.
                </p>
                <Link 
                  to="/terms-of-service" 
                  className="text-rupiah-red hover:underline flex items-center"
                >
                  View Terms of Service
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-rupiah-red" />
                  Privacy Policy
                </CardTitle>
                <CardDescription>
                  How we collect, use, and protect your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This policy explains our practices regarding the collection and 
                  management of your personal information.
                </p>
                <Link 
                  to="/privacy-policy" 
                  className="text-rupiah-red hover:underline flex items-center"
                >
                  View Privacy Policy
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-rupiah-red" />
                  Compliance
                </CardTitle>
                <CardDescription>
                  Our regulatory framework and compliance measures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn about how we comply with Indonesian regulations and 
                  international standards for stablecoin operation.
                </p>
                <Link 
                  to="/compliance" 
                  className="text-rupiah-red hover:underline flex items-center"
                >
                  View Compliance Information
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-rupiah-red" />
                  Cookies
                </CardTitle>
                <CardDescription>
                  Our cookie usage policy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Information about how we use cookies and similar technologies 
                  on our website and services.
                </p>
                <Link 
                  to="/cookies" 
                  className="text-rupiah-red hover:underline flex items-center"
                >
                  View Cookie Policy
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Legal;
