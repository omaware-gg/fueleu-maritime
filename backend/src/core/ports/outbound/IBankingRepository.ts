import { BankEntry } from '../../domain/Banking';

export interface IBankingRepository {
  save(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
  getTotalByType(shipId: string, year: number, type: 'banked' | 'applied'): Promise<number>;
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
}
