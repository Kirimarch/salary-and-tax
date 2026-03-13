
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';
import { CalculationResult, IncomeData, AttendanceData } from '../types';
import { formatCurrency } from '../utils/calculators';

interface ResultsPanelProps {
  result: CalculationResult;
  income: IncomeData;
  attendance: AttendanceData;
  employeeName: string;
  employeeId: string;
  hasInput: boolean;
  handleDownloadExcel: () => void;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  income,
  attendance,
  employeeName,
  employeeId,
  hasInput,
  handleDownloadExcel
}) => {
  const chartData = [
    { name: 'สุทธิ', value: result.monthlyNet },
    { name: 'หักวันลา/สาย/ขาด', value: result.leaveDeductions + result.lateDeduction + result.absentDeduction + result.maternityDeduction + result.trainingDeduction },
    { name: 'ประกันสังคม', value: result.monthlySSO },
    { name: 'ภาษี', value: result.monthlyTax },
  ];

  return (
    <div className="xl:col-span-7 space-y-6">
      
      {/* Main Net Dashboard */}
      <div className="bg-indigo-900 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 md:gap-8">
          <div className="space-y-2 flex-1 w-full">
            <div className="flex flex-col gap-1 mb-3 md:mb-4">
               <p className="text-indigo-200 text-xs md:text-sm font-bold truncate max-w-full">
                 {employeeName || "ชื่อพนักงาน"} {employeeId && `[${employeeId}]`}
               </p>
               <p className="text-indigo-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">เงินเดือนสุทธิที่คุณจะได้รับ</p>
            </div>
            <h3 className="text-4xl xs:text-5xl md:text-6xl font-black truncate leading-none">
              {hasInput ? formatCurrency(result.monthlyNet) : formatCurrency(0)}
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-3 pt-3 md:pt-4">
               <div className="bg-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold backdrop-blur-md italic">
                 หักประกันสังคม {formatCurrency(result.monthlySSO)}
               </div>
               <div className="bg-white/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold backdrop-blur-md italic">
                 ภาษี {formatCurrency(result.monthlyTax)}
               </div>
            </div>
          </div>
          <div className="bg-white text-indigo-900 p-5 md:p-6 rounded-[1.25rem] md:rounded-[1.5rem] shadow-xl w-full sm:w-auto text-center sm:text-left min-w-[160px] md:min-w-[200px]">
            <p className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase mb-1">รายได้ต่อวัน (Avg.)</p>
            <p className="text-xl md:text-2xl font-black">{hasInput ? formatCurrency(result.dailyRate) : formatCurrency(0)}</p>
            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-indigo-50">
              <p className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase mb-1">หักรายนาที</p>
              <p className="text-base md:text-lg font-bold">฿{hasInput ? result.minuteRate.toFixed(2) : "0.00"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
         <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
           <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase">รายละเอียดสรุปยอด</h3>
           <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Payroll Data</span>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-[13px] md:text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-slate-600 font-medium">เงินเดือนพื้นฐาน + ค่าตำแหน่ง</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-slate-800">{formatCurrency(result.grossSalary)}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-slate-600 font-medium">ค่าล่วงเวลา (OT)</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-blue-600">+{formatCurrency(result.otAmount)}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-slate-600 font-medium">เบี้ยขยัน</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-green-600">+{formatCurrency(income.diligenceAllowance)}</td>
                </tr>
                
                {result.autoAbsentDays > 0 && (
                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium">หักขาดงานอัตโนมัติ ({result.autoAbsentDays} วัน)</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500">-{formatCurrency(result.autoAbsentDays * result.dailyRate)}</td>
                  </tr>
                )}

                <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium">หักวันขาดงาน / ลากิจ</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500">
                    -{formatCurrency(result.leaveDeductions + (attendance.absentDays * result.dailyRate))}
                  </td>
                </tr>

                {result.maternityDeduction > 0 && (
                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium">หักลาคลอด (ส่วนเกิน 45 วัน)</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500">-{formatCurrency(result.maternityDeduction)}</td>
                  </tr>
                )}

                {result.trainingDeduction > 0 && (
                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium">หักลาฝึกอบรม (ส่วนเกิน 5 วัน)</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500">-{formatCurrency(result.trainingDeduction)}</td>
                  </tr>
                )}

                <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium">หักมาสาย {attendance.lateMinutes || 0} นาที</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500">-{formatCurrency(result.lateDeduction)}</td>
                </tr>
                <tr className="bg-indigo-50/50">
                  <td className="py-4 md:py-5 px-4 md:px-6 font-black text-indigo-900 text-sm md:text-base">ฐานรายได้สุทธิก่อนภาษี</td>
                  <td className="py-4 md:py-5 px-4 md:px-6 text-right font-black text-indigo-900 text-sm md:text-base underline decoration-indigo-200 underline-offset-4">
                    {formatCurrency(result.monthlyGrossAfterDeductions)}
                  </td>
                </tr>
              </tbody>
           </table>
         </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center min-h-[350px]">
        {hasInput ? (
          <div className="w-full h-full flex flex-col">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 text-center">สัดส่วนการกระจายรายได้</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData} innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                  {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none focus:opacity-80 transition-opacity" />)}
                </Pie>
                <RechartsTooltip formatter={(val: number) => formatCurrency(val)} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center space-y-4 opacity-20">
            <i className="fas fa-chart-pie text-6xl"></i>
            <p className="text-xs font-bold uppercase tracking-widest">กราฟจะแสดงเมื่อมีข้อมูลรายได้</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
