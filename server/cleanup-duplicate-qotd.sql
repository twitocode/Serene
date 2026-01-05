-- SQL script to remove duplicate QOTD entries, keeping the first one created for each day
-- This will run in a transaction to ensure data consistency

BEGIN;

-- Create a temporary table with the first QOTD for each day
CREATE TEMPORARY TABLE qotd_to_keep AS
SELECT DISTINCT ON (day) id, question, day, created_at, updated_at
FROM community_qotd
ORDER BY day, created_at ASC;

-- Delete all QOTD entries
DELETE FROM community_qotd;

-- Re-insert only the first QOTD for each day
INSERT INTO community_qotd (id, question, day, created_at, updated_at)
SELECT id, question, day, created_at, updated_at
FROM qotd_to_keep;

-- Drop the temporary table
DROP TABLE qotd_to_keep;

-- Show the results
SELECT COUNT(*) as total_qotd FROM community_qotd;

COMMIT;