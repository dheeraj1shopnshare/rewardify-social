
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default CTASection;
