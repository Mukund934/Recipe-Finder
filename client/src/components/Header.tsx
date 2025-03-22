import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { isAuthenticated, getCurrentUser, logoutUser, User } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if user is authenticated and get user data
    if (isAuthenticated()) {
      const userData = getCurrentUser();
      setUser(userData);
    }
  }, [location]);
=======
  const [showLoginModal, setShowLoginModal] = useState(false);
>>>>>>> 06d18af (Add user authentication with login and registration functionality.  Includes frontend and backend implementation, using JWT for authentication.)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="container-fluid py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="text-primary bg-orange-50 p-2 rounded-full transition-all duration-300 group-hover:bg-orange-100">
                <i className="fas fa-utensils text-xl"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent transition-all duration-300">
                Recipe Finder
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          {[
            { path: "/", label: "Home", icon: "fas fa-home" },
            { path: "/favorites", label: "Favorites", icon: "far fa-heart" },
            { path: "/profile", label: "Preferences", icon: "fas fa-sliders-h", authRequired: true },
          ].map((item) => {
            // Skip rendering if auth is required but user is not logged in
            if (item.authRequired && !user) return null;
            
            return (
              <Link key={item.path} href={item.path}>
                <span className={`
                  px-3 py-2 rounded-lg flex items-center space-x-1.5 font-medium cursor-pointer
                  transition-all duration-200
                  ${location === item.path 
                    ? "text-primary bg-orange-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  }
                `}>
                  <i className={`${item.icon} text-sm`}></i>
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center space-x-2">
<<<<<<< HEAD
          {user ? (
            <div className="flex items-center">
              <Link href="/profile">
                <div className="relative group mr-2">
                  <div className="flex items-center space-x-3 px-3 py-1.5 rounded-full bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors">
                    <span className="font-medium text-gray-800">{user.name.split(' ')[0]}</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-orange-400 flex items-center justify-center text-white shadow-sm overflow-hidden">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <i className="fas fa-user"></i>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="gradient-button text-sm flex items-center space-x-1"
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
          
=======
          <div className="text-primary">
            <i className="fas fa-utensils text-2xl"></i>
          </div>
          <span className="text-xl font-heading font-semibold cursor-pointer" onClick={() => window.location.href = "/"}>
            Recipe Finder
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <span className={`${location === "/" ? "text-primary" : "text-neutral-700"} hover:text-primary transition font-medium cursor-pointer`}>
              Home
            </span>
          </Link>
          <Link href="/browse">
            <span className={`${location === "/browse" ? "text-primary" : "text-neutral-700"} hover:text-primary transition font-medium cursor-pointer`}>
              Browse
            </span>
          </Link>
          <Link href="/meal-planner">
            <span className={`${location === "/meal-planner" ? "text-primary" : "text-neutral-700"} hover:text-primary transition font-medium cursor-pointer`}>
              Meal Planner
            </span>
          </Link>
          <Link href="/favorites">
            <span className={`${location === "/favorites" ? "text-primary" : "text-neutral-700"} hover:text-primary transition font-medium flex items-center cursor-pointer`}>
              <i className="far fa-heart mr-1"></i> Favorites
            </span>
          </Link>
          <Link href="/login">
            <span className={`${location === "/login" ? "text-primary" : "text-neutral-700"} hover:text-primary transition font-medium flex items-center cursor-pointer`}>
              <i className="fas fa-sign-in-alt mr-1"></i> Login
            </span>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
>>>>>>> 06d18af (Add user authentication with login and registration functionality.  Includes frontend and backend implementation, using JWT for authentication.)
          <button 
            className="md:hidden text-gray-700 hover:text-primary transition p-2 rounded-lg hover:bg-gray-100" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`${mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} text-xl`}></i>
          </button>
<<<<<<< HEAD
        </div>
      </div>
      
      {/* Mobile Menu - Animated slide in/out */}
      <div 
        className={`md:hidden absolute w-full bg-white shadow-lg rounded-b-xl transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1 stagger-animation">
          {[
            { path: "/", label: "Home", icon: "fas fa-home" },
            { path: "/favorites", label: "Favorites", icon: "far fa-heart" },
            { path: "/profile", label: "Preferences", icon: "fas fa-sliders-h", authRequired: true },
          ].map((item, index) => {
            if (item.authRequired && !user) return null;
            
            return (
              <Link key={item.path} href={item.path}>
                <div 
                  className={`
                    flex items-center space-x-3 p-3 rounded-xl transition-colors
                    ${location === item.path ? "bg-orange-50 text-primary" : "hover:bg-gray-50"}
                  `}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${location === item.path ? "bg-primary text-white" : "bg-gray-100"}`}>
                    <i className={item.icon}></i>
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
          
          {user && (
            <div 
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <i className="fas fa-sign-out-alt"></i>
              </div>
              <span className="font-medium">Logout</span>
            </div>
          )}
          
          {!user && (
            <Link href="/login">
              <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-sign-in-alt"></i>
                </div>
                <span className="font-medium">Login</span>
              </div>
            </Link>
          )}
=======
          <Link href="/login">
            <button className="rounded-full bg-gradient-to-r from-primary to-orange-400 h-8 w-8 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <i className="fas fa-user"></i>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t">
          <div className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors duration-200">
            <Link href="/">
              <span className="cursor-pointer block">Home</span>
            </Link>
          </div>
          <div className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors duration-200">
            <Link href="/browse">
              <span className="cursor-pointer block">Browse</span>
            </Link>
          </div>
          <div className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors duration-200">
            <Link href="/meal-planner">
              <span className="cursor-pointer block">Meal Planner</span>
            </Link>
          </div>
          <div className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors duration-200">
            <Link href="/favorites">
              <span className="cursor-pointer block">Favorites</span>
            </Link>
          </div>
          <div className="block px-3 py-2 text-base font-medium text-neutral-700 hover:bg-neutral-200 rounded-md transition-colors duration-200">
            <Link href="/login">
              <span className="cursor-pointer block">Login</span>
            </Link>
          </div>
>>>>>>> 06d18af (Add user authentication with login and registration functionality.  Includes frontend and backend implementation, using JWT for authentication.)
        </div>
      </div>
    </header>
  );
}
