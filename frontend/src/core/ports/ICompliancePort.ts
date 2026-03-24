import { BankEntry, BankingResult, Pool } from '../domain/Compliance';

export interface ICompliancePort {
  getCB(shipId: string, year: number): Promise<{ cb: number; energyMj: number }>;
  getAdjustedCB(shipId: string, year: number): Promise<{ adjustedCb: number; rawCb: number }>;
}

export interface IBankingPort {
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankingResult>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult>;
}

export interface IPoolPort {
  createPool(year: number, members: { shipId: string; cb: number }[]): Promise<Pool>;
}
