import { query } from '@infrastructure/db/client';
import { ComplianceBalance } from '@core/domain/Compliance';
import { IComplianceRepository } from '@core/ports/outbound/IComplianceRepository';

interface ComplianceRow {
  id: string;
  ship_id: string;
  year: number;
  cb_gco2eq: string;
  energy_mj: string;
  created_at: Date;
}

export class ComplianceRepository implements IComplianceRepository {
  async save(cb: ComplianceBalance): Promise<void> {
    await query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq, energy_mj)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [cb.shipId, cb.year, cb.cbGco2eq, cb.energyMj],
    );
  }

  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const result = await query<ComplianceRow>(
      `SELECT * FROM ship_compliance
       WHERE ship_id = $1 AND year = $2
       ORDER BY created_at DESC LIMIT 1`,
      [shipId, year],
    );

    if (!result.rows[0]) return null;

    const row = result.rows[0];
    return {
      shipId: row.ship_id,
      year: row.year,
      cbGco2eq: Number(row.cb_gco2eq),
      energyMj: Number(row.energy_mj),
    };
  }
}
