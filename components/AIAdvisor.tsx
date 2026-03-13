
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
    <section className="bg-white rounded-2xl shadow-sm border p-6 border-amber-100 ring-4 ring-amber-50/30">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-amber-600 flex items-center gap-2 uppercase tracking-tight">
          <i className="fas fa-robot text-amber-500 animate-bounce"></i> AI Financial Advisor
        </h2>
        <button
          onClick={handleGetAdvice}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {loading ? 'กำลังวิเคราะห์...' : 'รับคำแนะนำ'}
        </button>
      </div>

      {advice ? (
        <div className="prose prose-sm max-w-none text-slate-600 bg-amber-50/30 p-4 rounded-xl border border-amber-100/50">
          <p className="whitespace-pre-line leading-relaxed text-[13px] font-medium italic">
            {advice}
          </p>
        </div>
      ) : (
        <div className="py-2 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
            ให้ AI ช่วยวิเคราะห์สถานะการเงินของคุณสิ
          </p>
        </div>
      )}
    </section>
  );
};

export default AIAdvisor;
