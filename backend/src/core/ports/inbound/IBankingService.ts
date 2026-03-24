import { BankEntry } from '../../domain/Banking';

export interface IBankingService {
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(
    shipId: string,
    year: number,
    amount: number,
  ): Promise<{ cbBefore: number; banked: number; cbAfter: number }>;
  applyBanked(
    shipId: string,
    year: number,
    amount: number,
  ): Promise<{ cbBefore: number; applied: number; cbAfter: number }>;
}
