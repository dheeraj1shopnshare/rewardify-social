
import { motion } from "framer-motion";
import { Gift, MessageSquare, ShoppingBag } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
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
  ];

  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">Three simple steps to start earning rewards</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
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
  );
};

export default HowItWorksSection;
