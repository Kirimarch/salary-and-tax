
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CalculationResult, IncomeData, AttendanceData, DeductionData } from '../types';

// Assets
// @ts-ignore
import logo from './images/AW-EnterPriseNetwork-logo.png';

// Register Thai Font (Kanit) from Google Fonts storage
Font.register({
  family: 'Kanit',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/kanit/v17/nKKZ-Go6G5tXcoaS.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/kanit/v17/nKKU-Go6G5tXcr4uPiWg.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Kanit',
    fontSize: 10,
    color: '#334155',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#1e1b4b',
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 'auto',
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e1b4b',
    textTransform: 'uppercase',
  },
  employeeInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#f1f5f9',
    padding: 5,
  },
  section: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  colTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginBottom: 8,
    paddingBottom: 4,
    color: '#4f46e5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summarySection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#1e1b4b',
    borderRadius: 8,
  },
  summaryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    marginTop: 50,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  }
});

interface Props {
  result: CalculationResult;
  income: IncomeData;
  attendance: AttendanceData;
  deduction: DeductionData;
  employeeName: string;
  employeeId: string;
}

const format = (num: number) => 
  '฿' + new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);

export const SalarySlipPDF: React.FC<Props> = ({ result, income, attendance, deduction, employeeName, employeeId }) => {
  const date = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Enterprise Network Technology.co ltd</Text>
            <Text style={{ fontSize: 9, color: '#64748b' }}>ใบแจ้งยอดเงินเดือน (PAYSLIP)</Text>
            <Text style={{ fontSize: 8, marginTop: 4 }}>วันที่พิมพ์: {date}</Text>
          </View>
        </View>

        {/* Employee Detail Box */}
        <View style={styles.employeeInfo}>
          <View>
            <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 2 }}>ชื่อพนักงาน (Employee Name)</Text>
            <Text style={{ fontWeight: 'bold' }}>{employeeName || '-'}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 2, textAlign: 'right' }}>รหัสพนักงาน (ID)</Text>
            <Text style={{ fontWeight: 'bold', textAlign: 'right' }}>{employeeId || '-'}</Text>
          </View>
        </View>

        <Text style={styles.title}>รายละเอียดรายรับและรายจ่าย</Text>

        {/* Content Table-like view */}
        <View style={styles.section}>
          {/* Earnings */}
          <View style={[styles.column, { marginRight: 10 }]}>
            <Text style={styles.colTitle}>รายรับ (Earnings)</Text>
            <View style={styles.row}>
              <Text>เงินเดือนพื้นฐาน</Text>
              <Text>{format(income.baseSalary)}</Text>
            </View>
            <View style={styles.row}>
              <Text>ค่าตำแหน่ง</Text>
              <Text>{format(income.positionAllowance)}</Text>
            </View>
            <View style={styles.row}>
              <Text>เบี้ยขยัน</Text>
              <Text>{format(income.diligenceAllowance)}</Text>
            </View>
            <View style={styles.row}>
              <Text>ค่าล่วงเวลา (OT)</Text>
              <Text>{format(result.otAmount)}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10, borderTopWidth: 1, paddingTop: 4 }]}>
              <Text style={{ fontWeight: 'bold' }}>รวมรายรับ</Text>
              <Text style={{ fontWeight: 'bold' }}>{format(result.grossSalary + result.totalAdditions)}</Text>
            </View>
          </View>

          {/* Deductions */}
          <View style={styles.column}>
            <Text style={styles.colTitle}>รายจ่าย/เงินหัก (Deductions)</Text>
            <View style={styles.row}>
              <Text>ประกันสังคม</Text>
              <Text>{format(result.monthlySSO)}</Text>
            </View>
            <View style={styles.row}>
              <Text>ภาษีเงินได้</Text>
              <Text>{format(result.monthlyTax)}</Text>
            </View>
            <View style={styles.row}>
              <Text>กองทุนสำรองฯ</Text>
              <Text>{format(result.monthlyProvidentFund)}</Text>
            </View>
            <View style={styles.row}>
              <Text>หักมาสาย/ขาดงาน</Text>
              <Text>{format(result.lateDeduction + result.leaveDeductions + result.absentDeduction)}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10, borderTopWidth: 1, paddingTop: 4 }]}>
              <Text style={{ fontWeight: 'bold' }}>รวมเงินหัก</Text>
              <Text style={{ fontWeight: 'bold' }}>{format(result.monthlySSO + result.monthlyTax + result.monthlyProvidentFund + result.lateDeduction + result.leaveDeductions + result.absentDeduction)}</Text>
            </View>
          </View>
        </View>

        {/* Final Summary */}
        <View style={styles.summarySection}>
          <View style={styles.row}>
            <Text style={{ color: '#a5b4fc' }}>รายรับสุทธิ (Net Pay)</Text>
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>{format(result.monthlyNet)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>เอกสารฉบับนี้จัดทำขึ้นโดยระบบคำนวณเงินเดือนอัตโนมัติ</Text>
          <Text>Enterprise Network Technology.co ltd - Smart Payroll Master © 2025</Text>
        </View>
      </Page>
    </Document>
  );
};

export default SalarySlipPDF;
