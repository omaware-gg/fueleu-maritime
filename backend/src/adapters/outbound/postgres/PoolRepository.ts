import pool from '@infrastructure/db/client';
import { Pool as DomainPool, PoolMember } from '@core/domain/Pool';
import { IPoolRepository } from '@core/ports/outbound/IPoolRepository';

export class PoolRepository implements IPoolRepository {
  async create(year: number, members: PoolMember[]): Promise<DomainPool> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const poolResult = await client.query<{ id: string; year: number; created_at: Date }>(
        'INSERT INTO pools (year) VALUES ($1) RETURNING id, year, created_at',
        [year],
      );
      const poolRow = poolResult.rows[0];

      for (const member of members) {
        await client.query(
          `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
           VALUES ($1, $2, $3, $4)`,
          [poolRow.id, member.shipId, member.cbBefore, member.cbAfter],
        );
      }

      await client.query('COMMIT');

      return {
        id: poolRow.id,
        year: poolRow.year,
        members,
        createdAt: poolRow.created_at,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
