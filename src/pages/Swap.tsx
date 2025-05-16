
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDown, HelpCircle, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const Swap = () => {
  const [fromToken, setFromToken] = useState<string>("SOL");
  const [toToken, setToToken] = useState<string>("IDRS");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleSwap = () => {
    // For now, just show a toast since we don't have actual swap functionality
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Swap initiated",
        description: `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
      });
      setIsLoading(false);
      
      // In a real implementation, we would call a service to perform the swap
      // and then update the UI based on the response
    }, 2000);
  };
  
  const handleSwapFields = () => {
    // Swap the token selections
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // Swap the amounts
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };
  
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    
    // Simple conversion for demo purposes
    // In a real app, you would fetch rates from an API
    if (fromToken === "SOL" && toToken === "IDRS") {
      setToAmount((parseFloat(value || "0") * 159000).toFixed(2));
    } else if (fromToken === "IDRS" && toToken === "SOL") {
      setToAmount((parseFloat(value || "0") / 159000).toFixed(8));
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container section-padding">
        <h1 className="text-3xl font-bold mb-6">Swap</h1>
        
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-xl">Swap Tokens</CardTitle>
                <Tabs defaultValue="market">
                  <TabsList className="h-8">
                    <TabsTrigger value="market" className="text-xs px-3">Market</TabsTrigger>
                    <TabsTrigger value="limit" className="text-xs px-3">Limit</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>
                Convert between SOL and IDRS
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">From</span>
                  <span className="text-muted-foreground">Balance: 5.42 SOL</span>
                </div>
                
                <div className="flex space-x-2">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="IDRS">IDRS</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex justify-end">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      25%
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      50%
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      75%
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                      100%
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border"
                  onClick={handleSwapFields}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To</span>
                  <span className="text-muted-foreground">Balance: 10,000.00 IDRS</span>
                </div>
                
                <div className="flex space-x-2">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOL">SOL</SelectItem>
                      <SelectItem value="IDRS">IDRS</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input 
                    type="number"
                    placeholder="0.00" 
                    value={toAmount}
                    onChange={(e) => setToAmount(e.target.value)}
                    className="flex-1"
                    readOnly
                  />
                </div>
              </div>
              
              <div className="space-y-1 bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    Rate 
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Current exchange rate between tokens</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span>1 SOL = 159,000 IDRS</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center">
                    Fee
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Network fee for processing swap</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span>0.0001 SOL</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full bg-rupiah-red hover:bg-red-700"
                disabled={!fromAmount || !toAmount || isLoading}
                onClick={handleSwap}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Swap"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Swap;
