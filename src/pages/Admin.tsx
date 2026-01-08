import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Shield, Users, Edit, Save, X, LogOut, Home, QrCode } from 'lucide-react';
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

interface GuestSubmission {
  id: string;
  email: string;
  instagram_id: string;
  created_at: string;
}

// Helper to get admin token
function getAdminToken(): string | null {
  return localStorage.getItem('admin_token');
}

// Helper to make authenticated requests
async function adminFetch(action: string, body: Record<string, any> = {}) {
  const token = getAdminToken();
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ action, ...body }),
    }
  );
  return response.json();
}

async function adminAuthFetch(action: string, extraBody: Record<string, any> = {}) {
  const token = getAdminToken();
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ action, token, ...extraBody }),
    }
  );
  return response.json();
}


const Admin = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [guestSubmissions, setGuestSubmissions] = useState<GuestSubmission[]>([]);
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
    try {
      const data = await adminAuthFetch('validate');

      if (!data?.valid) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
        navigate('/admin/login');
        return;
      }

      setAdminInfo(data.admin);
      await Promise.all([fetchUsers(), fetchGuestSubmissions()]);
    } catch (err) {
      console.error('Session validation error:', err);
      navigate('/admin/login');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminFetch('getUsers');

      if (data?.error) {
        console.error('Error fetching users:', data.error);
        if (data.error === 'Unauthorized') {
          navigate('/admin/login');
          return;
        }
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

  const fetchGuestSubmissions = async () => {
    try {
      const data = await adminFetch('getGuestSubmissions');

      if (data?.error) {
        console.error('Error fetching guest submissions:', data.error);
        return;
      }

      setGuestSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Fetch guest submissions error:', err);
    }
  };

  const handleLogout = async () => {
    await adminAuthFetch('logout');
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

    try {
      const data = await adminFetch('updateStats', {
        userId: editingUser.user_id,
        stats: editForm,
      });

      if (data?.error) {
        if (data.error === 'Unauthorized') {
          navigate('/admin/login');
          return;
        }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Registered Users
              </TabsTrigger>
              <TabsTrigger value="guests" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Statistics
                  </CardTitle>
                  <CardDescription>View and edit registered user statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No registered users found</p>
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
            </TabsContent>

            <TabsContent value="guests">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code Guest Submissions
                  </CardTitle>
                  <CardDescription>View Instagram IDs submitted by guests via QR code</CardDescription>
                </CardHeader>
                <CardContent>
                  {guestSubmissions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No guest submissions found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Instagram ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Submitted At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {guestSubmissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell className="font-medium">@{submission.instagram_id}</TableCell>
                              <TableCell>{submission.email}</TableCell>
                              <TableCell className="text-muted-foreground">{formatDate(submission.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
