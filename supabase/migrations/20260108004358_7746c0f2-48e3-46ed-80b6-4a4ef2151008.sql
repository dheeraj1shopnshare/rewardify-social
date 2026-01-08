-- Add restrictive RLS policy to admin_password_resets table
CREATE POLICY "No public access to admin_password_resets" 
ON public.admin_password_resets 
FOR ALL 
USING (false);