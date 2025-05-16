
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Handshake } from "lucide-react";

const AboutSection = () => {
  const teamHighlights = [
    "Leadership team with extensive fintech and banking experience",
    "Blockchain development expertise focusing on Solana ecosystem",
    "Operations specialists with experience scaling products in Indonesia",
    "Dedicated security experts protecting digital assets and user privacy"
  ];

  const partnerCategories = [
    {
      name: "Financial Partners",
      description: "Established relationships with leading Indonesian banks and financial institutions"
    },
    {
      name: "Technology Partners",
      description: "Collaborations with blockchain infrastructure providers and security auditors"
    },
    {
      name: "Regulatory Partners",
      description: "Working closely with compliance experts and regulatory consultants"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="text-rupiah-blue border-rupiah-blue mb-4">About Us</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Team Behind Rupiah Digital</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team combines expertise in finance, blockchain technology, and Indonesian market knowledge to create a revolutionary stablecoin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-rupiah-red mr-2" />
                <h3 className="text-2xl font-bold text-rupiah-red">Our Team</h3>
              </div>
              <div className="space-y-4">
                {teamHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-rupiah-red rounded-full mt-2 mr-2"></span>
                    <p>{highlight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Handshake className="h-6 w-6 text-rupiah-blue mr-2" />
                  <h3 className="text-2xl font-bold text-rupiah-blue">Our Partners</h3>
                </div>
                <div className="space-y-4">
                  {partnerCategories.map((category, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="font-semibold text-lg mb-1">{category.name}</h4>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

      
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
