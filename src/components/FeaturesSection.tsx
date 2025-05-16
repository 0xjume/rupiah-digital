
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      title: "1:1 Peg to IDR",
      description: "Every $IDRS is backed by 1 Indonesian Rupiah held in regulated banks, ensuring stable value.",
      icon: (
        <div className="h-12 w-12 rounded-full bg-rupiah-red/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-red">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
        </div>
      ),
    },
    {
      title: "Privacy via Confidential Transfers",
      description: "Keep your financial activity private with zero-knowledge proofs that hide transaction amounts.",
      icon: (
        <div className="h-12 w-12 rounded-full bg-rupiah-blue/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-blue">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </div>
      ),
    },
    {
      title: "Lightning Fast Transactions",
      description: "Built on Solana for 50,000 TPS and ~$0.00025 transaction fees, making micropayments viable.",
      icon: (
        <div className="h-12 w-12 rounded-full bg-rupiah-gold/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-gold">
            <path d="m14 2-3-2-3 2" />
            <path d="M14 22-3 9h13z" />
            <path d="M14 22 3 9" />
          </svg>
        </div>
      ),
    },
    {
      title: "Monthly Audited Reserves",
      description: "Regular transparency reports and on-chain proof-of-reserves for full accountability.",
      icon: (
        <div className="h-12 w-12 rounded-full bg-rupiah-red/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-red">
            <path d="M20 7h-9" />
            <path d="M14 17H5" />
            <circle cx="17" cy="17" r="3" />
            <circle cx="7" cy="7" r="3" />
          </svg>
        </div>
      ),
    },
    {
      title: "DeFi Integration",
      description: "Seamless compatibility with Solana DeFi protocols for lending, staking, and liquidity pools.",
      icon: (
        <div className="h-12 w-12 rounded-full bg-rupiah-blue/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-blue">
            <path d="M16 8a4 4 0 0 1-8 0" />
            <path d="M12 2v10" />
            <path d="M8 14h8" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
        </div>
      ),
    },
    {
      title: "Regulatory Compliance",
      description: "Fully aligned with Indonesian OJK oversight and international KYC/AML standards.",
      icon: (
        <div className="h-12 w-12 rounded-full bg-rupiah-gold/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rupiah-gold">
            <path d="m9 11-6 6v3h9l3-3" />
            <path d="m17 5-2 2-7 7v3h3l7-7 2-2" />
            <path d="m14 8 3 3" />
            <path d="M5 3a2 2 0 0 0 2 2 2 2 0 0 0-2 2 2 2 0 0 0-2-2 2 2 0 0 0 2-2" />
            <path d="M19 3a2 2 0 0 0 2 2 2 2 0 0 0-2 2 2 2 0 0 0-2-2 2 2 0 0 0 2-2" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-rupiah-red border-rupiah-red mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features of Rupiah Digital</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            $IDRS combines the stability of the Indonesian Rupiah with the speed and privacy features of blockchain technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-all hover:border-rupiah-red/20">
              <CardHeader className="pb-2">
                {feature.icon}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
