import { CalculationResult, IncomeData, DeductionData } from "../types";

export const getFinancialAdvice = async (
  result: CalculationResult,
  income: IncomeData,
  deduction: DeductionData
): Promise<string> => {
  // @ts-ignore
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    return "กรุณาตั้งค่า API Key ในไฟล์ .env และ Restart ระบบ";
  }

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

  // รายชื่อ Model และ Version ที่จะลอง (เรียงตามลำดับความน่าจะเป็นไปได้)
  const attempts = [
    { ver: 'v1', model: 'gemini-1.5-flash' },
    { ver: 'v1beta', model: 'gemini-1.5-flash' },
    { ver: 'v1', model: 'gemini-pro' },
    { ver: 'v1beta', model: 'gemini-pro' }
  ];

  let lastError = "";

  for (const attempt of attempts) {
    const url = `https://generativelanguage.googleapis.com/${attempt.ver}/models/${attempt.model}:generateContent?key=${apiKey}`;
    
    try {
      console.log(`Trying Gemini with ${attempt.ver} and ${attempt.model}...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      });

      const data = await response.json();

      if (response.ok) {
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) return aiText;
      } else {
        lastError = data.error?.message || `Error ${response.status}`;
        console.warn(`Attempt failed for ${attempt.model}:`, lastError);
      }
    } catch (e: any) {
      lastError = e.message;
      console.warn(`Fetch failed for ${attempt.model}:`, e.message);
    }
  }

  return `ไม่สามารถติดต่อ AI ได้หลังพยายามหลายครั้ง: ${lastError} (โปรดเช็กว่า Key ของคุณเปิดใช้งาน Gemini API ไว้แล้วใน AI Studio)`;
};
