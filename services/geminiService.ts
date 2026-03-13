import { GoogleGenerativeAI } from "@google/generative-ai";
import { CalculationResult, IncomeData, DeductionData } from "../types";

export const getFinancialAdvice = async (
  result: CalculationResult,
  income: IncomeData,
  deduction: DeductionData
): Promise<string> => {
  // @ts-ignore
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") return "กรุณาตั้งค่า API Key ในไฟล์ .env และ Restart ระบบ";
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const prompt = `
    ในฐานะที่ปรึกษาทางการเงินมืออาชีพ ช่วยวิเคราะห์สถานะทางการเงินของผู้ใช้คนนี้:
    - รายรับต่อเดือน (ก่อนหักภาษี/ประกันสังคม): ${result.monthlyGrossAfterDeductions} บาท
    - รายรับต่อปีรวมโบนัส: ${result.yearlyGross} บาท
    - ภาษีที่ต้องจ่ายต่อปี: ${result.yearlyTax} บาท (ฐานภาษีสูงสุด: ${result.taxBracket})
    - ประกันสังคมต่อเดือน: ${result.monthlySSO} บาท
    - กองทุนสำรองเลี้ยงชีพ: ${result.monthlyProvidentFund} บาท (${deduction.providentFundRate}%)
    - เงินเดือนสุทธิหลังหักภาษีและอื่นๆ: ${result.monthlyNet} บาท

    กรุณาให้คำแนะนำสั้นๆ 3-4 ข้อ เป็นภาษาไทย เกี่ยวกับ:
    1. การวางแผนภาษี (เช่น การลดหย่อนเพิ่มเติมผ่าน SSF, RMF หรือประกัน)
    2. การออมและการลงทุนที่เหมาะสมกับรายได้ระดับนี้
    3. คำแนะนำอื่นๆ เพื่อความมั่งคั่งในอนาคต
    
    จัดรูปแบบเป็น Bullet points ที่อ่านง่าย และให้กำลังใจ
  `;

  try {
    // เปลี่ยนมาใช้ gemini-pro ซึ่งเป็นรุ่นมาตรฐานที่สุด (ชัวร์กว่า)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    
    return text || "ขออภัย ไม่สามารถดึงข้อมูลคำแนะนำได้ในขณะนี้";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return `เกิดข้อผิดพลาด: ${error?.message || "ติดต่อ AI ไม่ได้"}`;
  }
};
