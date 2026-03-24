import { Pool } from '../../domain/Pool';

export interface IPoolService {
  createPool(
    year: number,
    members: { shipId: string; cb: number }[],
  ): Promise<Pool>;
}
