
import { Badge } from "@/components/ui/badge";

const RoadmapSection = () => {
  const roadmapItems = [
    {
      quarter: "Q2 2025",
      title: "Testnet Launch",
      items: [
        "Initial token implementation on Solana testnet",
        "Establish banking partnerships for reserves",
        "Security audits of smart contracts",
        "Develop Confidential Transfer protocol"
      ],
      status: "on-going"
    },
    {
      quarter: "Q3 2025",
      title: "Mainnet Launch",
      items: [
        "Official launch on Solana mainnet",
        "Listings on key exchanges (e.g., Mobee Exchange)",
        "KYC/AML compliance framework implementation",
        "First monthly reserve audit publication"
      ],
      status: "upcoming"
    },
    {
      quarter: "Q4 2025",
      title: "DeFi Integration",
      items: [
        "Integration with Solana DeFi protocols",
        "Launch of developer SDK and documentation",
        "Partnerships with remittance platforms",
        "Expansion of banking reserve network"
      ],
      status: "upcoming"
    },
    {
      quarter: "Q1 2026",
      title: "Commercial Adoption",
      items: [
        "E-commerce payment integrations",
        "Mobile wallet application release",
        "Payroll processing partnerships",
        "Enhanced governance implementation"
      ],
      status: "upcoming"
    }
  ];

  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-rupiah-gold border-rupiah-gold mb-4">Roadmap</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Path Forward</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Rupiah Digital has a clear strategy to become Indonesia's leading stablecoin, with key milestones planned through 2025.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-rupiah-light transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <div key={index} className="relative">
                {/* Timeline Dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-rupiah-red bg-white"></div>
                
                <div className={`md:grid md:grid-cols-2 md:gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Quarter Label - visible only on mobile */}
                  <div className="md:hidden mb-4">
                    <span className="inline-block px-4 py-2 bg-rupiah-red text-white rounded-full text-sm font-semibold">
                      {item.quarter}
                    </span>
                  </div>
                  
                  {/* Quarter Label - left side for even items, right side pushed for odd items */}
                  <div className={`hidden md:flex md:items-center ${index % 2 === 0 ? 'md:justify-end md:pr-8' : 'md:justify-start md:pl-8 md:col-start-2 md:col-end-3 md:row-start-1'}`}>
                    <span className="inline-block px-6 py-3 bg-rupiah-red text-white rounded-full text-base font-semibold">
                      {item.quarter}
                    </span>
                  </div>
                  
                  {/* Content Box */}
                  <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 ${index % 2 === 1 ? 'md:col-start-1 md:col-end-2 md:row-start-1' : ''}`}>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <ul className="space-y-2">
                      {item.items.map((listItem, i) => (
                        <li key={i} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rupiah-red mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{listItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
