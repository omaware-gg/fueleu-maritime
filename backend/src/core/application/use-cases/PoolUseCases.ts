import { IPoolService } from '../../ports/inbound/IPoolService';
import { IPoolRepository } from '../../ports/outbound/IPoolRepository';
import { Pool, validatePool, allocatePool } from '../../domain/Pool';

export class PoolUseCases implements IPoolService {
  constructor(private readonly poolRepo: IPoolRepository) {}

  async createPool(
    year: number,
    members: { shipId: string; cb: number }[],
  ): Promise<Pool> {
    const validation = validatePool(members);
    if (!validation.valid) throw new Error(validation.reason);

    const allocatedMembers = allocatePool(members);

    return this.poolRepo.create(year, allocatedMembers);
  }
}
