import { Instagram, ShieldCheck, UserCheck, Clock } from "lucide-react";

const DMExplainer = () => {
  return (
    <section className="px-4 sm:px-6 py-16 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Mock DM Thread */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden max-w-sm mx-auto md:mx-0 w-full">
            {/* DM Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/40">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-amber-500 flex items-center justify-center">
                <Instagram className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Berry_Rewards</p>
                <p className="text-[11px] text-muted-foreground">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 flex flex-col gap-3 min-h-[220px]">
              {/* User message */}
              <div className="self-end max-w-[75%]">
                <div className="bg-primary text-primary-foreground text-sm px-4 py-2.5 rounded-2xl rounded-br-md">
                  Hi! Just bought the Stanley tumbler through your link 🧋
                </div>
                <p className="text-[10px] text-muted-foreground text-right mt-1">2:34 PM</p>
              </div>

              {/* User receipt image placeholder */}
              <div className="self-end max-w-[60%]">
                <div className="bg-muted border border-border rounded-2xl rounded-br-md px-4 py-6 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">📎 order-receipt.png</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-right mt-1">2:34 PM</p>
              </div>

              {/* Berry reply */}
              <div className="self-start max-w-[75%]">
                <div className="bg-muted text-foreground text-sm px-4 py-2.5 rounded-2xl rounded-bl-md">
                  Got it! ✅ Your $5 amazon reward is confirmed. 💸
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">2:41 PM</p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Why DM instead of automatic?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              We keep it personal so every reward is verified and paid out fast.
            </p>

            <ul className="space-y-5">
              <li className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Fraud-proof verification</p>
                  <p className="text-xs text-muted-foreground">
                    We manually verify every purchase so rewards go to real buyers — not bots.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Faster payouts</p>
                  <p className="text-xs text-muted-foreground">
                    No waiting for automated systems. Once verified, we pay within 24 hours.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Real human support</p>
                  <p className="text-xs text-muted-foreground">
                    Have a question? You're talking to a real person, not a chatbot.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DMExplainer;
