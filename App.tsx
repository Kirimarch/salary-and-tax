
import React, { useState, useMemo, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { 
  IncomeData, AttendanceData, DeductionData, 
  CalculationResult 
} from './types';
import { calculateSalary } from './utils/calculators';
import { exportToExcel } from './utils/excelExport';

// Components
import EmployeeInfo from './components/EmployeeInfo';
import IncomeForm from './components/IncomeForm';
import AttendanceForm from './components/AttendanceForm';
import ResultsPanel from './components/ResultsPanel';
import SalarySlipPDF from './components/SalarySlipPDF';
import AIAdvisor from './components/AIAdvisor';

// Assets
// @ts-ignore
import logo from './components/images/AW-EnterPriseNetwork-logo.png';
// @ts-ignore
import qrCodeImg from './components/images/M_gainfriends_2dbarcodes_GW.png';

const initialIncome: IncomeData = {
  baseSalary: 0,
  positionAllowance: 0,
  diligenceAllowance: 0,
  otHours: 0,
  bonus: 0,
  actualWorkingDays: 26,
  workingDaysPerMonth: 26,
};

const initialAttendance: AttendanceData = {
  annualLeave: 0,
  sickLeaveWithCert: 0,
  personalLeave: 0,
  maternityLeave: 0,
  sterilizationLeave: 0,
  militaryLeave: 0,
  trainingLeave: 0,
  absentDays: 0,
  lateMinutes: 0,
};

const initialDeduction: DeductionData = {
  providentFundRate: 0,
  taxDeductions: 0,
};

type InputState<T> = { [K in keyof T]: number | '' };

const App: React.FC = () => {
  // State with LocalStorage Persistence
  const [employeeName, setEmployeeName] = useState<string>(() => localStorage.getItem('emp_name') || '');
  const [employeeId, setEmployeeId] = useState<string>(() => localStorage.getItem('emp_id') || '');
  
  const [income, setIncome] = useState<InputState<IncomeData>>(() => {
    const saved = localStorage.getItem('payroll_income');
    return saved ? JSON.parse(saved) : { ...initialIncome, baseSalary: '', actualWorkingDays: '' };
  });

  const [attendance, setAttendance] = useState<InputState<AttendanceData>>(() => {
    const saved = localStorage.getItem('payroll_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // URL Parameter Detection for LINE Bot Integration
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Employee Info
    const name = params.get('name');
    const id = params.get('id');
    if (name) setEmployeeName(name);
    if (id) setEmployeeId(id);

    // Income Info
    const salary = params.get('salary');
    const days = params.get('days');
    const pos = params.get('pos');
    const dil = params.get('dil');
    const ot = params.get('ot');

    if (salary || days || pos || dil || ot) {
      setIncome(prev => ({
        ...prev,
        baseSalary: salary ? Number(salary) : prev.baseSalary,
        actualWorkingDays: days ? Number(days) : prev.actualWorkingDays,
        positionAllowance: pos ? Number(pos) : prev.positionAllowance,
        diligenceAllowance: dil ? Number(dil) : prev.diligenceAllowance,
        otHours: ot ? Number(ot) : prev.otHours,
      }));
    }

    // Attendance Info
    const late = params.get('late');
    const absent = params.get('absent');
    if (late || absent) {
      setAttendance(prev => ({
        ...prev,
        lateMinutes: late ? Number(late) : prev.lateMinutes,
        absentDays: absent ? Number(absent) : prev.absentDays,
      }));
    }

    // Clean up URL after loading for a cleaner look
    if (params.toString()) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const [deduction, setDeduction] = useState<InputState<DeductionData>>(() => {
    const saved = localStorage.getItem('payroll_deduction');
    return saved ? JSON.parse(saved) : { ...initialDeduction, providentFundRate: '', taxDeductions: '' };
  });

  // Persist to LocalStorage
  useEffect(() => {
    localStorage.setItem('emp_name', employeeName);
    localStorage.setItem('emp_id', employeeId);
    localStorage.setItem('payroll_income', JSON.stringify(income));
    localStorage.setItem('payroll_attendance', JSON.stringify(attendance));
    localStorage.setItem('payroll_deduction', JSON.stringify(deduction));
  }, [employeeName, employeeId, income, attendance, deduction]);

  const sanitize = <T extends object>(state: InputState<T>): T => {
    const res = {} as any;
    for (const key in state) {
      const val = state[key as keyof T];
      res[key] = (val === '' || val === undefined || val === null) ? 0 : Number(val);
    }
    // Default to 26 days if not specified
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
    let finalValue = value;
    
    // Limit OT hours to maximum 24 hours * 26 days = 624
    if (name === 'otHours' && value !== '') {
      const maxOt = 24 * 26;
      if (Number(value) > maxOt) {
        finalValue = maxOt;
      }
    }

    setIncome(prev => ({ ...prev, [name]: finalValue }));
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12 font-['Kanit'] selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 py-2 md:py-3 mb-6 md:mb-8 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <img src={logo} alt="ENT Logo" className="h-14 md:h-16 w-auto object-contain" />
            <div className="border-l-2 border-slate-200 pl-4 py-1">
              <h1 className="text-lg md:text-2xl font-black text-slate-800 leading-tight tracking-tight">ระบบจัดการเงินเดือน</h1>
              <p className="text-slate-400 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold">Smart Management System</p>
            </div>
          </div>

          {hasInput && (
            <div className="flex items-center justify-end gap-2 md:gap-3 w-full sm:w-auto">
              <PDFDownloadLink
                className="flex-1 sm:flex-none"
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
                    className="w-full sm:w-auto min-w-[100px] md:min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-95 group disabled:opacity-50 whitespace-nowrap"
                  >
                    <i className="fas fa-file-pdf group-hover:rotate-12 transition-transform"></i>
                    {loading ? '...' : 'พิมพ์ใบแจ้งเงินเดือน'}
                  </button>
                )}
              </PDFDownloadLink>

              <button 
                onClick={handleDownloadExcel}
                className="flex-1 sm:flex-none w-full sm:w-auto min-w-[100px] md:min-w-[120px] bg-emerald-600 hover:bg-emerald-700 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-black uppercase flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 active:scale-95 group whitespace-nowrap"
              >
                <i className="fas fa-file-excel group-hover:rotate-12 transition-transform"></i>
                ส่งออกรายงาน Excel
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

          {hasInput && (
            <AIAdvisor 
              result={result}
              income={sanitize<IncomeData>(income)}
              deduction={sanitize<DeductionData>(deduction)}
            />
          )}
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
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">© 2025 ระบบคำนวณเงินเดือนและภาษีมืออาชีพ</p>
        <p className="text-slate-300 text-[9px] max-w-xl mx-auto italic font-medium">
          หมายเหตุ: การคำนวณวันขาดงานอัตโนมัติอ้างอิงจากฐาน 26 วันต่อเดือนตามมาตรฐานสากล ผลลัพธ์อาจแตกต่างกันไปตามนโยบายบริษัท
        </p>
      </footer>

      {/* Floating Action Button (LINE Bot) */}
      <button
        onClick={() => setIsQrModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#00B900] hover:bg-[#009b00] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200/50 hover:scale-110 active:scale-95 transition-all z-40 group"
        title="แอดไลน์เพื่อให้ AI ช่วยคำนวณ"
      >
        <i className="fab fa-line text-[32px] group-hover:scale-110 transition-transform"></i>
      </button>

      {/* QR Code Modal Overlay */}
      {isQrModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all duration-300"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="w-16 h-16 bg-[#00B900]/10 rounded-2xl flex items-center justify-center text-[#00B900] mb-4">
              <i className="fab fa-line text-4xl"></i>
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-1"> HR Bot</h3>
            <p className="text-xs text-slate-500 font-medium mb-6 text-center leading-relaxed">
              สแกน QR Code นี้ผ่านไลน์ เพื่อให้ Bot ช่วยคำนวณเงินเดือนให้แบบรวดเร็วและเป็นกันเองทันที!
            </p>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full flex justify-center shadow-inner mb-6">
              <img src={qrCodeImg} alt="LINE Bot QR Code" className="w-48 h-48 object-contain rounded-xl mix-blend-multiply" />
            </div>
            
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
