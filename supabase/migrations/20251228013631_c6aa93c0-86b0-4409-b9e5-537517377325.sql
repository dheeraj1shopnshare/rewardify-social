-- Add social media columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN instagram_id text,
ADD COLUMN tiktok_id text;