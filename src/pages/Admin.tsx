import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { Shield, Users, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface UserWithStats {
  user_id: string;
  email: string | null;
  display_name: string | null;
  total_earned: number;
  posts_submitted: number;
  rewards_claimed: number;
  current_streak: number;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [editingUser, setEditingUser] = useState<UserWithStats | null>(null);
  const [editForm, setEditForm] = useState({
    total_earned: 0,
    posts_submitted: 0,
    rewards_claimed: 0,
    current_streak: 0,
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      if (!user) return;

      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) {
        console.error('Error checking admin role:', roleError);
        setLoading(false);
        return;
      }

      if (!roleData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      // Fetch all users with their stats
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, display_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setLoading(false);
        return;
      }

      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*');

      if (statsError) {
        console.error('Error fetching stats:', statsError);
        setLoading(false);
        return;
      }

      // Combine profiles with stats
      const usersWithStats: UserWithStats[] = profilesData.map((profile) => {
        const stats = statsData?.find((s) => s.user_id === profile.user_id);
        return {
          user_id: profile.user_id,
          email: profile.email,
          display_name: profile.display_name,
          total_earned: stats?.total_earned ? Number(stats.total_earned) : 0,
          posts_submitted: stats?.posts_submitted || 0,
          rewards_claimed: stats?.rewards_claimed || 0,
          current_streak: stats?.current_streak || 0,
        };
      });

      setUsers(usersWithStats);
      setLoading(false);
    };

    if (user) {
      checkAdminAndFetchUsers();
    }
  }, [user]);

  const handleEdit = (userStats: UserWithStats) => {
    setEditingUser(userStats);
    setEditForm({
      total_earned: userStats.total_earned,
      posts_submitted: userStats.posts_submitted,
      rewards_claimed: userStats.rewards_claimed,
      current_streak: userStats.current_streak,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    // Check if stats exist for this user
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('id')
      .eq('user_id', editingUser.user_id)
      .maybeSingle();

    let error;

    if (existingStats) {
      // Update existing stats
      const { error: updateError } = await supabase
        .from('user_stats')
        .update({
          total_earned: editForm.total_earned,
          posts_submitted: editForm.posts_submitted,
          rewards_claimed: editForm.rewards_claimed,
          current_streak: editForm.current_streak,
        })
        .eq('user_id', editingUser.user_id);
      error = updateError;
    } else {
      // Insert new stats
      const { error: insertError } = await supabase
        .from('user_stats')
        .insert({
          user_id: editingUser.user_id,
          total_earned: editForm.total_earned,
          posts_submitted: editForm.posts_submitted,
          rewards_claimed: editForm.rewards_claimed,
          current_streak: editForm.current_streak,
        });
      error = insertError;
    }

    if (error) {
      console.error('Error saving stats:', error);
      toast.error('Failed to save user statistics');
      return;
    }

    // Update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === editingUser.user_id
          ? { ...u, ...editForm }
          : u
      )
    );

    toast.success('User statistics updated successfully');
    setDialogOpen(false);
    setEditingUser(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
                <p className="text-muted-foreground">You don't have permission to access this page.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navigation />
      <div className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage user statistics and rewards</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Statistics
              </CardTitle>
              <CardDescription>View and edit user statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Total Earned</TableHead>
                        <TableHead className="text-right">Posts</TableHead>
                        <TableHead className="text-right">Rewards</TableHead>
                        <TableHead className="text-right">Streak</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userStats) => (
                        <TableRow key={userStats.user_id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{userStats.display_name || 'No name'}</p>
                              <p className="text-xs text-muted-foreground">{userStats.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">${userStats.total_earned.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-mono">{userStats.posts_submitted}</TableCell>
                          <TableCell className="text-right font-mono">{userStats.rewards_claimed}</TableCell>
                          <TableCell className="text-right font-mono">{userStats.current_streak}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(userStats)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Statistics</DialogTitle>
              <DialogDescription>
                Update statistics for {editingUser?.display_name || editingUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="total_earned">Total Earned ($)</Label>
                <Input
                  id="total_earned"
                  type="number"
                  step="0.01"
                  value={editForm.total_earned}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, total_earned: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="posts_submitted">Posts Submitted</Label>
                <Input
                  id="posts_submitted"
                  type="number"
                  value={editForm.posts_submitted}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, posts_submitted: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rewards_claimed">Rewards Claimed</Label>
                <Input
                  id="rewards_claimed"
                  type="number"
                  value={editForm.rewards_claimed}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, rewards_claimed: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current_streak">Current Streak (days)</Label>
                <Input
                  id="current_streak"
                  type="number"
                  value={editForm.current_streak}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, current_streak: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;