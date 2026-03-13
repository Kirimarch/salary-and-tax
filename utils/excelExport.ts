
import XLSX from 'xlsx-js-style';
import { CalculationResult, IncomeData, AttendanceData } from '../types';

export const exportToExcel = (
  result: CalculationResult,
  income: IncomeData,
  attendance: AttendanceData,
  employeeName: string = '-',
  employeeId: string = '-'
) => {
  const dateStr = new Date().toLocaleDateString('th-TH');

  // ฟังก์ชันช่วยปัดเศษทศนิยม 2 ตำแหน่งเพื่อให้ข้อมูลใน Cell ของ Excel สะอาด
  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  // สไตล์สำหรับส่วนต่างๆ (เน้นโทนสีน้ำเงิน)
  const headerStyle = {
    fill: { fgColor: { rgb: "BDD7EE" } }, // สีน้ำเงินอ่อน
    font: { bold: true, sz: 14, color: { rgb: "1F4E78" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    }
  };

  const subHeaderStyle = {
    fill: { fgColor: { rgb: "DDEBF7" } }, // สีน้ำเงินจางมาก
    font: { bold: true, color: { rgb: "2E75B6" } },
    border: {
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" }
    }
  };

  const labelStyle = {
    font: { sz: 11 },
    border: {
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "hair" }
    }
  };

  const numberStyle = {
    numFmt: "#,##0.00",
    alignment: { horizontal: "right" },
    border: {
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "hair" }
    }
  };

  const summaryStyle = {
    fill: { fgColor: { rgb: "1F4E78" } }, // สีน้ำเงินเข้มสำหรับยอดสรุป
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
    numFmt: "#,##0.00",
    alignment: { horizontal: "right" },
    border: {
      top: { style: "double" },
      bottom: { style: "thin" }
    }
  };

  const ws_data: any[][] = [];

  const addRow = (cells: any[]) => ws_data.push(cells);

  // ส่วนหัวรายงาน
  addRow([{ v: "Enterprise Network Technology.co ltd", s: headerStyle }, ""]);
  addRow([{ v: "รายงานสรุปรายได้รายเดือน (Monthly Salary Statement)", s: { font: { italic: true, sz: 10, color: { rgb: "666666" } }, alignment: { horizontal: "center" } } }, ""]);
  addRow(["ชื่อพนักงาน:", employeeName]);
  addRow(["รหัสพนักงาน:", employeeId]);
  addRow(["วันที่พิมพ์รายงาน:", dateStr]);
  addRow([]);

  // รายรับ
  addRow([{ v: "รายการรายรับ (Earnings)", s: subHeaderStyle }, { v: "จำนวนเงิน (บาท)", s: subHeaderStyle }]);
  addRow([{ v: "เงินเดือนพื้นฐาน", s: labelStyle }, { v: round(income.baseSalary), s: numberStyle }]);
  addRow([{ v: "ค่าตำแหน่ง", s: labelStyle }, { v: round(income.positionAllowance), s: numberStyle }]);
  addRow([{ v: "เบี้ยขยัน", s: labelStyle }, { v: round(income.diligenceAllowance), s: numberStyle }]);
  addRow([{ v: "ค่าล่วงเวลา (OT)", s: labelStyle }, { v: round(result.otAmount), s: numberStyle }]);
  addRow([{ v: "รวมรายรับทั้งหมด", s: { ...subHeaderStyle, alignment: { horizontal: "right" } } }, { v: round(result.grossSalary + result.totalAdditions), s: { ...numberStyle, font: { bold: true } } }]);
  addRow([]);

  // รายจ่าย
  addRow([{ v: "รายการหัก (Deductions)", s: { ...subHeaderStyle, fill: { fgColor: { rgb: "F2F2F2" } } } }, { v: "จำนวนเงิน (บาท)", s: { ...subHeaderStyle, fill: { fgColor: { rgb: "F2F2F2" } } } }]);
  addRow([{ v: "ประกันสังคม (SSO)", s: labelStyle }, { v: round(result.monthlySSO), s: numberStyle }]);
  addRow([{ v: "ภาษีเงินได้บุคคลธรรมดา", s: labelStyle }, { v: round(result.monthlyTax), s: numberStyle }]);
  addRow([{ v: "กองทุนสำรองเลี้ยงชีพ", s: labelStyle }, { v: round(result.monthlyProvidentFund), s: numberStyle }]);
  addRow([{ v: "หักมาสาย", s: labelStyle }, { v: round(result.lateDeduction), s: numberStyle }]);
  addRow([{ v: "หักขาดงาน/ลากิจ", s: labelStyle }, { v: round(result.leaveDeductions + result.absentDeduction), s: numberStyle }]);
  addRow([{ v: "รวมรายการหักทั้งหมด", s: { ...subHeaderStyle, alignment: { horizontal: "right" }, fill: { fgColor: { rgb: "FFF2CC" } } } }, { v: round(result.monthlySSO + result.monthlyTax + result.monthlyProvidentFund + result.lateDeduction + result.leaveDeductions + result.absentDeduction), s: { ...numberStyle, font: { bold: true } } }]);
  addRow([]);

  // สรุปยอดสุทธิ
  addRow([{ v: "เงินเดือนสุทธิที่ได้รับ (Net Pay)", s: summaryStyle }, { v: round(result.monthlyNet), s: summaryStyle }]);

  const ws = XLSX.utils.aoa_to_sheet(ws_data);

  // การตั้งค่าพิเศษ
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }
  ];
  ws['!cols'] = [{ wch: 35 }, { wch: 20 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Salary Summary");

  const fileName = `Salary_Summary_${employeeId}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
