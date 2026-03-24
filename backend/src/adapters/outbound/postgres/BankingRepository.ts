import { query } from '@infrastructure/db/client';
import { BankEntry } from '@core/domain/Banking';
import { IBankingRepository } from '@core/ports/outbound/IBankingRepository';

interface BankRow {
  id: string;
  ship_id: string;
  year: number;
  amount_gco2eq: string;
  type: 'banked' | 'applied';
  created_at: Date;
}

function mapRow(row: BankRow): BankEntry {
  return {
    id: row.id,
    shipId: row.ship_id,
    year: row.year,
    amountGco2eq: Number(row.amount_gco2eq),
    type: row.type,
    createdAt: row.created_at,
  };
}

export class BankingRepository implements IBankingRepository {
  async save(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry> {
    const result = await query<BankRow>(
      `INSERT INTO bank_entries (ship_id, year, amount_gco2eq, type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, ship_id, year, amount_gco2eq, type, created_at`,
      [entry.shipId, entry.year, entry.amountGco2eq, entry.type],
    );
    return mapRow(result.rows[0]);
  }

  async getTotalByType(
    shipId: string,
    year: number,
    type: 'banked' | 'applied',
  ): Promise<number> {
    const result = await query<{ total: string }>(
      `SELECT COALESCE(SUM(amount_gco2eq), 0) AS total
       FROM bank_entries
       WHERE ship_id = $1 AND year = $2 AND type = $3`,
      [shipId, year, type],
    );
    return Number(result.rows[0].total);
  }

  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await query<BankRow>(
      `SELECT * FROM bank_entries
       WHERE ship_id = $1 AND year = $2
       ORDER BY created_at DESC`,
      [shipId, year],
    );
    return result.rows.map(mapRow);
  }
}
