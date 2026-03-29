import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FEATURED_POSTS = [
  {
    id: 1,
    title: "Berry Rewards: The Easiest Way for Bay Area Influencers to Get Paid for Shopping and Posting on Instagram",
    excerpt: "Learn the best strategies to earn more rewards on every purchase.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    category: "Tips & Tricks",
    date: "Mar 20, 2026",
    readTime: "4 min read",
  },
];

const BlogPreview = () => {
  return (
    <section className="py-16 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">From the Blog</h2>
          <p className="text-muted-foreground">Tips, guides, and stories to help you shop smarter</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {FEATURED_POSTS.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden border hover:shadow-lg transition-all duration-300"
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
                <h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
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
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              View All Posts <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
