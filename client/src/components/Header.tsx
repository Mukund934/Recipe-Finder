import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { isAuthenticated, getCurrentUser, logoutUser, User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = getCurrentUser();
      setUser(userData);
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const menuItems = [
    { path: "/", label: "Home", icon: "fas fa-home" },
    { path: "/favorites", label: "Favorites", icon: "far fa-heart" },
    { path: "/profile", label: "Preferences", icon: "fas fa-sliders-h", authRequired: true },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="container-fluid py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="text-primary bg-orange-50 p-2 rounded-full transition-all duration-300 group-hover:bg-orange-100">
                <i className="fas fa-utensils text-xl"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Recipe Finder
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-1">
          {menuItems.map((item) => {
            if (item.authRequired && !user) return null;
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 font-medium cursor-pointer transition-all duration-200 ${
                    location === item.path
                      ? "text-primary bg-orange-50"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  <i className={`${item.icon} text-sm`}></i>
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center">
              <Link href="/profile">
                <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors">
                  <span className="font-medium text-gray-800">{user.name.split(" ")[0]}</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-orange-400 flex items-center justify-center text-white shadow-sm overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="gradient-button text-sm flex items-center space-x-1 ml-2"
                aria-label="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="gradient-button flex items-center space-x-1">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </button>
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-700 hover:text-primary transition p-2 rounded-lg hover:bg-gray-100"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`${mobileMenuOpen ? "fas fa-times" : "fas fa-bars"} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute w-full bg-white shadow-lg rounded-b-xl transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 stagger-animation">
          {menuItems.map((item) => {
            if (item.authRequired && !user) return null;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                    location === item.path ? "bg-orange-50 text-primary" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      location === item.path ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                  >
                    <i className={item.icon}></i>
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}

          {user ? (
            <div
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-sign-out-alt"></i>
              </div>
              <span className="font-medium">Logout</span>
            </div>
          ) : (
            <Link href="/login">
              <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <span className="font-medium">Login</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
