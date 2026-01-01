-- Add explicit policy to deny anonymous/public access to profiles table
-- This blocks the 'anon' role from accessing any profile data

CREATE POLICY "Deny anonymous access to profiles" 
ON public.profiles 
FOR SELECT 
TO anon
USING (false);

-- Update table comment to document security design
COMMENT ON TABLE public.profiles IS 'User profiles with sensitive data (email, payment IDs, social handles). Anonymous access explicitly blocked. Only authenticated users can access their own profile.';