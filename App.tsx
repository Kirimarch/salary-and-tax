
import React, { useState, useMemo, useEffect } from 'react';
import { IncomeData, AttendanceData, DeductionData } from './types';
import { calculateSalary } from './utils/calculators';
import { exportToExcel } from './utils/excelExport';

// Components
import EmployeeInfo from './components/EmployeeInfo';
import IncomeForm from './components/IncomeForm';
import AttendanceForm from './components/AttendanceForm';
import ResultsPanel from './components/ResultsPanel';
import SalarySlipPDF from './components/SalarySlipPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

type InputState<T> = { [K in keyof T]: number | '' };

const STORAGE_KEY = 'payroll_master_data';

const initialIncome: InputState<IncomeData> = {
  baseSalary: '',
  workingDaysPerMonth: 26,
  actualWorkingDays: '',
  positionAllowance: '',
  diligenceAllowance: '',
  otHours: '',
  bonus: '',
};

const initialAttendance: InputState<AttendanceData> = {
  annualLeave: '',
  sickLeaveWithCert: '',
  personalLeave: '',
  maternityLeave: '',
  sterilizationLeave: '',
  militaryLeave: '',
  trainingLeave: '',
  absentDays: '',
  lateMinutes: '',
};

const initialDeduction: InputState<DeductionData> = {
  providentFundRate: '',
  taxDeductions: '',
};

const App: React.FC = () => {
  const [employeeName, setEmployeeName] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [income, setIncome] = useState<InputState<IncomeData>>(initialIncome);
  const [attendance, setAttendance] = useState<InputState<AttendanceData>>(initialAttendance);
  const [deduction, setDeduction] = useState<InputState<DeductionData>>(initialDeduction);

  // 1. Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.employeeName) setEmployeeName(parsed.employeeName);
        if (parsed.employeeId) setEmployeeId(parsed.employeeId);
        if (parsed.income) setIncome(parsed.income);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.deduction) setDeduction(parsed.deduction);
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  // 2. Save data to localStorage whenever something changes
  useEffect(() => {
    const dataToSave = {
      employeeName,
      employeeId,
      income,
      attendance,
      deduction
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [employeeName, employeeId, income, attendance, deduction]);

  const sanitize = <T extends object>(state: InputState<T>): T => {
    const res = {} as any;
    for (const key in state) {
      const val = state[key as keyof T];
      res[key] = (val === '' || val === undefined || val === null) ? 0 : Number(val);
    }
    if ('workingDaysPerMonth' in res && (res.workingDaysPerMonth === 0 || res.workingDaysPerMonth === '')) {
      res.workingDaysPerMonth = 26;
    }
    return res as T;
  };

  const result = useMemo(() => {
    return calculateSalary(
      sanitize<IncomeData>(income),
      sanitize<AttendanceData>(attendance),
      sanitize<DeductionData>(deduction)
    );
  }, [income, attendance, deduction]);

  const handleIncomeChange = (name: string, value: number | '') => {
    setIncome(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendanceChange = (name: string, value: number | '') => {
    setAttendance(prev => ({ ...prev, [name]: value }));
  };

  const hasInput = 
    income.baseSalary !== '' && Number(income.baseSalary) !== 0 && 
    income.actualWorkingDays !== '' && Number(income.actualWorkingDays) !== 0;

  const handleDownloadExcel = () => {
    exportToExcel(
      result,
      sanitize<IncomeData>(income),
      sanitize<AttendanceData>(attendance),
      employeeName,
      employeeId
    );
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all";
  const labelClass = "text-[11px] text-slate-400 font-bold uppercase block mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-['Kanit']">
      <header className="bg-white border-b border-slate-200 py-4 md:py-6 mb-6 md:mb-8 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-200 shrink-0">
              <i className="fas fa-file-invoice-dollar text-xl md:text-2xl"></i>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">ENT Payroll System</h1>
              <p className="text-slate-400 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">Smart Management</p>
            </div>
          </div>

          {hasInput && (
            <div className="flex flex-col xs:flex-row items-center gap-2 md:gap-3 w-full sm:w-auto">
              <PDFDownloadLink
                className="w-full sm:w-auto"
                document={
                  <SalarySlipPDF 
                    result={result}
                    income={sanitize<IncomeData>(income)}
                    attendance={sanitize<AttendanceData>(attendance)}
                    deduction={sanitize<DeductionData>(deduction)}
                    employeeName={employeeName}
                    employeeId={employeeId}
                  />
                }
                fileName={`Salary_Slip_${employeeId}_${new Date().toISOString().slice(0, 10)}.pdf`}
              >
                {/* @ts-ignore */}
                {({ loading }) => (
                  <button 
                    disabled={loading}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[12px] md:text-sm font-black uppercase flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100 active:scale-95 group disabled:opacity-50"
                  >
                    <i className="fas fa-file-pdf group-hover:rotate-12 transition-transform"></i>
                    {loading ? 'Generating...' : 'PDF Slip'}
                  </button>
                )}
              </PDFDownloadLink>

              <button 
                onClick={handleDownloadExcel}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[12px] md:text-sm font-black uppercase flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-100 active:scale-95 group"
              >
                <i className="fas fa-file-excel group-hover:rotate-12 transition-transform"></i>
                Excel Report
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* INPUTS PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <EmployeeInfo
            employeeId={employeeId}
            employeeName={employeeName}
            setEmployeeId={setEmployeeId}
            setEmployeeName={setEmployeeName}
            inputClass={inputClass}
            labelClass={labelClass}
          />

          <IncomeForm
            income={income}
            handleIncomeChange={handleIncomeChange}
            labelClass={labelClass}
          />

          <AttendanceForm
            attendance={attendance}
            handleAttendanceChange={handleAttendanceChange}
          />
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-7">
          <ResultsPanel
            result={result}
            income={sanitize<IncomeData>(income)}
            attendance={sanitize<AttendanceData>(attendance)}
            employeeName={employeeName}
            employeeId={employeeId}
            hasInput={hasInput}
            handleDownloadExcel={handleDownloadExcel}
          />
        </div>
      </main>

      <footer className="container mx-auto px-4 mt-12 py-8 border-t border-slate-200 text-center space-y-3">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">© 2025 Professional Salary & Tax Master</p>
        <p className="text-slate-300 text-[9px] max-w-xl mx-auto italic font-medium">
          หมายเหตุ: การคำนวณวันขาดงานอัตโนมัติอ้างอิงจากฐาน 26 วันต่อเดือนตามมาตรฐานสากล ผลลัพธ์อาจแตกต่างกันไปตามนโยบายบริษัท
        </p>
      </footer>
    </div>
  );
};

export default App;
