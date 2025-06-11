import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Gift, MessageSquare, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("Index component mounted");
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const instagramHandle = formData.get('instagramHandle') as string;
    
    if (!instagramHandle) {
      toast({
        title: "Invalid Instagram handle",
        description: "Please enter your Instagram handle",
        variant: "destructive"
      });
      return;
    }
    
    // Remove @ symbol if included
    const cleanHandle = instagramHandle.startsWith('@') 
      ? instagramHandle.substring(1) 
      : instagramHandle;
    
    // Store handle in localStorage
    try {
      // Get existing waitlist handles
      const existingHandles = JSON.parse(localStorage.getItem('waitlistHandles') || '[]');
      
      // Check if handle already exists
      if (existingHandles.includes(cleanHandle)) {
        toast({
          title: "Already registered",
          description: "This Instagram handle is already on our waitlist"
        });
        return;
      }
      
      // Add new handle and save back to localStorage
      existingHandles.push(cleanHandle);
      localStorage.setItem('waitlistHandles', JSON.stringify(existingHandles));
      
      // Clear the form
      (e.target as HTMLFormElement).reset();
      
      // Show success toast
      toast({
        title: "Success!",
        description: "You've been added to our waitlist"
      });
      
      console.log('Instagram handle submitted and saved:', cleanHandle);
    } catch (error) {
      console.error('Error saving Instagram handle:', error);
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
            Introducing Berry Rewards
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Get Rewarded for Your Social Media Posts
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Turn your social media presence into rewards. Shop, share and earn rewards with every post.
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
            <p className="text-xl text-gray-600">Three simple steps to start earning rewards</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <ShoppingBag className="w-8 h-8 text-primary" />,
                title: "Shop",
                description: "Browse and shop from our curated selection of partner brands"
              },
              {
                icon: <MessageSquare className="w-8 h-8 text-primary" />,
                title: "Share",
                description: "If you love the product, share it with your friends on your social media"
              },
              {
                icon: <Gift className="w-8 h-8 text-primary" />,
                title: "Earn",
                description: "Earn exclusive rewards and cashbacks for your posts"
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
              Be the First to Know
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our waitlist and be among the first creators to start earning rewards.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="text"
                name="instagramHandle"
                placeholder="Enter your Instagram handle"
                required
                className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button 
                type="submit"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
};

export default Index;
