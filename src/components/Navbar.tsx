
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  Search,
  User,
  LogOut,
  Lock,
  Award,
  Bell,
  HelpCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import governmentLogo from "/public/lovable-uploads/41d9410d-890c-440d-a36a-3970926b623a.png";

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="rtms-navbar sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <img 
          src={governmentLogo} 
          alt="Government of India" 
          className="h-10 bg-white p-1 rounded"
        />
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold">Government of India</h1>
          <p className="text-xs">Ministry of Road Transport & Highways</p>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        <Link to="/" className="text-white hover:text-gray-200">Home</Link>
        <Link to="/search-vehicle" className="text-white hover:text-gray-200">Search Vehicle</Link>
        <Link to="/pay-fines" className="text-white hover:text-gray-200">Pay Fines</Link>
        <Link to="/locate-yards" className="text-white hover:text-gray-200">Locate Yards</Link>
        <Link to="/report-issues" className="text-white hover:text-gray-200">Report Issues</Link>
        <Link to="/about" className="text-white hover:text-gray-200">About</Link>
        <Link to="/contact" className="text-white hover:text-gray-200">Contact</Link>
      </div>

      <div className="flex items-center space-x-2">
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white">
                <User className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">{currentUser.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin() && (
                <DropdownMenuItem onClick={() => navigate("/admin")}>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => navigate("/payment-history")}>
                <Award className="mr-2 h-4 w-4" />
                <span>Payment History</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" onClick={() => navigate("/login")} className="text-white">
            <User className="h-5 w-5 mr-1" />
            <span className="hidden md:inline">Login</span>
          </Button>
        )}

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-rtms-blue p-4 flex flex-col space-y-2 md:hidden z-50">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">Home</Link>
          <Link to="/search-vehicle" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">Search Vehicle</Link>
          <Link to="/pay-fines" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">Pay Fines</Link>
          <Link to="/locate-yards" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">Locate Yards</Link>
          <Link to="/report-issues" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">Report Issues</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">About</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">Contact</Link>
          {isAdmin() && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gray-200 py-2">Admin Dashboard</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
