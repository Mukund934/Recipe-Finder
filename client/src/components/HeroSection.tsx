import { useState, KeyboardEvent, ChangeEvent } from "react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    onSearch(term);
  };

  return (
    <section className="relative overflow-hidden mb-12 rounded-2xl shadow-xl">
      {/* Background with pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}></div>
      </div>
      
      <div className="relative py-16 px-6 md:py-20 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm animate-fade-in">
            Find Your Perfect Recipe
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: "0.1s"}}>
            Discover thousands of delicious recipes tailored to your taste and dietary preferences
          </p>
          
          <div className="relative max-w-2xl mx-auto mb-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input 
              type="text" 
              placeholder="Search by recipe, ingredient, or cuisine..."
              className="w-full py-4 pl-12 pr-16 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 gradient-button py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              onClick={handleSearch}
              aria-label="Search recipes"
            >
              Search
            </button>
          </div>
          
          <div className="animate-fade-in" style={{animationDelay: "0.3s"}}>
            <div className="text-white/90 text-sm mb-3">Popular searches:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: "Quick Dinner", icon: "fas fa-clock" },
                { label: "Healthy Meals", icon: "fas fa-heartbeat" },
                { label: "Vegetarian", icon: "fas fa-leaf" },
                { label: "Italian", icon: "fas fa-pizza-slice" },
                { label: "Desserts", icon: "fas fa-cookie" },
              ].map((item, index) => (
                <button 
                  key={index}
                  className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-200"
                  onClick={() => handleQuickSearch(item.label)}
                >
                  <i className={`${item.icon} mr-2`}></i>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-300/20 rounded-full blur-xl"></div>
      <div className="absolute top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
    </section>
  );
}
