
import React from 'react';

interface EmployeeInfoProps {
  employeeId: string;
  employeeName: string;
  setEmployeeId: (val: string) => void;
  setEmployeeName: (val: string) => void;
  inputClass: string;
  labelClass: string;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({
  employeeId,
  employeeName,
  setEmployeeId,
  setEmployeeName,
  inputClass,
  labelClass
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-xs font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">
        <i className="fas fa-id-card-alt text-indigo-500"></i> ข้อมูลพนักงาน (Employee Detail)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>รหัสพนักงาน</label>
          <input 
            type="text" 
            value={employeeId} 
            placeholder="เช่น T-100" 
            onChange={(e) => setEmployeeId(e.target.value)} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all placeholder:text-slate-200"
          />
        </div>
        <div>
          <label className={labelClass}>ชื่อ-นามสกุล</label>
          <input 
            type="text" 
            value={employeeName} 
            placeholder="ระบุชื่อพนักงาน" 
            onChange={(e) => setEmployeeName(e.target.value)} 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all placeholder:text-slate-200"
          />
        </div>
      </div>
    </section>
  );
};

export default EmployeeInfo;
