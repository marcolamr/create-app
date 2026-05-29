-- Rate-limit sign-ups per IP: allows only if fewer than 2 create:user events in the last 5s.
-- Apply with: pnpm db:sql (or pnpm db:sql:firewall)

CREATE OR REPLACE FUNCTION firewall_create_user(clientIp inet) RETURNS boolean AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM events
    WHERE originator_ip = clientIp
      AND type = 'create:user'
      AND created_at > NOW() - INTERVAL '5 seconds'
    OFFSET 1
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql VOLATILE;
