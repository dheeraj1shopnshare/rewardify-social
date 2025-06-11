
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-8 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/f7fd8e9d-5949-42bc-9147-977a3f94ce15.png"
              alt="Logo" 
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms and Conditions
            </Link>
            <span>© 2024 Berry Rewards. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
