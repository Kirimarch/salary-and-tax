
export interface IncomeData {
  baseSalary: number;
  workingDaysPerMonth: number; // วันทำงานทั้งหมดในเดือน (ตัวฐานคำนวณ)
  actualWorkingDays: number;   // วันมาทำงานจริง
  positionAllowance: number;
  diligenceAllowance: number;
  otHours: number;
  bonus: number;
}

export interface AttendanceData {
  annualLeave: number; // ลาพักร้อน (ได้เงิน)
  sickLeaveWithCert: number; // ลาป่วยมีใบรับรอง (ได้เงิน)
  personalLeave: number; // ลากิจ/ไม่มีใบรับรอง (หักเงิน)
  maternityLeave: number; // ลาคลอด
  sterilizationLeave: number; // ลาทำหมัน
  militaryLeave: number; // ลารับราชการทหาร
  trainingLeave: number; // ลาฝึกอบรม
  absentDays: number; // ขาดงาน (หักเงินเพิ่ม)
  lateMinutes: number; // สาย (หักเงินรายนาที)
}

export interface DeductionData {
  providentFundRate: number;
  taxDeductions: number;
}

export interface CalculationResult {
  dailyRate: number;
  hourlyRate: number;
  minuteRate: number;
  grossSalary: number;
  totalAdditions: number;
  otAmount: number;
  leaveDeductions: number;
  maternityDeduction: number;
  trainingDeduction: number;
  lateDeduction: number;
  absentDeduction: number;
  autoAbsentDays: number; // จำนวนวันที่ขาดจากการคำนวณ (Expected - Actual)
  monthlyGrossAfterDeductions: number;
  monthlySSO: number;
  monthlyProvidentFund: number;
  monthlyTax: number;
  monthlyNet: number;
  yearlyGross: number;
  yearlyTax: number;
  taxBracket: string;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}
