-- Drop existing restrictive policies and recreate as permissive with explicit role targeting
-- This ensures only authenticated users can access their own data

-- Drop existing profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate as permissive policies with explicit authenticated role targeting
-- This provides defense-in-depth: both role check AND ownership check

CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add comment documenting the security design
COMMENT ON TABLE public.profiles IS 'User profiles with sensitive data (email, payment IDs). Access restricted to authenticated users viewing/modifying only their own profile.';