import { CalculationResult, IncomeData, DeductionData } from "../types";

export const getFinancialAdvice = async (
  result: CalculationResult,
  income: IncomeData,
  deduction: DeductionData
): Promise<string> => {
  // @ts-ignore
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return "โปรแกรมหา API Key ไม่เจอ (กรุณาเช็กหน้า Variables ใน Railway)";
  }

  const prompt = `วิเคราะห์รายได้เดือนละ ${result.monthlyNet} บาท และแนะนำการออมสั้นๆ 3 ข้อ`;

  // รายชื่อโมเดลที่จะลองเรียงตามลำดับ
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.0-pro"
  ];

  let lastError = "";

  for (const modelName of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();

      if (response.ok) {
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI ไม่มีคำตอบ";
      } else {
        lastError = data.error?.message || "Unknown error";
        console.warn(`Model ${modelName} failed:`, lastError);
      }
    } catch (e: any) {
      lastError = e.message;
    }
  }

  // --- ถ้าลองทุกตัวแล้วยังไม่ได้ (404 หมด) ให้ไปดึงรายชื่อโมเดลที่ Key นี้ใช้ได้จริงมาโชว์ ---
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    
    if (listData.models) {
      const availableModels = listData.models.map((m: any) => m.name.replace("models/", "")).join(", ");
      return `Google แจ้งว่าไม่เจอโมเดลที่คุณสั่ง (404) แต่ Key ของคุณสามารถใช้รุ่นเหล่านี้ได้: ${availableModels} (โปรดเลือกหนึ่งตัวมาบอกผม เดี๋ยวผมแก้ให้ครับ)`;
    }
  } catch (e) {}

  return `ไม่สามารถใช้โมเดลไหนได้เลย: ${lastError} (รบกวนลองสร้าง API Key ใหม่ใน AI Studio หรือรอ 5-10 นาทีให้ระบบ Google อัปเดตสิทธิ์ครับ)`;
};
