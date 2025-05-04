
import { Link } from "react-router-dom";
import { ShoppingBag, Gift, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Brands = () => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("Brands component mounted");
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // Store email in localStorage
    try {
      // Get existing waitlist emails
      const existingEmails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]');
      
      // Check if email already exists
      if (existingEmails.includes(email)) {
        toast({
          title: "Already registered",
          description: "This email is already on our waitlist"
        });
        return;
      }
      
      // Add new email and save back to localStorage
      existingEmails.push(email);
      localStorage.setItem('waitlistEmails', JSON.stringify(existingEmails));
      
      // Clear the form
      (e.target as HTMLFormElement).reset();
      
      // Show success toast
      toast({
        title: "Success!",
        description: "You've been added to our waitlist"
      });
      
      console.log('Email submitted and saved:', email);
    } catch (error) {
      console.error('Error saving email:', error);
      toast({
        title: "Something went wrong",
        description: "Unable to add you to the waitlist",
        variant: "destructive"
      });
    }
  };

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.querySelector('#how-it-works');
    howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <nav className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/f7fd8e9d-5949-42bc-9147-977a3f94ce15.png"
            alt="Logo" 
            className="h-24 w-auto object-contain max-w-full" // Reduced height to h-24
          />
        </Link>
        <div className="flex gap-8">
          <Link to="/" className="text-gray-900 font-semibold hover:text-primary transition-colors">
            Shoppers
          </Link>
          <Link to="/brands" className="text-gray-900 font-semibold hover:text-primary transition-colors">
            Brands
          </Link>
          <Link to="/restaurants" className="text-gray-900 font-semibold hover:text-primary transition-colors">
            Restaurants
          </Link>
        </div>
      </nav>

      {/* Hero Section - Increasing top padding from py-20 to py-28 to create more space */}
      <section className="container mx-auto px-4 py-28 md:py-40">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium inline-block mb-6"
          >
            Join Berry Rewards as a Brand
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Amplify Your Brand Through Social Media
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Reward your customers for sharing about their purchase. Real stories drive engagement and expand reach.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={scrollToHowItWorks}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-colors"
          >
            Learn More
          </motion.button>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to start partnering with creators</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <ShoppingBag className="w-8 h-8 text-primary" />,
                title: "List",
                description: "Add your products to our platform and set your rewards program"
              },
              {
                icon: <Gift className="w-8 h-8 text-primary" />,
                title: "Reward",
                description: "Reward your users for sharing about their purchase"
              },
              {
                icon: <Gift className="w-8 h-8 text-primary" />,
                title: "Grow",
                description: "Watch your brand reach new audiences through authentic content"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Partner With Us Today
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our platform and start connecting with authentic creators.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Enter your business email"
                required
                className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button 
                type="submit"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Brands;
