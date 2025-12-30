import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Shield, Users, Edit, Save, X, LogOut, Home } from 'lucide-react';
import { toast } from 'sonner';

interface AdminInfo {
  id: string;
  email: string;
  display_name: string;
}

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
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
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
    validateSession();
  }, []);

  const validateSession = async () => {
    const token = localStorage.getItem('admin_token');
    const storedInfo = localStorage.getItem('admin_info');

    if (!token || !storedInfo) {
      navigate('/admin/login');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'validate', token },
      });

      if (error || !data?.valid) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
        navigate('/admin/login');
        return;
      }

      setAdminInfo(data.admin);
      await fetchUsers(token);
    } catch (err) {
      console.error('Session validation error:', err);
      navigate('/admin/login');
    }
  };

  const fetchUsers = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-api', {
        body: { action: 'getUsers' },
        headers: { 'x-admin-token': token },
      });

      if (error || data?.error) {
        console.error('Error fetching users:', data?.error || error);
        toast.error('Failed to fetch users');
        return;
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('admin_token');

    await supabase.functions.invoke('admin-auth', {
      body: { action: 'logout', token },
    });

    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

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

    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('admin-api', {
        body: {
          action: 'updateStats',
          userId: editingUser.user_id,
          stats: editForm,
        },
        headers: { 'x-admin-token': token },
      });

      if (error || data?.error) {
        toast.error('Failed to save user statistics');
        return;
      }

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === editingUser.user_id ? { ...u, ...editForm } : u
        )
      );

      toast.success('User statistics updated successfully');
      setDialogOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save changes');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Admin Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">{adminInfo?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-8 pb-16 px-4 max-w-6xl mx-auto">
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