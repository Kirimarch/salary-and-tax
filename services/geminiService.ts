
import { GoogleGenAI } from "@google/genai";
import { CalculationResult, IncomeData, DeductionData } from "../types";

export const getFinancialAdvice = async (
  result: CalculationResult,
  income: IncomeData,
  deduction: DeductionData
): Promise<string> => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Fixed: Changed 'monthlyGross' to 'monthlyGrossAfterDeductions' as it is the correct property in CalculationResult.
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
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // The 'text' property directly returns the generated string.
    return response.text || "ขออภัย ไม่สามารถดึงข้อมูลคำแนะนำได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "เกิดข้อผิดพลาดในการติดต่อที่ปรึกษา AI";
  }
};
