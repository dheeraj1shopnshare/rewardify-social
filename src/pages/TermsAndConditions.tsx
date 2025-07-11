
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white font-['Inter']">
      <nav className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/f7fd8e9d-5949-42bc-9147-977a3f94ce15.png"
            alt="Logo" 
            className="h-24 w-auto object-contain max-w-full"
          />
        </Link>
        <div className="flex gap-8">
          <Link to="/" className="text-gray-900 font-semibold hover:text-primary transition-colors">
            Shoppers
          </Link>
          <Link to="/brands" className="text-gray-900 font-semibold hover:text-primary transition-colors">
            Brands
          </Link>
          <Link to="/restaurants" className="text-gray-900 font-semibold hover:text-primary transition-colors">
            Restaurants
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-32 max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          Terms and Conditions
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              For Brand Partners:
              1. Acceptance of Terms</h2>
            <p>
              These Terms & Conditions ("Agreement") govern your participation as a restaurant partner (“you” or “Restaurant”) in the Berry Rewards platform (“we,” “us,” or “Berry Rewards”). By submitting our onboarding form or agreeing verbally or in writing, you consent to the terms outlined below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Program Overview</h2>
            <p>
              Berry Rewards connects local restaurants with real customers and content creators who share their dining experiences on social media. As a participating restaurant, your business will be visible to users and may be tagged in content shared by our community.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Consent to Listing and Promotion</h2>
            <p>
              By participating in the program, you grant Berry Rewards permission to:
              •	List your restaurant on our website, social media pages, or platform directory.
              •	Display your business name, location, logo, and offer details submitted by you.
              •	Reshare publicly available content, including photos, videos, and stories, created and tagged by Berry Rewards users about your restaurant.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Offer Participation</h2>
            <p>
              •	Berry Rewards will not charge any fees from restaurants for participating in the program
•	The restaurant is free to offer any additional discounts, promotions, or incentives to Berry Rewards users at its own discretion. These additional offers are optional and not managed or enforced by Berry Rewards.
•	Participation in any reward-based activity is voluntary and non-binding until confirmed by you.

            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Content and Brand Use</h2>
            <p>
              •	You grant Berry Rewards permission to use your logo and images solely to promote your restaurant within our platform, social channels, and marketing materials.
•	You acknowledge that user-generated content is owned by the creator, but Berry Rewards may reshare content where your restaurant is tagged or mentioned.

            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Reward Availability</h2>
            <p>
             •	Berry Rewards offers are limited and may only be available to a set number of users. We reserve the right to determine the duration, availability, and value of any rewards at our sole discretion.
•	There is no guarantee of user participation, reach, or business outcome.

            </p>
          </section>

         <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Communication</h2>
            <p>
             •	Any contact information you provide will only be used for communications related to your campaign or participation in the Berry Rewards program.
•	We will not share your data with third parties without consent.

            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
            <p>
             •	You may opt out of the program at any time by providing written notice to ch.manjudheeraj@gmail.com.
•	Berry Rewards reserves the right to remove or suspend your listing at any time for any reason, including non-compliance with these terms.


            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p>
             Berry Rewards is not liable for:
•	The accuracy or tone of user-generated content,
•	Customer behavior or feedback,
•	Business performance results resulting from participation.
Participation in this program is at your own discretion and risk.

            </p>
          </section>

           <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p>
            Berry Rewards reserves the right to update these Terms & Conditions at any time. Continued participation following updates constitutes acceptance of the revised terms.

            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact </h2>
            <p>
              If you have any questions or would like to update your listing, please contact us at:
ch.manjudheeraj@gmail.com

            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
