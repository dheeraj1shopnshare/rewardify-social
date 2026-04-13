import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MarketplaceHero = () => {
  const navigate = useNavigate();

  const scrollToSearch = () => {
    document.getElementById("marketplace-search")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left column */}
        <div>
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            47 creators earning this week
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4"
          >
            Shop. Post.{" "}
            <span className="italic font-serif">Get paid.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-md mb-8"
          >
            Buy the products you love on Amazon, share them on social media, and earn real cashback rewards — it's that simple.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <button
              onClick={scrollToSearch}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-3 rounded-full font-semibold text-base transition-colors"
            >
              Start Shopping
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="border border-primary text-primary hover:bg-primary/5 px-7 py-3 rounded-full font-semibold text-base transition-colors"
            >
              Create Account
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex gap-8 pt-6 border-t border-border"
          >
            <div>
              <p className="text-2xl font-bold text-foreground">$12K+</p>
              <p className="text-sm text-muted-foreground">Cashback paid out</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">5%</p>
              <p className="text-sm text-muted-foreground">Avg. cashback rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">7 days</p>
              <p className="text-sm text-muted-foreground">Avg. payout time</p>
            </div>
          </motion.div>
        </div>

        {/* Right column — decorative visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent flex items-center justify-center">
            <div className="absolute inset-4 rounded-2xl bg-background/80 backdrop-blur-sm border border-border shadow-lg flex flex-col items-center justify-center gap-3 p-6">
              <span className="text-5xl">🛒</span>
              <span className="text-4xl">📸</span>
              <span className="text-5xl">💰</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplaceHero;
