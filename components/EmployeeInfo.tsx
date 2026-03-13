
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
    <section className="bg-white rounded-2xl shadow-sm border p-6 border-indigo-100 ring-4 ring-indigo-50/50">
      <h2 className="text-sm font-bold text-indigo-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
        <i className="fas fa-id-card text-indigo-500"></i> ข้อมูลพนักงาน
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>รหัสพนักงาน</label>
          <input 
            type="text" 
            value={employeeId} 
            placeholder="เช่น EMP-001" 
            onChange={(e) => setEmployeeId(e.target.value)} 
            className={inputClass} 
          />
        </div>
        <div>
          <label className={labelClass}>ชื่อ-นามสกุล</label>
          <input 
            type="text" 
            value={employeeName} 
            placeholder="กรุณาระบุชื่อ" 
            onChange={(e) => setEmployeeName(e.target.value)} 
            className={inputClass} 
          />
        </div>
      </div>
    </section>
  );
};

export default EmployeeInfo;
