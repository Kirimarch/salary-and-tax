
import React from 'react';
import { IncomeData } from '../types';
import NumericInput from './common/NumericInput';

interface IncomeFormProps {
  income: { [K in keyof IncomeData]: number | '' };
  handleIncomeChange: (name: string, value: number | '') => void;
  labelClass: string;
}

const IncomeForm: React.FC<IncomeFormProps> = ({
  income,
  handleIncomeChange,
  labelClass
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-xs font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">
        <i className="fas fa-money-check-alt text-indigo-500"></i> ข้อมูลรายได้ (Income)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        <div className="sm:col-span-2 min-w-0">
          <NumericInput
            label="เงินเดือนพื้นฐาน (Base Salary)"
            name="baseSalary"
            value={income.baseSalary}
            onChange={handleIncomeChange}
            placeholder="เช่น 27000"
            labelClass={labelClass}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none text-2xl md:text-3xl font-black text-slate-900 transition-all placeholder:text-slate-200 overflow-hidden text-ellipsis"
          />
        </div>
        
        <div className="col-span-1">
          <NumericInput
            label="วันมาทำงานจริง"
            name="actualWorkingDays"
            value={income.actualWorkingDays}
            onChange={handleIncomeChange}
            placeholder="ระบุจำนวนวัน"
            labelClass={labelClass}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all"
            suffix="วัน"
            max={31}
          />
        </div>

        <div className="col-span-1">
          <NumericInput
            label="ค่าตำแหน่งงาน"
            name="positionAllowance"
            value={income.positionAllowance}
            onChange={handleIncomeChange}
            placeholder="0"
            labelClass={labelClass}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all text-emerald-600"
          />
        </div>

        <div className="col-span-1">
          <NumericInput
            label="เบี้ยขยัน"
            name="diligenceAllowance"
            value={income.diligenceAllowance}
            onChange={handleIncomeChange}
            placeholder="0"
            labelClass={labelClass}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all text-emerald-600"
          />
        </div>

        <div className="col-span-1">
          <NumericInput
            label="โอที / ชั่วโมง"
            name="otHours"
            value={income.otHours}
            onChange={handleIncomeChange}
            placeholder="0"
            labelClass={labelClass}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all text-sky-600"
          />
        </div>

        <div className="col-span-1 sm:col-span-2 mt-2 py-3.5 px-5 bg-indigo-50/40 rounded-[1.25rem] border border-indigo-100/30">
          <p className="text-[10px] text-indigo-400 leading-relaxed font-bold uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-info-circle text-indigo-500 opacity-60"></i>
            คำนวณวันขาดงานอัตโนมัติอ้างอิงฐาน 26 วัน
          </p>
        </div>
      </div>
    </section>
  );
};

export default IncomeForm;
