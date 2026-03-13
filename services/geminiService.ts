import { CalculationResult, IncomeData, DeductionData } from "../types";

export const getFinancialAdvice = async (
  result: CalculationResult,
  income: IncomeData,
  deduction: DeductionData
): Promise<string> => {
  // ดึงรหัสผ่านทางที่มาตรฐานที่สุดของ Vite
  // @ts-ignore
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return "โปรแกรมหา API Key ไม่เจอ (กรุณาตรวจสอบหน้า Variables ใน Railway ว่าพิมพ์ชื่อ VITE_GEMINI_API_KEY ถูกต้อง และลองกด Redeploy อีกครั้งครับ)";
  }

  const prompt = `
    ในฐานะที่ปรึกษาทางการเงินมืออาชีพ ช่วยวิเคราะห์สถานะทางการเงินของผู้ใช้คนนี้:
    - รายรับต่อเดือน (ก่อนหักภาษี/ประกันสังคม): ${result.monthlyGrossAfterDeductions} บาท
    - รายรับต่อปีรวมโบนัส: ${result.yearlyGross} บาท
    - ภาษีที่ต้องจ่ายต่อปี: ${result.yearlyTax} บาท
    - เงินเดือนสุทธิหลังหักภาษี: ${result.monthlyNet} บาท

    กรุณาให้คำแนะนำสั้นๆ 3 ข้อ เป็นภาษาไทย เกี่ยวกับ:
    1. การวางแผนภาษี
    2. การออมและการลงทุน
    3. คำแนะนำอื่นๆ
    
    จัดรูปแบบเป็น Bullet points ที่อ่านง่าย
  `;

  // ใช้ URL ที่ตรงตัวที่สุดตามคู่มือ Google
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // ถ้า Google ตอบกลับมาเป็น Error ให้โชว์เหตุผลจริงๆ ออกมาเลย
      console.error("Google API Error:", data);
      return `Google แจ้งความผิดพลาด (${response.status}): ${data.error?.message || "ไม่ทราบสาเหตุ"}`;
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI ไม่มีคำตอบกลับมาในขณะนี้";

  } catch (error: any) {
    console.error("Fetch Error:", error);
    return `ข้อผิดพลาดในการเชื่อมต่อ: ${error.message}`;
  }
};
