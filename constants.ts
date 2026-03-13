
import { TaxBracket } from './types';

export const THAI_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 150000, rate: 0 },
  { min: 150001, max: 300000, rate: 0.05 },
  { min: 300001, max: 500000, rate: 0.10 },
  { min: 500001, max: 750000, rate: 0.15 },
  { min: 750001, max: 1000000, rate: 0.20 },
  { min: 1000001, max: 2000000, rate: 0.25 },
  { min: 2000001, max: 5000000, rate: 0.30 },
  { min: 5000001, max: null, rate: 0.35 },
];

// กฎใหม่ปี 2567-2569: ฐานเงินเดือนสูงสุดปรับเป็น 17,500 บาท
export const MAX_SSO_SALARY = 17500;
export const SSO_RATE = 0.05;
export const MAX_SSO_AMOUNT = 875; // 17,500 * 5%

export const STANDARD_DEDUCTION_LIMIT = 100000;
export const PERSONAL_ALLOWANCE = 60000;
