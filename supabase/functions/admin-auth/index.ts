import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedHeaders = 'authorization, x-client-info, apikey, content-type';
const allowedMethods = 'POST, OPTIONS';

function getCorsHeaders(req: Request): Record<string, string> {
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

// Generate a random salt
function generateSalt(length = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Hash password using PBKDF2 (Web Crypto compatible)
async function hashPassword(password: string, salt?: string): Promise<string> {
  const useSalt = salt || generateSalt();
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(useSalt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return `${useSalt}:${hashHex}`;
}

// Verify password against stored hash
async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, _] = storedHash.split(':');
    if (!salt) return false;

    const newHash = await hashPassword(password, salt);
    return newHash === storedHash;
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

// Generate a 6-digit recovery code
function generateRecoveryCode(): string {
  const array = new Uint8Array(3);
  crypto.getRandomValues(array);
  const num = (array[0] << 16) | (array[1] << 8) | array[2];
  return String(num % 1000000).padStart(6, '0');
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

// Get token from request (header or body)
function getTokenFromRequest(req: Request, body: any): string | null {
  // First try Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Then try body
  if (body?.token) {
    return body.token;
  }
  // Finally try cookies (for backward compatibility)
  const cookieHeader = req.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  return cookies['admin_token'] || null;
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

    const body = await req.json();
    const { action, email, password, displayName, code, newPassword } = body;

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

      // Verify password
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

      // Return success with token in response body (for cross-domain compatibility)
      return json(req, {
        success: true,
        token: sessionToken,
        admin: {
          id: admin.id,
          email: admin.email,
          display_name: admin.display_name,
        },
      });
    }

    if (action === 'validate') {
      // Validate session token from header, body, or cookies
      const token = getTokenFromRequest(req, body);

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
      // Logout - delete session
      const token = getTokenFromRequest(req, body);

      if (token) {
        await supabase.from('admin_sessions').delete().eq('token', token);
      }

      return json(req, { success: true });
    }

    if (action === 'request-reset') {
      // Request a password reset - generates a 6-digit code valid for 15 minutes
      if (!email) {
        return json(req, { error: 'Email required' }, { status: 400 });
      }

      // Find the admin
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (adminError || !admin) {
        // Don't reveal whether the email exists
        console.log('Reset requested for unknown email:', email);
        return json(req, { success: true, message: 'If the email exists, a reset code has been generated.' });
      }

      // Generate a 6-digit code
      const resetCode = generateRecoveryCode();
      const codeHash = await hashPassword(resetCode);
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minute expiry

      // Store the reset code
      const { error: insertError } = await supabase.from('admin_password_resets').insert({
        admin_id: admin.id,
        code_hash: codeHash,
        expires_at: expiresAt.toISOString(),
      });

      if (insertError) {
        console.error('Failed to create reset code:', insertError);
        return json(req, { error: 'Failed to create reset code' }, { status: 500 });
      }

      console.log(`Password reset code generated for ${admin.email}: ${resetCode}`);

      // In a production app, you would email this code to the user
      // For now, we return it directly (you can remove this in production)
      return json(req, {
        success: true,
        code: resetCode, // Remove this in production - only for testing
        message: 'Reset code generated. Check your email (or logs for testing).',
      });
    }

    if (action === 'reset-password') {
      // Reset password using the 6-digit code
      if (!email || !code || !newPassword) {
        return json(req, { error: 'Email, code, and new password required' }, { status: 400 });
      }

      // Find the admin
      const { data: admin, error: adminError } = await supabase
        .from('admins')
        .select('id, email')
        .eq('email', email.toLowerCase())
        .maybeSingle();

      if (adminError || !admin) {
        return json(req, { error: 'Invalid reset request' }, { status: 400 });
      }

      // Find valid, unused reset codes for this admin
      const { data: resets, error: resetError } = await supabase
        .from('admin_password_resets')
        .select('*')
        .eq('admin_id', admin.id)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (resetError || !resets || resets.length === 0) {
        return json(req, { error: 'No valid reset code found. Please request a new one.' }, { status: 400 });
      }

      // Check if any of the codes match
      let matchedReset = null;
      for (const reset of resets) {
        const isValid = await verifyPassword(code, reset.code_hash);
        if (isValid) {
          matchedReset = reset;
          break;
        }
      }

      if (!matchedReset) {
        return json(req, { error: 'Invalid reset code' }, { status: 400 });
      }

      // Mark the reset code as used
      await supabase
        .from('admin_password_resets')
        .update({ used_at: new Date().toISOString() })
        .eq('id', matchedReset.id);

      // Update the password
      const newPasswordHash = await hashPassword(newPassword);
      const { error: updateError } = await supabase
        .from('admins')
        .update({ password_hash: newPasswordHash, updated_at: new Date().toISOString() })
        .eq('id', admin.id);

      if (updateError) {
        console.error('Failed to update password:', updateError);
        return json(req, { error: 'Failed to update password' }, { status: 500 });
      }

      // Invalidate all existing sessions for this admin
      await supabase.from('admin_sessions').delete().eq('admin_id', admin.id);

      console.log(`Password reset successful for ${admin.email}`);

      return json(req, { success: true, message: 'Password has been reset. Please log in with your new password.' });
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

      // Hash password with PBKDF2
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
