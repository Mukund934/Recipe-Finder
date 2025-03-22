export default function Footer() {
  return (
    <footer className="bg-white shadow-inner py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-primary">
                <i className="fas fa-utensils text-xl"></i>
              </div>
              <h2 className="text-lg font-heading font-semibold">Recipe Finder</h2>
            </div>
            <p className="text-sm text-neutral-500">Find and save your favorite recipes</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <div className="mb-4 md:mb-0">
              <h3 className="font-heading font-medium text-neutral-700 mb-2">About</h3>
              <ul className="text-sm space-y-1">
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">About Us</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">Contact</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">Terms of Service</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="mb-4 md:mb-0">
              <h3 className="font-heading font-medium text-neutral-700 mb-2">Features</h3>
              <ul className="text-sm space-y-1">
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">Recipe Search</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">Meal Planning</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">Grocery Lists</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-primary transition">Nutrition Info</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-medium text-neutral-700 mb-2">Connect</h3>
              <div className="flex justify-center md:justify-start space-x-4 text-lg">
                <a href="#" className="text-neutral-500 hover:text-primary transition"><i className="fab fa-facebook"></i></a>
                <a href="#" className="text-neutral-500 hover:text-primary transition"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-neutral-500 hover:text-primary transition"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-neutral-500 hover:text-primary transition"><i className="fab fa-pinterest"></i></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 mt-6 pt-6 text-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Recipe Finder. All rights reserved. Powered by Spoonacular API.</p>
        </div>
      </div>
    </footer>
  );
}
