
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Last updated: May 1, 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
            <p className="mb-4">
              Rupiah Digital ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our website and services related to the Rupiah Digital stablecoin ($IDRS).
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us, such as when you create an account, 
              complete KYC verification, or contact customer support. This may include:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Government-issued ID for KYC compliance</li>
              <li>Banking information for deposits and withdrawals</li>
              <li>Wallet addresses and transaction data</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Communicate with you about products, services, and events</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Confidential Transfers</h2>
            <p className="mb-4">
              Our Confidential Transfers feature uses zero-knowledge proofs to enhance privacy. 
              While transaction amounts are hidden on the blockchain, we maintain necessary records 
              for regulatory compliance and auditing purposes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the Internet or electronic storage is 100% secure. 
              We cannot guarantee absolute security of your data.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-8">
              <strong>Email:</strong> privacy@rupiahdigital.com<br />
              <strong>Address:</strong> Jakarta, Indonesia
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
