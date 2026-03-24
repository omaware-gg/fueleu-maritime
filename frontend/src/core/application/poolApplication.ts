import { IPoolPort } from '../ports/ICompliancePort';
import { Pool } from '../domain/Compliance';

export async function createPool(
  port: IPoolPort,
  year: number,
  members: { shipId: string; cb: number }[],
): Promise<Pool> {
  return port.createPool(year, members);
}
