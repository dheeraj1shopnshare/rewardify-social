import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

const allowedHeaders = 'authorization, x-client-info, apikey, content-type';
const allowedMethods = 'POST, OPTIONS';

function getCorsHeaders(req: Request): Record<string, string> {
  // When using cookies (credentials: 'include'), Access-Control-Allow-Origin cannot be '*'.
  // Echo the request Origin and vary the response to keep browsers happy.
  const origin = req.headers.get('origin') ?? '*';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': allowedHeaders,
    'Access-Control-Allow-Methods': allowedMethods,
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };
}

function json(req: Request, data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  const cors = getCorsHeaders(req);
  for (const [k, v] of Object.entries(cors)) headers.set(k, v);

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

// Hash password using bcrypt with automatic salt generation
async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12); // Work factor of 12
  return await bcrypt.hash(password, salt);
}

// Verify password against stored hash
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, storedHash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Generate a secure random token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Parse cookies from request header
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach((cookie) => {
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

// Create secure cookie header
function createCookieHeader(token: string, maxAge: number): string {
  return `admin_token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${maxAge}; Path=/`;
}

// Create cookie header for deletion
function createDeleteCookieHeader(): string {
  return `admin_token=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(req) });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, email, password, displayName } = await req.json();

    console.log(`Admin auth action: ${action}`);

    if (action === 'login') {
      // Login admin
      if (!email || !password) {
        return json(req, { error: 'Email and password required' }, { status: 400 });
      }

      // First, get the admin by email only
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (adminError) {
        console.error('Admin lookup error:', adminError);
        return json(req, { error: 'Authentication failed' }, { status: 401 });
      }

      if (!admin) {
        console.log('Admin not found');
        return json(req, { error: 'Invalid credentials' }, { status: 401 });
      }

      // Verify password using bcrypt
      const isValidPassword = await verifyPassword(password, admin.password_hash);

      if (!isValidPassword) {
        console.log('Invalid password for admin:', email);
        return json(req, { error: 'Invalid credentials' }, { status: 401 });
      }

      // Create session token
      const sessionToken = generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

      const { error: sessionError } = await supabase.from('admin_sessions').insert({
        admin_id: admin.id,
        token: sessionToken,
        expires_at: expiresAt.toISOString(),
      });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return json(req, { error: 'Failed to create session' }, { status: 500 });
      }

      console.log(`Admin ${admin.email} logged in successfully`);

      // Return success with httpOnly cookie containing the token
      const headers = new Headers();
      const cors = getCorsHeaders(req);
      for (const [k, v] of Object.entries(cors)) headers.set(k, v);
      headers.set('Content-Type', 'application/json');
      headers.set('Set-Cookie', createCookieHeader(sessionToken, 86400)); // 24 hours

      return new Response(
        JSON.stringify({
          success: true,
          admin: {
            id: admin.id,
            email: admin.email,
            display_name: admin.display_name,
          },
        }),
        { headers }
      );
    }

    if (action === 'validate') {
      // Validate session token from cookies
      const token = getTokenFromCookies(req);

      if (!token) {
        return json(req, { valid: false });
      }

      const { data: session, error: sessionError } = await supabase
        .from('admin_sessions')
        .select('*, admins(*)')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (sessionError || !session) {
        return json(req, { valid: false });
      }

      return json(req, {
        valid: true,
        admin: {
          id: session.admins.id,
          email: session.admins.email,
          display_name: session.admins.display_name,
        },
      });
    }

    if (action === 'logout') {
      // Logout - delete session and clear cookie
      const token = getTokenFromCookies(req);

      if (token) {
        await supabase.from('admin_sessions').delete().eq('token', token);
      }

      const headers = new Headers();
      const cors = getCorsHeaders(req);
      for (const [k, v] of Object.entries(cors)) headers.set(k, v);
      headers.set('Content-Type', 'application/json');
      headers.set('Set-Cookie', createDeleteCookieHeader());

      return new Response(JSON.stringify({ success: true }), { headers });
    }

    if (action === 'create') {
      // Create new admin - ONLY allowed if no admins exist (one-time setup)
      if (!email || !password) {
        return json(req, { error: 'Email and password required' }, { status: 400 });
      }

      // Check if any admin already exists - only allow 1 admin account
      const { count, error: countError } = await supabase
        .from('admins')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Admin count check error:', countError);
        return json(req, { error: 'Failed to verify admin status' }, { status: 500 });
      }

      // Block creation if an admin already exists
      if (count && count > 0) {
        console.log('Admin creation blocked - admin account already exists');
        return json(
          req,
          { error: 'Admin account already exists. Only one admin is allowed.' },
          { status: 403 }
        );
      }

      // Hash password with bcrypt (includes automatic salt)
      const passwordHash = await hashPassword(password);

      const { data: newAdmin, error: createError } = await supabase
        .from('admins')
        .insert({
          email: email.toLowerCase(),
          password_hash: passwordHash,
          display_name: displayName || 'Admin',
        })
        .select()
        .single();

      if (createError) {
        console.error('Admin creation error:', createError);
        return json(req, { error: 'Failed to create admin' }, { status: 500 });
      }

      console.log(`New admin created: ${newAdmin.email}`);

      return json(req, {
        success: true,
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          display_name: newAdmin.display_name,
        },
      });
    }

    return json(req, { error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin auth error:', error);
    return json(req, { error: 'Internal server error' }, { status: 500 });
  }
});
