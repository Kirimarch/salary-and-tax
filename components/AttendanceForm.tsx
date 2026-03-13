
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
      <h2 className="text-xs font-black text-slate-400 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">
        <i className="fas fa-calendar-times text-rose-500"></i> ข้อมูลการลาและสาย (Attendance)
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'พักร้อน (วัน)', name: 'annualLeave', bg: 'bg-emerald-50/40', border: 'border-emerald-100/50', color: 'text-emerald-600', max: 31 },
          { label: 'ลาป่วย (วัน)', name: 'sickLeaveWithCert', bg: 'bg-emerald-50/40', border: 'border-emerald-100/50', color: 'text-emerald-600', max: 31 },
          { label: 'ลากิจ (วัน)', name: 'personalLeave', bg: 'bg-orange-50/40', border: 'border-orange-100/50', color: 'text-orange-600', max: 31 },
          { label: 'ลาฝึกอบรม (วัน)', name: 'trainingLeave', bg: 'bg-emerald-50/40', border: 'border-emerald-100/50', color: 'text-emerald-600', max: 31 },
          { label: 'ลาคลอด (วัน)', name: 'maternityLeave', bg: 'bg-indigo-50/40', border: 'border-indigo-100/50', color: 'text-indigo-600', max: 98 },
          { label: 'ขาดงาน (วัน)', name: 'absentDays', bg: 'bg-rose-50/40', border: 'border-rose-100/50', color: 'text-rose-600', max: 31 },
        ].map((item: any) => (
          <div key={item.name} className={`${item.bg} p-4 rounded-2xl border ${item.border} transition-all hover:shadow-sm`}>
            <NumericInput
              label={item.label}
              name={item.name}
              value={attendance[item.name as keyof typeof attendance]}
              onChange={handleAttendanceChange}
              placeholder="0"
              labelClass={`text-[9px] ${item.color} font-black uppercase block mb-1 tracking-wider`}
              className={`w-full bg-transparent border-b border-current/20 focus:border-current outline-none font-black ${item.color} pb-1 text-lg`}
              max={item.max}
            />
          </div>
        ))}
        <div className="p-4 bg-rose-50/40 rounded-2xl border border-rose-100/50 col-span-2">
          <NumericInput
            label="มาสายสะสม (นาที)"
            name="lateMinutes"
            value={attendance.lateMinutes}
            onChange={handleAttendanceChange}
            placeholder="0"
            labelClass="text-[9px] text-rose-600 font-black uppercase block mb-1 tracking-wider"
            className="w-full bg-transparent border-b border-rose-300 focus:border-rose-500 outline-none font-black text-rose-700 pb-1 text-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default AttendanceForm;
