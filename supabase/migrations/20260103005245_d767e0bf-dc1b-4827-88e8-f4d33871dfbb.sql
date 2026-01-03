-- Add recovery code column to admins table
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS recovery_code_hash TEXT;

-- Create a table to track password reset requests
CREATE TABLE IF NOT EXISTS public.admin_password_resets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admins(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_password_resets ENABLE ROW LEVEL SECURITY;

-- No RLS policies needed since this is only accessed via service role key in edge function