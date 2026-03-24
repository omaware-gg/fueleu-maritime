export interface ComplianceBalance {
  shipId: string;
  year: number;
  cb: number;
  energyMj: number;
}

export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  type: 'banked' | 'applied';
  createdAt: string;
}

export interface BankingResult {
  cbBefore: number;
  banked?: number;
  applied?: number;
  cbAfter: number;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface Pool {
  id: string;
  year: number;
  members: PoolMember[];
  createdAt: string;
}
