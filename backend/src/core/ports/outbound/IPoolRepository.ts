import { Pool, PoolMember } from '../../domain/Pool';

export interface IPoolRepository {
  create(year: number, members: PoolMember[]): Promise<Pool>;
}
