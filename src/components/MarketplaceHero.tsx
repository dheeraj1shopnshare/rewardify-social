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

        {/* Right column — phone mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex items-center justify-center"
        >
          <div className="relative w-[280px] rounded-[2.5rem] bg-foreground shadow-2xl p-2">
            {/* Status bar */}
            <div className="bg-foreground rounded-t-[2rem] px-5 py-2 flex items-center justify-between text-background/70 text-[10px] font-medium">
              <span>9:41</span>
              <div className="w-20 h-5 bg-foreground rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Screen content */}
            <div className="bg-background rounded-[1.8rem] rounded-t-none px-3 pb-4 pt-3 space-y-3">
              {/* Product card 1 */}
              <div className="rounded-xl border border-border bg-card p-3 flex gap-3 items-center shadow-sm">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  🎧
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">Wireless Earbuds Pro</p>
                  <p className="text-[10px] text-muted-foreground">Electronics</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-foreground">$49.99</span>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">5% back</span>
                  </div>
                </div>
              </div>

              {/* Product card 2 */}
              <div className="rounded-xl border border-border bg-card p-3 flex gap-3 items-center shadow-sm">
                <div className="w-14 h-14 rounded-lg bg-accent/40 flex items-center justify-center text-2xl shrink-0">
                  ✨
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">Skincare Set Bundle</p>
                  <p className="text-[10px] text-muted-foreground">Beauty</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-foreground">$34.99</span>
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">5% back</span>
                  </div>
                </div>
              </div>

              {/* DM preview bubble */}
              <div className="mt-2 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[8px] text-primary-foreground font-bold">BR</span>
                  </div>
                  <span className="text-[10px] font-semibold text-foreground">@Berry_rewards</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Hey! 🎉 Your $10 gift card is ready. Thanks for posting!
                </p>
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center py-2">
              <div className="w-28 h-1 rounded-full bg-background/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MarketplaceHero;
