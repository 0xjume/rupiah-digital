
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-6">
              Last updated: May 1, 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies</h2>
            <p className="mb-4">
              Cookies are small text files that are stored on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information to 
              the website owners. Cookies can be "persistent" or "session" cookies.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
            <p className="mb-4">
              Rupiah Digital uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>
                <strong>Essential cookies:</strong> These are cookies that are required for the operation of our website. 
                They include, for example, cookies that enable you to log into secure areas of our website.
              </li>
              <li>
                <strong>Analytical/performance cookies:</strong> These allow us to recognize and count the number of visitors 
                and to see how visitors move around our website when they are using it. This helps us to improve the way our website works.
              </li>
              <li>
                <strong>Functionality cookies:</strong> These are used to recognize you when you return to our website. 
                This enables us to personalize our content for you and remember your preferences.
              </li>
              <li>
                <strong>Targeting cookies:</strong> These cookies record your visit to our website, the pages you have visited 
                and the links you have followed. We may use this information to make our website more relevant to your interests.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Cookies</h2>
            <p className="mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics, 
              deliver advertisements, and so on. These cookies may include:
            </p>
            <ul className="list-disc pl-8 mb-6">
              <li>Google Analytics, to analyze website usage</li>
              <li>Social media cookies, to enable social sharing functionality</li>
              <li>Payment processor cookies, to process secure transactions</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Cookies</h2>
            <p className="mb-4">
              Most web browsers allow some control of most cookies through the browser settings. 
              To find out more about cookies, including how to see what cookies have been set, 
              visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-rupiah-red hover:underline">www.aboutcookies.org</a>.
            </p>
            <p className="mb-4">
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. 
              If you disable or refuse cookies, please note that some parts of our website may become inaccessible or not function properly.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Our Cookie Policy</h2>
            <p className="mb-4">
              Any changes we may make to our cookie policy in the future will be posted on this page. 
              Please check back frequently to see any updates or changes to our cookie policy.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Cookie Policy, please contact us at:
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

export default Cookies;
