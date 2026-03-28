import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BLOG_POSTS = [
  {
    id: 1,
    title: "Berry Rewards: The Easiest Way for Bay Area Influencers to Get Paid for Shopping and Posting on Instagram",
    excerpt: "Learn the best strategies to earn more rewards on every purchase. From timing your buys to stacking deals, we cover it all.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    category: "Tips & Tricks",
    date: "Mar 20, 2026",
    readTime: "4 min read",
  },
  {
    id: 2,
    title: "Top 10 Beauty Products Worth Buying This Spring",
    excerpt: "Spring is here and so are amazing beauty deals. Check out our curated list of must-have skincare and makeup products.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
    category: "Product Picks",
    date: "Mar 15, 2026",
    readTime: "5 min read",
  },
  {
    id: 3,
    title: "Why Brands Love Working with Micro-Influencers",
    excerpt: "Discover why brands are shifting their marketing budgets toward micro-influencers and how you can benefit from this trend.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop",
    category: "Industry",
    date: "Mar 10, 2026",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "5 Ways to Create Scroll-Stopping Instagram Content",
    excerpt: "Stand out in the feed with these proven content creation tips that will boost your engagement and help you earn more rewards.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop",
    category: "Content Creation",
    date: "Mar 5, 2026",
    readTime: "3 min read",
  },
  {
    id: 5,
    title: "The Ultimate Guide to Affiliate Shopping",
    excerpt: "Everything you need to know about affiliate links, how they work, and how to make the most of every click.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop",
    category: "Guides",
    date: "Feb 28, 2026",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "Berry Rewards: Our Story and Mission",
    excerpt: "From a simple idea to a thriving community of shoppers and creators — here's how Berry Rewards came to be.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    category: "Company",
    date: "Feb 20, 2026",
    readTime: "4 min read",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Navigation />
      <div className="pt-32 px-4 sm:px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">Blog</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tips, guides, and stories to help you shop smarter and earn more
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <Link
                to={post.id === 1 ? "/blog/berry-rewards-bay-area-influencers" : "#"}
                key={post.id}
              >
              <Card
                className="group overflow-hidden border hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-5 space-y-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <h2 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
              </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
