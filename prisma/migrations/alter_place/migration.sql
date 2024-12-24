-- Enable PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Alter the "location" column to use the geography type
ALTER TABLE "Place"
  ALTER COLUMN "location" TYPE geography(Point, 4326) USING "location"::geography;
