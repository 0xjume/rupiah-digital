
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const UseCasesSection = () => {
  const useCases = [
    {
      title: "Remittances",
      description: "Low-cost transfers for 2.7 million Indonesian migrant workers sending money home.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-red">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m6 8 4 4 4-4" />
          <path d="M18 16v-3" />
          <path d="M6 16v-3" />
          <path d="M12 12v4" />
        </svg>
      ),
    },
    {
      title: "DeFi Applications",
      description: "Liquidity pools and lending on Solana protocols for earning yields and accessing capital.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-blue">
          <rect width="8" height="8" x="2" y="2" rx="2" />
          <path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
          <path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
          <rect width="8" height="8" x="14" y="14" rx="2" />
          <path d="M8 14c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2" />
          <path d="M2 14c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2" />
        </svg>
      ),
    },
    {
      title: "E-Commerce",
      description: "Stable digital payments in Indonesia's $35 billion e-commerce market with privacy protection.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-gold">
          <path d="M8 3h8l4 9H4l4-9z" />
          <path d="M19 16 A2 2 0 0 1 17 18 A2 2 0 0 1 15 16 A2 2 0 0 1 19 16" />
          <path d="M9 16 A2 2 0 0 1 7 18 A2 2 0 0 1 5 16 A2 2 0 0 1 9 16" />
          <path d="M5 16h10" />
          <path d="M8 3v7" />
          <path d="M16 3v7" />
        </svg>
      ),
    },
    {
      title: "Financial Inclusion",
      description: "Digital cash for Indonesia's 66 million unbanked citizens, accessible via basic smartphones.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-red">
          <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6v12l12-2z" />
          <path d="M6 14h12" />
          <path d="M6 18h12" />
          <path d="M16 8h2" />
          <path d="M14 4c0 1.1.9 2 2 2" />
        </svg>
      ),
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-rupiah-light">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-rupiah-blue border-rupiah-blue mb-4">Use Cases</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transforming Indonesia's Economy</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            $IDRS is designed to solve real-world financial challenges across multiple sectors of the Indonesian economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex">
              <div className="mr-6">
                <div className="h-16 w-16 rounded-lg bg-white shadow-md flex items-center justify-center">
                  {useCase.icon}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-rupiah-red to-rupiah-blue rounded-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ready to transform how you use money?</h3>
              <p className="text-white/80 mb-6">
                Rupiah Digital combines the stability of IDR with the speed and privacy of blockchain technology.
              </p>
              <Link to="/login">
                <button className="bg-white text-rupiah-blue hover:bg-rupiah-gold hover:text-white transition-colors px-6 py-3 rounded-lg font-medium">
                  Get Started Now
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-3xl font-bold">2.7M+</p>
                <p className="text-white/80">Migrant Workers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-3xl font-bold">$35B</p>
                <p className="text-white/80">E-Commerce Market</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-3xl font-bold">66M</p>
                <p className="text-white/80">Unbanked Citizens</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <p className="text-3xl font-bold">50K</p>
                <p className="text-white/80">Transactions Per Second</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
