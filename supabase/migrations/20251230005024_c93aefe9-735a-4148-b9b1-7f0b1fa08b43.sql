-- Create admins table for separate admin accounts
CREATE TABLE public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- No RLS policies for direct access - admin auth will be handled via edge function

-- Create admin_sessions table for session management
CREATE TABLE public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.admins(id) ON DELETE CASCADE NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at on admins
CREATE TRIGGER update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update user_stats policies to allow admin sessions
-- First drop existing admin policies that rely on user_roles
DROP POLICY IF EXISTS "Admins can view all stats" ON public.user_stats;
DROP POLICY IF EXISTS "Admins can insert stats" ON public.user_stats;
DROP POLICY IF EXISTS "Admins can update stats" ON public.user_stats;
DROP POLICY IF EXISTS "Admins can delete stats" ON public.user_stats;

-- Create function to validate admin session
CREATE OR REPLACE FUNCTION public.is_valid_admin_session(session_token text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_sessions
    WHERE token = session_token
      AND expires_at > now()
  )
$$;