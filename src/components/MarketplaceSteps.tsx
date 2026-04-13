import { Search, Instagram, Star, Gift, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <Search className="w-4 h-4 text-primary" />,
    iconBg: "bg-primary/10",
    title: "Shop via our link",
    description: "Use our search to find anything on Amazon. Complete checkout on Amazon as you normally do.",
  },
  {
    number: "02",
    icon: <Instagram className="w-4 h-4 text-pink-500" />,
    iconBg: "bg-pink-100",
    title: "DM your receipt",
    description: "Send a screenshot of your purchase to @Berry_rewards on Instagram.",
  },
  {
    number: "03",
    icon: <Star className="w-4 h-4 text-amber-500" />,
    iconBg: "bg-amber-100",
    title: "Post your story",
    description: "Share the product on your Instagram story and send us the screenshot.",
    pill: "Verified in 24 hrs",
    pillColor: "bg-primary/10 text-primary border-primary/20",
  },
  {
    number: "04",
    icon: <Gift className="w-4 h-4 text-green-600" />,
    iconBg: "bg-green-100",
    title: "Get rewarded",
    description: "We verify your post and send you an Amazon gift card reward.",
    pill: "+$10 for tagged posts",
    pillColor: "bg-green-50 text-green-700 border-green-200",
  },
];

const MarketplaceSteps = () => {
  return (
    <div className="max-w-4xl mx-auto mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border border-border rounded-xl overflow-hidden bg-card">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`relative p-5 flex flex-col gap-3 ${
              index < steps.length - 1 ? "border-b sm:border-b md:border-b-0 md:border-r border-border" : ""
            } ${index === 1 ? "sm:border-r sm:border-b md:border-b-0 border-border" : ""}`}
          >
            {/* Large faded number */}
            <span className="text-4xl font-bold text-muted-foreground/15 leading-none select-none">
              {step.number}
            </span>

            {/* Icon in rounded square */}
            <div className={`w-8 h-8 rounded-lg ${step.iconBg} flex items-center justify-center`}>
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm text-foreground">{step.title}</h3>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

            {/* Pill tag */}
            {step.pill && (
              <span className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full border ${step.pillColor}`}>
                {step.pill}
              </span>
            )}

            {/* Arrow indicator between cells */}
            {index < steps.length - 1 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-background border border-border items-center justify-center">
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceSteps;
