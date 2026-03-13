
import { IncomeData, AttendanceData, DeductionData, CalculationResult } from '../types';
import { 
  THAI_TAX_BRACKETS, 
  MAX_SSO_SALARY, 
  SSO_RATE, 
  MAX_SSO_AMOUNT,
  STANDARD_DEDUCTION_LIMIT, 
  PERSONAL_ALLOWANCE 
} from '../constants';

export const calculateSalary = (
  income: IncomeData, 
  attendance: AttendanceData,
  deduction: DeductionData
): CalculationResult => {
  // มาตรการความปลอดภัย: ขั้นต่ำ 1, ห้ามติดลบ
  const baseSalary = Math.max(1, income.baseSalary);
  const totalWorkingDays = Math.max(1, income.workingDaysPerMonth);
  const actualWorkingDays = Math.max(0, income.actualWorkingDays);
  const posAllowance = Math.max(0, income.positionAllowance);
  const diligence = Math.max(0, income.diligenceAllowance);
  const otHours = Math.max(0, income.otHours);
  
  // 1. คำนวณอัตราต่อหน่วย
  const dailyRate = baseSalary / totalWorkingDays;
  const hourlyRate = dailyRate / 8;
  const minuteRate = hourlyRate / 60;

  // 2. คำนวณวันขาดงานอัตโนมัติ (วันทำงานทั้งหมด - วันมาจริง)
  // หากกรอกวันมาจริง > วันทั้งหมด จะถือว่าไม่มีการขาดงานจากเงื่อนไขนี้
  const autoAbsentDays = Math.max(0, totalWorkingDays - actualWorkingDays);

  // 3. คำนวณรายรับเพิ่ม
  const otAmount = otHours * (hourlyRate * 1.5);
  const totalAdditions = otAmount + diligence;
  const grossBase = baseSalary + posAllowance;

  // 4. คำนวณรายการหัก
  // ลาที่หักเงิน: ลากิจ, ขาดงาน (จากช่องกรอก), ขาดงานอัตโนมัติ (จากความต่างวันมาจริง), สาย, ลาคลอด (ส่วนที่เกิน 45 วัน)
  const leaveDeductions = Math.max(0, attendance.personalLeave * dailyRate);
  const manualAbsentDeduction = Math.max(0, attendance.absentDays * dailyRate);
  const autoAbsentDeduction = Math.max(0, autoAbsentDays * dailyRate);
  const lateDeduction = Math.max(0, attendance.lateMinutes * minuteRate);
  
  // ลาคลอด: หากเกิน 45 วัน จะหักเงินส่วนที่เกิน
  const maternityDeduction = Math.max(0, (attendance.maternityLeave - 45) * dailyRate);
  
  // ลาฝึกอบรม: หากเกิน 5 วัน จะหักเงินส่วนที่เกิน
  const trainingDeduction = Math.max(0, (attendance.trainingLeave - 5) * dailyRate);
  
  const totalPenalty = leaveDeductions + manualAbsentDeduction + autoAbsentDeduction + lateDeduction + maternityDeduction + trainingDeduction;

  // 5. รายได้ก่อนหักสวัสดิการ
  const monthlyGrossAfterDeductions = Math.max(0, grossBase + totalAdditions - totalPenalty);

  // 6. ประกันสังคม
  const monthlySSO = Math.min(Math.max(0, Math.min(baseSalary, MAX_SSO_SALARY) * SSO_RATE), MAX_SSO_AMOUNT);
  
  // 7. กองทุนสำรองฯ
  const monthlyProvidentFund = baseSalary * (deduction.providentFundRate / 100);

  // 8. ภาษี (ประมาณการรายปี)
  const yearlyGross = Math.max(0, (monthlyGrossAfterDeductions * 12) + income.bonus);
  const expenses = Math.min(yearlyGross * 0.5, STANDARD_DEDUCTION_LIMIT);
  const totalAllowances = PERSONAL_ALLOWANCE + (monthlySSO * 12) + (monthlyProvidentFund * 12) + deduction.taxDeductions;
  
  let taxableIncome = Math.max(0, yearlyGross - expenses - totalAllowances);
  let yearlyTax = 0;
  let currentBracketRate = "0%";

  for (const bracket of THAI_TAX_BRACKETS) {
    if (taxableIncome > bracket.min) {
      const taxableInThisBracket = bracket.max 
        ? Math.min(taxableIncome, bracket.max) - bracket.min 
        : taxableIncome - bracket.min;
      if (taxableInThisBracket > 0) {
        yearlyTax += taxableInThisBracket * bracket.rate;
        if (bracket.rate > 0) currentBracketRate = `${(bracket.rate * 100).toFixed(0)}%`;
      }
    }
  }

  const monthlyTax = yearlyTax / 12;
  const monthlyNet = Math.max(0, monthlyGrossAfterDeductions - monthlySSO - monthlyProvidentFund - monthlyTax);

  return {
    dailyRate,
    hourlyRate,
    minuteRate,
    grossSalary: grossBase,
    totalAdditions,
    otAmount,
    leaveDeductions,
    maternityDeduction,
    trainingDeduction,
    lateDeduction,
    absentDeduction: manualAbsentDeduction + autoAbsentDeduction,
    autoAbsentDays,
    monthlyGrossAfterDeductions,
    monthlySSO,
    monthlyProvidentFund,
    monthlyTax,
    monthlyNet,
    yearlyGross,
    yearlyTax,
    taxBracket: currentBracketRate
  };
};

export const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(num);
};
