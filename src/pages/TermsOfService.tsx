
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Last updated: May 1, 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using the Rupiah Digital platform and services, you agree to be bound by these Terms of Service. 
              If you disagree with any part of the terms, you do not have permission to access or use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Description of Service</h2>
            <p className="mb-4">
              Rupiah Digital ($IDRS) is a stablecoin backed 1:1 by the Indonesian Rupiah (IDR). 
              Our services include facilitating the minting, burning, transferring, and storing of $IDRS tokens. 
              We also provide related features such as Confidential Transfers and integration with various DeFi protocols.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years old and able to form a legally binding contract to use our services. 
              You must also comply with our KYC (Know Your Customer) and AML (Anti-Money Laundering) requirements, 
              which may include providing identity verification documents.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">User Accounts</h2>
            <p className="mb-4">
              You are responsible for safeguarding your account credentials and private keys. 
              We cannot recover lost private keys or wallet access. You are responsible for all activities 
              that occur under your account.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Reserve and Redemption</h2>
            <p className="mb-4">
              Each $IDRS token is backed 1:1 by IDR held in regulated financial institutions. 
              You may redeem $IDRS for IDR at any time, subject to our redemption processes and applicable fees.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Risks and Disclaimers</h2>
            <p className="mb-4">
              Using blockchain technology and cryptocurrencies involves significant risks, including:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>Price volatility of cryptocurrencies</li>
              <li>Regulatory uncertainty</li>
              <li>Technical vulnerabilities in blockchain networks</li>
              <li>Potential for human error in managing digital assets</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p className="mb-4">
              We are not liable for any indirect, incidental, special, consequential, or punitive damages, 
              including loss of profits, data, or goodwill, resulting from your access to or use of our services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
            <p className="mb-4">
              We may modify these Terms at any time. We will provide notice of significant changes through our 
              website or by sending you an email. Your continued use of our services after such modifications 
              constitutes your acceptance of the updated Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-8">
              <strong>Email:</strong> legal@rupiahdigital.com<br />
              <strong>Address:</strong> Jakarta, Indonesia
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
