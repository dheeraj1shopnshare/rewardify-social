
import { motion } from "framer-motion";

interface HeroSectionProps {
  onLearnMoreClick: () => void;
}

const HeroSection = ({ onLearnMoreClick }: HeroSectionProps) => {
  return (
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
          onClick={onLearnMoreClick}
          className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-colors"
        >
          Learn More
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
