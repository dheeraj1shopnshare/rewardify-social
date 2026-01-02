-- Create table for guest submissions from QR code scans
CREATE TABLE public.guest_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instagram_id TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (guests can submit without auth)
CREATE POLICY "Allow anonymous inserts"
ON public.guest_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Only admins can view submissions (via edge function with service role)
CREATE POLICY "No public read access"
ON public.guest_submissions
FOR SELECT
USING (false);