
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
      <div className="bg-gradient-to-br from-slate-900 via-[#1E293B] to-slate-900 rounded-[2rem] shadow-2xl p-7 md:p-10 text-white relative overflow-hidden border border-white/5 [container-type:inline-size]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-20 -mb-20 blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 min-w-0">
          <div className="space-y-4 flex-1 w-full min-w-0">
            <div className="space-y-1">
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">สรุปรายรับสุทธิ (Net Pay)</p>
               <h2 className="text-white/90 text-sm md:text-base font-bold flex items-center gap-2">
                 <i className="fas fa-user-circle text-indigo-400 opacity-70"></i>
                 {employeeName || "ข้อมูลพนักงานทั่วไป"} {employeeId && <span className="text-slate-500 text-xs font-medium">#{employeeId}</span>}
               </h2>
            </div>
            
            <div className="py-2 overflow-hidden">
               <p className="text-indigo-300/60 text-[10px] font-bold uppercase mb-1">ยอดเงินเดือนสุทธิที่ได้รับ</p>
               <h3 className="text-[clamp(1.5rem,10cqw,4.5rem)] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-[1.1] transition-all duration-300 whitespace-nowrap">
                {hasInput ? formatCurrency(result.monthlyNet) : formatCurrency(0)}
               </h3>
            </div>

             <div className="flex flex-wrap gap-2 md:gap-3">
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-2 max-w-full whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                  <span>หักประกันสังคม {formatCurrency(result.monthlySSO)}</span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md flex items-center gap-2 max-w-full whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                  <span>หักภาษี {formatCurrency(result.monthlyTax)}</span>
                </div>
             </div>
          </div>

           <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] w-full lg:w-auto min-w-0 lg:max-w-[30%] lg:min-w-[200px] shadow-inner">
            <div className="space-y-6 min-w-0">
              <div className="min-w-0">
                <p className="text-[10px] md:text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">รายได้เฉลี่ยต่อวัน</p>
                <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-white leading-tight break-words">
                  {hasInput ? formatCurrency(result.dailyRate) : formatCurrency(0)}
                </p>
              </div>
              <div className="pt-5 border-t border-white/5 min-w-0">
                <p className="text-[10px] md:text-[12px] font-black text-slate-500 uppercase tracking-widest mb-1">ฐานหักรายนาที</p>
                <p className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-indigo-300 break-words">฿{hasInput ? result.minuteRate.toFixed(2) : "0.00"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
         <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
           <h3 className="text-[10px] md:text-xs font-black text-slate-500 uppercase">รายละเอียดสรุปยอด</h3>
           <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">ข้อมูลเงินเดือน (Payroll)</span>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-[13px] md:text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-slate-600 font-medium min-w-[140px]">เงินเดือนพื้นฐาน + ค่าตำแหน่ง</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-slate-800 break-all">{formatCurrency(result.grossSalary)}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-slate-600 font-medium min-w-[140px]">ค่าล่วงเวลา (OT)</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-blue-600 break-all">+{formatCurrency(result.otAmount)}</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-slate-600 font-medium min-w-[140px]">เบี้ยขยัน</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-green-600 break-all">+{formatCurrency(income.diligenceAllowance)}</td>
                </tr>
                
                {result.autoAbsentDays > 0 && (
                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium min-w-[140px]">หักขาดงานอัตโนมัติ ({result.autoAbsentDays} วัน)</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500 break-all">-{formatCurrency(result.autoAbsentDays * result.dailyRate)}</td>
                  </tr>
                )}

                <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium min-w-[140px]">หักวันขาดงาน / ลากิจ</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500 break-all">
                    -{formatCurrency(result.leaveDeductions + (attendance.absentDays * result.dailyRate))}
                  </td>
                </tr>

                {result.maternityDeduction > 0 && (
                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium min-w-[140px]">หักลาคลอด (ส่วนเกิน 45 วัน)</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500 break-all">-{formatCurrency(result.maternityDeduction)}</td>
                  </tr>
                )}

                {result.trainingDeduction > 0 && (
                  <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                    <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium min-w-[140px]">หักลาฝึกอบรม (ส่วนเกิน 5 วัน)</td>
                    <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500 break-all">-{formatCurrency(result.trainingDeduction)}</td>
                  </tr>
                )}

                <tr className="hover:bg-slate-50 transition-colors bg-red-50/20">
                  <td className="py-3 md:py-4 px-4 md:px-6 text-red-600 italic font-medium min-w-[140px]">หักมาสาย {attendance.lateMinutes || 0} นาที</td>
                  <td className="py-3 md:py-4 px-4 md:px-6 text-right font-bold text-red-500 break-all">-{formatCurrency(result.lateDeduction)}</td>
                </tr>
                <tr className="bg-indigo-50/50">
                  <td className="py-4 md:py-5 px-4 md:px-6 font-black text-indigo-900 text-sm md:text-base min-w-[140px]">ฐานรายได้สุทธิก่อนภาษี</td>
                  <td className="py-4 md:py-5 px-4 md:px-6 text-right font-black text-indigo-900 text-sm md:text-base underline decoration-indigo-200 underline-offset-4 break-all">
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
