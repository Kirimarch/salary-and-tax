
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
      <h2 className="text-sm font-bold text-indigo-600 mb-6 flex items-center gap-2 uppercase tracking-tight">
        <i className="fas fa-coins"></i> ข้อมูลรายได้
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <NumericInput
            label="เงินเดือน (Base Salary)"
            name="baseSalary"
            value={income.baseSalary}
            onChange={handleIncomeChange}
            placeholder="เช่น 27000"
            labelClass={labelClass}
            className="w-full px-4 py-3 bg-indigo-50/30 border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-2xl font-black text-indigo-900 transition-all"
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all"
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all text-green-600"
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all text-green-600"
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
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all text-blue-600"
          />
        </div>

        <div className="col-span-2 mt-2 py-3 px-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
          <p className="text-[10px] text-indigo-500 leading-relaxed font-medium">
            <i className="fas fa-info-circle mr-1"></i>
            ระบบจะคำนวณวันขาดงานอัตโนมัติหากวันมาทำงานจริงไม่ครบ 26 วันตามมาตรฐาน
          </p>
        </div>
      </div>
    </section>
  );
};

export default IncomeForm;
