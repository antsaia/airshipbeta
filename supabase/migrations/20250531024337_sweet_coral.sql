-- Create the releases table
CREATE TABLE IF NOT EXISTS releases (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  date text NOT NULL,
  description text NOT NULL,
  status text NOT NULL CHECK (status IN ('Beta')),
  documentation text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public read access" ON releases;
    DROP POLICY IF EXISTS "Allow authenticated users to manage releases" ON releases;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON releases
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to manage releases
CREATE POLICY "Allow authenticated users to manage releases"
  ON releases
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert some sample data
INSERT INTO releases (title, date, description, status, documentation)
VALUES 
  (
    'Enhanced Performance Optimization',
    '2025-03-15',
    'Major improvements to system performance and resource utilization.',
    'Beta',
    '# Performance Optimization Update\n\n## Key Improvements\n\n- Reduced latency by 40%\n- Optimized memory usage\n- Improved database query performance\n\n## Technical Details\n\nThe latest update includes significant backend optimizations...'
  ),
  (
    'New Analytics Dashboard',
    '2025-03-01',
    'Introducing a powerful new analytics dashboard with real-time insights.',
    'Beta',
    '# Analytics Dashboard\n\n## Features\n\n- Real-time data visualization\n- Custom report generation\n- Advanced filtering options\n\n## Usage Guide\n\nTo access the new dashboard...'
  );