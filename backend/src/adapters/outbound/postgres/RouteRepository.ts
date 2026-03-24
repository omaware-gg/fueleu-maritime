import { query } from '@infrastructure/db/client';
import pool from '@infrastructure/db/client';
import { Route } from '@core/domain/Route';
import { IRouteRepository, RouteFilters } from '@core/ports/outbound/IRouteRepository';

interface RouteRow {
  id: string;
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  year: number;
  ghg_intensity: string;
  fuel_consumption: string;
  distance_km: string;
  total_emissions: string;
  is_baseline: boolean;
}

function mapRow(row: RouteRow): Route {
  return {
    id: row.id,
    routeId: row.route_id,
    vesselType: row.vessel_type,
    fuelType: row.fuel_type,
    year: row.year,
    ghgIntensity: Number(row.ghg_intensity),
    fuelConsumption: Number(row.fuel_consumption),
    distanceKm: Number(row.distance_km),
    totalEmissions: Number(row.total_emissions),
    isBaseline: row.is_baseline,
  };
}

export class RouteRepository implements IRouteRepository {
  async findAll(filters?: RouteFilters): Promise<Route[]> {
    let text = 'SELECT * FROM routes WHERE 1=1';
    const params: unknown[] = [];

    if (filters?.vesselType) {
      params.push(filters.vesselType);
      text += ` AND vessel_type = $${params.length}`;
    }
    if (filters?.fuelType) {
      params.push(filters.fuelType);
      text += ` AND fuel_type = $${params.length}`;
    }
    if (filters?.year) {
      params.push(filters.year);
      text += ` AND year = $${params.length}`;
    }

    text += ' ORDER BY route_id ASC';

    const result = await query<RouteRow>(text, params);
    return result.rows.map(mapRow);
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await query<RouteRow>(
      'SELECT * FROM routes WHERE route_id = $1',
      [routeId],
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async findBaseline(): Promise<Route | null> {
    const result = await query<RouteRow>(
      'SELECT * FROM routes WHERE is_baseline = TRUE LIMIT 1',
    );
    return result.rows[0] ? mapRow(result.rows[0]) : null;
  }

  async setBaseline(routeId: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE routes SET is_baseline = FALSE');
      await client.query('UPDATE routes SET is_baseline = TRUE WHERE route_id = $1', [routeId]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
