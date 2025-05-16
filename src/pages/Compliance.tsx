
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Landmark } from "lucide-react";

const Compliance = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Compliance and Regulation</h1>
          
          <p className="text-lg mb-8">
            Rupiah Digital operates under a comprehensive regulatory framework to ensure
            stability, security, and compliance with Indonesian and international standards.
          </p>
          
          <div className="grid gap-8 mb-12">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl">
                  <Shield className="mr-2 h-5 w-5 text-rupiah-red" />
                  Regulatory Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Rupiah Digital operates in accordance with regulations set forth by Indonesia's:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">Otoritas Jasa Keuangan (OJK)</strong>
                      <p className="text-sm text-muted-foreground">
                        Indonesia's Financial Services Authority, which oversees stablecoin regulation starting in 2025
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">Bank Indonesia</strong>
                      <p className="text-sm text-muted-foreground">
                        The central bank that regulates payment systems and currency stability
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">BAPPEBTI</strong>
                      <p className="text-sm text-muted-foreground">
                        Commodity Futures Trading Regulatory Agency that oversees crypto asset trading
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl">
                  <Landmark className="mr-2 h-5 w-5 text-rupiah-red" />
                  Reserve Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Rupiah Digital implements a rigorous reserve management system:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">1:1 Backing</strong>
                      <p className="text-sm text-muted-foreground">
                        Every $IDRS token is fully backed by an equivalent amount of IDR held in regulated 
                        Indonesian banking institutions
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">Independent Audits</strong>
                      <p className="text-sm text-muted-foreground">
                        Monthly attestations by a reputable accounting firm verify our reserve holdings
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">On-chain Proof of Reserves</strong>
                      <p className="text-sm text-muted-foreground">
                        Transparent verification of reserves through blockchain technology
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-xl">
                  <Shield className="mr-2 h-5 w-5 text-rupiah-red" />
                  KYC and AML Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Our robust Know Your Customer and Anti-Money Laundering procedures:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">Identity Verification</strong>
                      <p className="text-sm text-muted-foreground">
                        Multi-layered KYC process to verify the identity of all users
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">Transaction Monitoring</strong>
                      <p className="text-sm text-muted-foreground">
                        Advanced systems to detect and prevent suspicious activities
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <strong className="font-medium">Privacy-Preserving Compliance</strong>
                      <p className="text-sm text-muted-foreground">
                        Our Confidential Transfers feature maintains necessary records for compliance
                        while protecting user privacy
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <h2 className="text-2xl font-semibold mt-12 mb-4">Compliance Certifications and Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-24">
              <p className="text-center font-medium">CertiK Audit</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-24">
              <p className="text-center font-medium">Indonesia FSA</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-24">
              <p className="text-center font-medium">FATF Compliant</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center h-24">
              <p className="text-center font-medium">ISO 27001</p>
            </div>
          </div>
          
          <p className="mt-8">
            For questions regarding our compliance procedures or regulatory status,
            please contact our compliance team at <a href="mailto:compliance@rupiahdigital.com" className="text-rupiah-red hover:underline">compliance@rupiahdigital.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Compliance;
