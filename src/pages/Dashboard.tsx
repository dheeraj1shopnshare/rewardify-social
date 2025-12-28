import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, Star, Instagram, Target, Award } from 'lucide-react';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const hasConnectedSocial = profile?.instagram_id || profile?.tiktok_id;

  // Mock data for dashboard (in real app, these would come from the database)
  const stats = {
    totalEarned: 250,
    postsSubmitted: 5,
    rewardsRedeemed: 2,
    currentStreak: 3,
  };

  const progressToNextReward = 65;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                {profile?.display_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome back, {profile?.display_name || 'there'}! 🍓
              </h1>
              <p className="text-muted-foreground">Here's your rewards overview</p>
            </div>
          </div>
        </motion.div>

        {/* Social Connection Alert */}
        {!hasConnectedSocial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-primary/30 bg-primary/5 mb-8">
              <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Connect your social accounts</p>
                    <p className="text-sm text-muted-foreground">Start earning by linking Instagram or TikTok</p>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link to="/profile">Complete Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Gift className="h-8 w-8 text-primary" />
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Total</span>
                </div>
                <p className="text-3xl font-bold text-foreground">${stats.totalEarned}</p>
                <p className="text-sm text-muted-foreground">Earned</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 text-secondary-foreground" />
                  <span className="text-xs font-medium text-secondary-foreground bg-secondary/20 px-2 py-1 rounded-full">Posts</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.postsSubmitted}</p>
                <p className="text-sm text-muted-foreground">Posts Submitted</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/30 to-accent/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="h-8 w-8 text-accent-foreground" />
                  <span className="text-xs font-medium text-accent-foreground bg-accent/30 px-2 py-1 rounded-full">Rewards</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.rewardsRedeemed}</p>
                <p className="text-sm text-muted-foreground">Rewards Claimed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Star className="h-8 w-8 text-orange-500" />
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">Streak</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.currentStreak} days</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress & Connected Accounts */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Progress to Next Reward */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Progress to Next Reward
                </CardTitle>
                <CardDescription>Keep posting to unlock your next reward!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Current Progress</span>
                    <span className="font-medium text-primary">{progressToNextReward}%</span>
                  </div>
                  <Progress value={progressToNextReward} className="h-3" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="text-sm font-medium">Next Milestone</p>
                    <p className="text-xs text-muted-foreground">Free dessert at any partner restaurant</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">35</p>
                    <p className="text-xs text-muted-foreground">to next reward</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-lg">Connected Accounts</CardTitle>
                <CardDescription>Your linked social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      <Instagram className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Instagram</p>
                      {profile?.instagram_id ? (
                        <p className="text-xs text-muted-foreground">@{profile.instagram_id.replace('@', '')}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      )}
                    </div>
                  </div>
                  {profile?.instagram_id ? (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">Connected</span>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/profile">Connect</Link>
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-foreground">
                      <TikTokIcon className="h-4 w-4 text-background" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">TikTok</p>
                      {profile?.tiktok_id ? (
                        <p className="text-xs text-muted-foreground">@{profile.tiktok_id.replace('@', '')}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      )}
                    </div>
                  </div>
                  {profile?.tiktok_id ? (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">Connected</span>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/profile">Connect</Link>
                    </Button>
                  )}
                </div>

                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link to="/profile">Manage Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-background to-secondary/5">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Ready to earn more?</h3>
                  <p className="text-sm text-muted-foreground">Explore brands and restaurants with active reward campaigns</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link to="/brands">Browse Brands</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/restaurants">View Restaurants</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
