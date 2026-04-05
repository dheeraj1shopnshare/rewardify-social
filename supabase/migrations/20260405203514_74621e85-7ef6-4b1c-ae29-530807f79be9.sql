
CREATE TABLE public.search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_term text NOT NULL,
  user_id uuid DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous) to insert search logs
CREATE POLICY "Allow anonymous inserts to search_logs"
  ON public.search_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read search logs
CREATE POLICY "Only admins can read search_logs"
  ON public.search_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
