
import { Award, Gift, MessageSquare, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-['Inter']">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium inline-block mb-6"
          >
            Introducing Social Rewards
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
            Turn your social media presence into rewards. Share, engage, and earn points with every post.
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-colors"
          >
            Start Earning Rewards
          </motion.button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to start earning rewards</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <MessageSquare className="w-8 h-8 text-primary" />,
                title: "Share Posts",
                description: "Create and share engaging content on your social media platforms"
              },
              {
                icon: <Award className="w-8 h-8 text-primary" />,
                title: "Earn Points",
                description: "Get points for engagement - likes, comments, and shares"
              },
              {
                icon: <Gift className="w-8 h-8 text-primary" />,
                title: "Claim Rewards",
                description: "Redeem your points for exclusive rewards and perks"
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

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Benefits that make our program stand out</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Instant reward redemption",
              "Multiple social platforms supported",
              "Fair point system",
              "Exclusive perks and bonuses"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center p-6 bg-white rounded-xl border border-gray-100"
              >
                <div className="mr-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-lg text-gray-800 font-medium">{benefit}</p>
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
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of creators who are already earning rewards for their social media presence.
            </p>
            <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-full font-semibold text-lg transition-colors">
              Join Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
