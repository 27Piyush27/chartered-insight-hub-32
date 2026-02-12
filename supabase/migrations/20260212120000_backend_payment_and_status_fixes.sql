-- Normalize/expand service request status constraints to match app usage.
ALTER TABLE public.service_requests
  DROP CONSTRAINT IF EXISTS service_requests_status_check;

ALTER TABLE public.service_requests
  ADD CONSTRAINT service_requests_status_check
  CHECK (status IN ('pending', 'in_progress', 'in-progress', 'completed', 'paid', 'cancelled'));

-- Allow users to update their own payments during verification callbacks.
DROP POLICY IF EXISTS "Users can update their own payments" ON public.payments;

CREATE POLICY "Users can update their own payments"
ON public.payments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
