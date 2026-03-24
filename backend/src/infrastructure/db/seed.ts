import { query } from './client';
import pool from './client';

const SEED_ROUTES = [
  ['R001', 'Container', 'HFO', 2024, 91.0, 5000, 12000, 4500, false],
  ['R002', 'BulkCarrier', 'LNG', 2024, 88.0, 4800, 11500, 4200, false],
  ['R003', 'Tanker', 'MGO', 2024, 93.5, 5100, 12500, 4700, false],
  ['R004', 'RoRo', 'HFO', 2025, 89.2, 4900, 11800, 4300, true],
  ['R005', 'Container', 'LNG', 2025, 90.5, 4950, 11900, 4400, false],
] as const;

const UPSERT_SQL = `
  INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity,
                      fuel_consumption, distance_km, total_emissions, is_baseline)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  ON CONFLICT (route_id) DO UPDATE
  SET is_baseline = EXCLUDED.is_baseline
`;

async function seed(): Promise<void> {
  try {
    await query('DELETE FROM routes');
    console.log('Cleared existing routes.');

    for (const row of SEED_ROUTES) {
      await query(UPSERT_SQL, [...row]);
      console.log(`Inserted route ${row[0]}`);
    }

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
