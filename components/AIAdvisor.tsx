
import React, { useState } from 'react';
import { CalculationResult, IncomeData, DeductionData } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface AIAdvisorProps {
  result: CalculationResult;
  income: IncomeData;
  deduction: DeductionData;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ result, income, deduction }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const res = await getFinancialAdvice(result, income, deduction);
      setAdvice(res);
    } catch (error) {
      setAdvice('ขออภัย เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-3xl shadow-sm border p-6 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-500/10 transition-colors"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
          <span className="bg-amber-100 p-1.5 rounded-lg">
            <i className="fas fa-robot text-amber-600"></i>
          </span>
          ที่ปรึกษาการเงิน AI
        </h2>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-2xl text-[11px] font-black uppercase transition-all shadow-lg shadow-amber-100 active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
             <><i className="fas fa-spinner animate-spin"></i> กำลังวิเคราะห์...</>
          ) : (
             'รับคำแนะนำ'
          )}
        </button>
      </div>

      {advice ? (
        <div className="relative z-10">
          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-5 md:p-6 rounded-2xl border border-amber-100/40 shadow-inner">
            <div className="prose prose-sm max-w-none text-slate-700">
              <p className="whitespace-pre-line leading-relaxed text-[13px] font-medium font-['Kanit']">
                {advice}
              </p>
            </div>
          </div>
          <p className="text-[9px] text-slate-300 mt-3 text-right italic font-medium">* ข้อมูลจากการวิเคราะห์โดย Gemini AI</p>
        </div>
      ) : (
        <div className="py-6 text-center relative z-10">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.1em] opacity-60">
            วิเคราะห์สถานะการเงินและวางแผนภาษีด้วย AI
          </p>
        </div>
      )}
    </section>
  );
};

export default AIAdvisor;
