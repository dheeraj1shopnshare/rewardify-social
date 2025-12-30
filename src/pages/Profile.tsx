import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import { Instagram, Mail, DollarSign } from 'lucide-react';

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
  venmo_id: string | null;
}

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [tiktokId, setTiktokId] = useState('');
  const [venmoId, setVenmoId] = useState('');

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
        setDisplayName(data.display_name || '');
        setBio(data.bio || '');
        setInstagramId(data.instagram_id || '');
        setTiktokId(data.tiktok_id || '');
        setVenmoId(data.venmo_id || '');
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        bio: bio,
        instagram_id: instagramId,
        tiktok_id: tiktokId,
        venmo_id: venmoId,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
      <div className="pt-32 pb-16 px-4 max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
          <CardHeader className="text-center -mt-16 pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-28 w-28 ring-4 ring-background shadow-lg">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                  {displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Your Profile</CardTitle>
            <CardDescription className="text-muted-foreground">{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagramId" className="flex items-center gap-2 text-sm font-medium">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  Instagram
                </Label>
                <Input
                  id="instagramId"
                  value={instagramId}
                  onChange={(e) => setInstagramId(e.target.value)}
                  placeholder="@username"
                  className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktokId" className="flex items-center gap-2 text-sm font-medium">
                  <TikTokIcon className="h-4 w-4" />
                  TikTok
                </Label>
                <Input
                  id="tiktokId"
                  value={tiktokId}
                  onChange={(e) => setTiktokId(e.target.value)}
                  placeholder="@username"
                  className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="h-11 bg-muted/50 border-muted-foreground/20 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Amazon gift cards will be sent to this email</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venmoId" className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4 text-blue-500" />
                Venmo ID
              </Label>
              <Input
                id="venmoId"
                value={venmoId}
                onChange={(e) => setVenmoId(e.target.value)}
                placeholder="@venmo-username"
                className="h-11 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors resize-none"
              />
            </div>
            
            {!instagramId.trim() && !tiktokId.trim() && (
              <p className="text-sm text-muted-foreground text-center bg-muted/50 py-2 px-4 rounded-md">
                Please add at least one social account to save your profile
              </p>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave} 
                disabled={saving || (!instagramId.trim() && !tiktokId.trim())} 
                className="flex-1 h-11 font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="h-11 px-6 border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
