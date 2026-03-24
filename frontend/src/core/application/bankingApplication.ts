import { IBankingPort } from '../ports/ICompliancePort';
import { BankEntry, BankingResult } from '../domain/Compliance';

export async function getRecords(
  port: IBankingPort,
  shipId: string,
  year: number,
): Promise<BankEntry[]> {
  return port.getRecords(shipId, year);
}

export async function bankSurplus(
  port: IBankingPort,
  shipId: string,
  year: number,
  amount: number,
): Promise<BankingResult> {
  return port.bankSurplus(shipId, year, amount);
}

export async function applyBanked(
  port: IBankingPort,
  shipId: string,
  year: number,
  amount: number,
): Promise<BankingResult> {
  return port.applyBanked(shipId, year, amount);
}
