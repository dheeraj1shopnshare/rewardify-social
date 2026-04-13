import { CheckCircle } from "lucide-react";

const items = [
  "Powered by Amazon Associates",
  "Verified within 24 hours",
  "No app download",
  "Payout within 1 day",
  "Zero signup fee",
];

const TrustBar = () => {
  return (
    <div className="w-full border-y border-border bg-muted/40 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
