
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BookOpen } from "lucide-react";

const Whitepaper = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Rupiah Digital Whitepaper</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The comprehensive technical and economic overview of the Rupiah Digital ($IDRS) stablecoin ecosystem.
            </p>
          </div>

          {/* Document Preview */}
          <div className="mb-16">
            <Card className="border-2 border-rupiah-blue/20 shadow-lg mx-auto max-w-4xl">
              <CardContent className="p-0">
                <div className="bg-rupiah-blue text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-rupiah-red rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-poppins font-bold text-lg">Rp</span>
                      </div>
                      <h2 className="text-2xl font-bold">Rupiah Digital Whitepaper</h2>
                    </div>
                    <span className="text-white/60">v1.2.0</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-3">Abstract</h3>
                  <p className="text-gray-700 mb-6">
                    The Rupiah Digital ($IDRS) is a decentralized stablecoin designed specifically for the Indonesian digital economy. 
                    Built on the Solana blockchain, it maintains a stable 1:1 peg with the Indonesian Rupiah (IDR) through a 
                    collateralized approach, using a mixture of fiat reserves, digital assets, and algorithmic stabilization mechanisms.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Table of Contents</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 mb-6">
                    <li>Introduction</li>
                    <li>Technical Architecture</li>
                    <li>Tokenomics</li>
                    <li>Governance Structure</li>
                    <li>Regulatory Compliance</li>
                    <li>Implementation Roadmap</li>
                    <li>Use Cases &amp; Applications</li>
                    <li>Security Considerations</li>
                    <li>References</li>
                  </ul>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-600 mb-4">
                      This preview shows only the introduction and structure of the whitepaper. 
                      The full document contains detailed technical specifications, economic models, 
                      and implementation details.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button className="flex gap-2 bg-rupiah-blue hover:bg-rupiah-blue/90">
                        <FileText size={18} />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="flex gap-2 border-rupiah-blue text-rupiah-blue hover:bg-rupiah-blue hover:text-white">
                        <BookOpen size={18} />
                        Read Full Paper
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Highlights</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-rupiah-blue">Technical Architecture</h3>
                <p className="text-gray-600">
                  Built on Solana for high throughput, low fees, and rapid transaction finality. 
                  Utilizes a multi-layered security approach and privacy-preserving technologies.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-rupiah-blue">Economic Model</h3>
                <p className="text-gray-600">
                  Hybrid reserve system with transparent auditing, maintaining the 1:1 IDR peg 
                  through algorithmic stabilization and liquidity provisioning mechanisms.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-rupiah-blue">Regulatory Framework</h3>
                <p className="text-gray-600">
                  Compliant with Indonesia's digital asset regulations and international AML standards,
                  with built-in mechanisms for KYC, transaction monitoring, and reporting.
                </p>
              </div>
            </div>
          </div>
          
          {/* Contact / More Info */}
          <div className="bg-rupiah-light p-10 rounded-2xl max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Have Technical Questions?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our development team is available to answer any questions about the technical 
                aspects of Rupiah Digital's implementation.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-rupiah-red hover:bg-red-700 text-white px-8 py-6 text-lg">
                  Contact Development Team
                </Button>
                <Button variant="outline" className="border-rupiah-blue text-rupiah-blue hover:bg-rupiah-blue hover:text-white px-8 py-6 text-lg">
                  Join Developer Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Whitepaper;
