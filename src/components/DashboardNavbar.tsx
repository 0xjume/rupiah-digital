
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DashboardNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const getInitials = () => {
    if (!user) return "U";
    return ((user.user_metadata?.first_name?.[0] || "") + (user.user_metadata?.last_name?.[0] || "")).toUpperCase() || user.email?.[0]?.toUpperCase() || "U";
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-8">
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/lovable-uploads/95bb4ccc-0cde-4842-93ac-b14dbfa766cd.png" 
            alt="IDRS Logo" 
            className="h-8 w-8 mr-2"
          />
          <span className="font-bold text-xl">IDRS</span>
        </Link>

        <nav className="hidden md:flex ml-6 space-x-4 lg:space-x-6">
          <Link 
            to="/dashboard" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground"}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/transactions" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/transactions") ? "text-primary" : "text-muted-foreground"}`}
          >
            Transactions
          </Link>
          <Link 
            to="/wallet" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/wallet") ? "text-primary" : "text-muted-foreground"}`}
          >
            Wallet
          </Link>
          <Link 
            to="/swap" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/swap") ? "text-primary" : "text-muted-foreground"}`}
          >
            Swap
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rupiah-red" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-rupiah-blue text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
