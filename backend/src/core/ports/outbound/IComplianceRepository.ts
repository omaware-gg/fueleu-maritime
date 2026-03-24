import { ComplianceBalance } from '../../domain/Compliance';

export interface IComplianceRepository {
  save(cb: ComplianceBalance): Promise<void>;
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
}
