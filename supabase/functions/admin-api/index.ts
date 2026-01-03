import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

// Parse cookies from request header
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length > 0) {
      cookies[name] = rest.join('=');
    }
  });
  return cookies;
}

// Get token from cookies
function getTokenFromCookies(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  return cookies['admin_token'] || null;
}

async function validateAdminToken(supabase: any, token: string): Promise<boolean> {
  if (!token) return false;

  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('id')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  return !error && !!session;
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate admin token from httpOnly cookie
    const adminToken = getTokenFromCookies(req);
    const isValid = await validateAdminToken(supabase, adminToken || '');

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, userId, stats } = await req.json();

    console.log(`Admin API action: ${action}`);

    if (action === 'getUsers') {
      // Get all users with their profiles and stats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, display_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch profiles' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*');

      if (statsError) {
        console.error('Error fetching stats:', statsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch stats' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Combine profiles with stats
      const users = (profiles || []).map((profile: any) => {
        const userStats = statsData?.find((s: any) => s.user_id === profile.user_id);
        return {
          user_id: profile.user_id,
          email: profile.email,
          display_name: profile.display_name,
          total_earned: userStats?.total_earned ? Number(userStats.total_earned) : 0,
          posts_submitted: userStats?.posts_submitted || 0,
          rewards_claimed: userStats?.rewards_claimed || 0,
          current_streak: userStats?.current_streak || 0,
        };
      });

      return new Response(
        JSON.stringify({ users }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'getGuestSubmissions') {
      // Get all guest submissions (QR code scans)
      const { data: submissions, error: submissionsError } = await supabase
        .from('guest_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (submissionsError) {
        console.error('Error fetching guest submissions:', submissionsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch guest submissions' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ submissions: submissions || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'updateStats') {
      // Update user stats
      if (!userId || !stats) {
        return new Response(
          JSON.stringify({ error: 'User ID and stats required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if stats exist
      const { data: existing } = await supabase
        .from('user_stats')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      let error;

      if (existing) {
        const { error: updateError } = await supabase
          .from('user_stats')
          .update({
            total_earned: stats.total_earned,
            posts_submitted: stats.posts_submitted,
            rewards_claimed: stats.rewards_claimed,
            current_streak: stats.current_streak,
          })
          .eq('user_id', userId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('user_stats')
          .insert({
            user_id: userId,
            total_earned: stats.total_earned,
            posts_submitted: stats.posts_submitted,
            rewards_claimed: stats.rewards_claimed,
            current_streak: stats.current_streak,
          });
        error = insertError;
      }

      if (error) {
        console.error('Error updating stats:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update stats' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Admin API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' } }
    );
  }
});
