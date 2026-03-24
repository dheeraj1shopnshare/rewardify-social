import { Search, Camera, Star, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "STEP 1",
    icon: <Search className="w-8 h-8 text-primary" />,
    iconBg: "bg-primary/10",
    badgeBg: "bg-primary/10 text-primary",
    title: "Search & shop",
    description: "Find a product and buy via the affiliate link",
  },
  {
    step: "STEP 2",
    icon: <Camera className="w-8 h-8 text-pink-500" />,
    iconBg: "bg-pink-100",
    badgeBg: "bg-pink-100 text-pink-500",
    title: "Post your story",
    description: "Share on Instagram & send us the screenshot",
  },
  {
    step: "STEP 3",
    icon: <Star className="w-8 h-8 text-amber-500" />,
    iconBg: "bg-amber-100",
    badgeBg: "bg-amber-100 text-amber-600",
    title: "Get rewarded",
    description: "We verify your post and send your gift card",
    badge: "$5 Amazon gift card",
  },
];

const MarketplaceSteps = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 max-w-4xl mx-auto mb-10">
      {steps.map((step, index) => (
        <div key={step.step} className="flex items-center gap-4">
          <div className="flex flex-col items-center text-center max-w-[200px]">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 ${step.badgeBg}`}>
              {step.step}
            </span>
            <div className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center mb-3`}>
              {step.icon}
            </div>
            <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            {step.badge && (
              <span className="mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                {step.badge}
              </span>
            )}
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="hidden md:block w-5 h-5 text-muted-foreground/40 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
};

export default MarketplaceSteps;
