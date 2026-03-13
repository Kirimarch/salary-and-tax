
import React from 'react';
import { AttendanceData } from '../types';
import NumericInput from './common/NumericInput';

interface AttendanceFormProps {
  attendance: { [K in keyof AttendanceData]: number | '' };
  handleAttendanceChange: (name: string, value: number | '') => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({
  attendance,
  handleAttendanceChange
}) => {
  return (
    <section className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-sm font-bold text-red-600 mb-6 flex items-center gap-2 uppercase tracking-tight">
        <i className="fas fa-user-clock"></i> ข้อมูลการลาและสาย
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <NumericInput
            label="ลาพักร้อน (วัน)"
            name="annualLeave"
            value={attendance.annualLeave}
            onChange={handleAttendanceChange}
            placeholder="0"
            labelClass="text-[10px] text-emerald-600 font-black uppercase block mb-1.5"
            className="w-full bg-transparent border-b border-emerald-200 outline-none font-bold text-emerald-700 pb-1"
            max={31}
          />
        </div>
        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
          <NumericInput
            label="ลาป่วย (วัน)"
            name="sickLeaveWithCert"
            value={attendance.sickLeaveWithCert}
            onChange={handleAttendanceChange}
            placeholder="0"
            labelClass="text-[10px] text-emerald-600 font-black uppercase block mb-1.5"
            className="w-full bg-transparent border-b border-emerald-200 outline-none font-bold text-emerald-700 pb-1"
            max={31}
          />
        </div>
        <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
          <NumericInput
            label="ลากิจ (วัน)"
            name="personalLeave"
            value={attendance.personalLeave}
            onChange={handleAttendanceChange}
            placeholder="0"
            labelClass="text-[10px] text-orange-600 font-black uppercase block mb-1.5"
            className="w-full bg-transparent border-b border-orange-200 outline-none font-bold text-orange-700 pb-1"
            max={31}
          />
        </div>
        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100">
          <NumericInput
            label="ขาดงานเพิ่ม (วัน)"
            name="absentDays"
            value={attendance.absentDays}
            onChange={handleAttendanceChange}
            placeholder="0"
            labelClass="text-[10px] text-red-600 font-black uppercase block mb-1.5"
            className="w-full bg-transparent border-b border-red-200 outline-none font-bold text-red-700 pb-1"
            max={31}
          />
        </div>
        <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 col-span-2">
          <NumericInput
            label="มาสาย (นาที)"
            name="lateMinutes"
            value={attendance.lateMinutes}
            onChange={handleAttendanceChange}
            placeholder="0"
            labelClass="text-[10px] text-red-600 font-black uppercase block mb-1.5"
            className="w-full bg-transparent border-b border-red-200 outline-none font-bold text-red-700 pb-1"
          />
        </div>
      </div>
    </section>
  );
};

export default AttendanceForm;
