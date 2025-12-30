-- Add explicit RLS policies to block all public access to admin tables
-- These tables are ONLY accessible via edge functions using service role key

-- Policy for admins table: explicitly deny all access (service role bypasses RLS)
-- This makes the security intent clear and provides defense-in-depth
CREATE POLICY "No public access to admins table" 
ON public.admins 
FOR ALL 
USING (false);

-- Policy for admin_sessions table: explicitly deny all access (service role bypasses RLS)
CREATE POLICY "No public access to admin_sessions table" 
ON public.admin_sessions 
FOR ALL 
USING (false);

-- Add comments documenting the security design
COMMENT ON TABLE public.admins IS 'Admin credentials table - ONLY accessible via service role through admin-auth edge function. All public access blocked by RLS.';
COMMENT ON TABLE public.admin_sessions IS 'Admin session tokens - ONLY accessible via service role through admin-auth edge function. All public access blocked by RLS.';