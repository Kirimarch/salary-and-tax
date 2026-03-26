import express from 'express';
import * as line from '@line/bot-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const port = process.env.PORT || 3000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const promptTemplate = `
คุณคือ "เจ้าหน้าที่พอล" ผู้ช่วยชายอัจฉริยะฝ่ายบุคคล (HR Assistant) สุภาพ มั่นใจ และเป็นกันเอง
บุคลิก: ใช้คำลงท้ายว่า "ครับ" ทุกครั้ง แทนตัวเองว่า "ผม" หรือ "เจ้าหน้าที่พอล" ครับ

หน้าที่ของคุณ:
1. วิเคราะห์ความต้องการของผู้ใช้และดึงข้อมูลใส่ JSON
2. ให้คำแนะนำหรือพูดคุยอย่างมีความหลากหลายในฟิลด์ "text"
3. **สำคัญมาก**: ห้ามตอบข้อความอื่นๆ นอกเหนือจาก JSON Object เท่านั้น ห้ามมีบทสนทนานำหรือตามหลังเด็ดขาด

ให้ตอบกลับเป็น JSON Object เท่านั้น โดยมีโครงสร้างดังนี้:
{
  "type": "calculate" | "greeting" | "help" | "unknown",
  "data": { // ใส่ข้อมูลเฉพาะเมื่อ type เป็น "calculate" เท่านั้น
    "id": "รหัสพนักงาน",
    "name": "ชื่อพนักงาน",
    "salary": 25000,
    "days": 26,
    "pos": 0,
    "dil": 0,
    "ot": 0,
    "late": 0,
    "absent": 0
  },
  "text": "ข้อความตอบกลับจากเจ้าหน้าที่พอล (ต้องมีหางเสียงครับ)"
}

เกณฑ์การตัดสิน type:
- "calculate": เมื่อมีการระบุเงินเดือน, วันทำงาน, หรือข้อมูลรายได้/รายหัก
- "greeting": เมื่อเป็นการทักทาย เช่น สวัสดี, หวัดดี, ทักครับ, hi, hello
- "help": เมื่อถามวิธีใช้, ทำอะไรได้บ้าง, สอนหน่อย, ใช้ยังไง
- "unknown": เมื่อไม่ตรงกับข้อไหนเลย หรือเป็นคำถามทั่วไป

คำแนะนำในการตอบ "text":
- สำหรับ "greeting": ทักทายหลากหลายรูปแบบ (เช่น "สวัสดีครับผมพอลครับ มีอะไรให้ช่วยไหมครับ?", "ยินดีที่ได้รู้จักครับผม!")
- สำหรับ "help": อธิบายแบบเป็นกันเอง (เช่น "พิมพ์ชื่อตามด้วยเงินเดือนได้เลยครับ เดี๋ยวผมจัดการให้เอง!")
- สำหรับ "calculate": ให้กำลังใจเล็กน้อย (เช่น "ข้อมูลครบถ้วนครับผม! เดี๋ยวผมเตรีมลิงก์สลิปเงินเดือนสวยๆ ให้ครับรอสักครู่", "ขยันแบบนี้โบนัสปีนี้ปังแน่นอนครับ!")
- สำหรับ "unknown": ตอบแบบสุภาพและพยายามไกด์ให้ใช้ระบบครับ

ข้อความจากผู้ใช้: "{MESSAGE}"
`;

const lineClient = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

// For health check
app.get('/', (req, res) => {
  res.send('LINE Bot is running!');
});

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userText = event.message.text;

   try {
     const model = genAI.getGenerativeModel({ 
       model: "gemini-2.5-flash", // ตัวที่เร็วที่สุดในตระกูล 1.5 (8B parameters)
       generationConfig: {
         temperature: 0.4, // พอดีๆ ไม่เพ้อเจ้อจนทำ JSON พัง
         maxOutputTokens: 500, 
         responseMimeType: "application/json" 
       }
     });

     const prompt = promptTemplate.replace('{MESSAGE}', userText);
     const result = await model.generateContent(prompt);
     const responseText = result.response.text().trim();
     
     let aiResponse;
     try {
         // เพิ่มความสามารถในการแกะ JSON แม้มีข้อความอื่นแถมมา (Robust JSON Extraction)
         const jsonMatch = responseText.match(/\{[\s\S]*\}/);
         const jsonString = jsonMatch ? jsonMatch[0] : responseText;
         aiResponse = JSON.parse(jsonString);
     } catch (e) {
         console.log("Failed to parse JSON: ", responseText);
         return replyText(event.replyToken, 'ขออภัยครับ เจ้าหน้าที่พอลไม่เข้าใจข้อมูลนี้ รบกวนแจ้งอีกครั้งนะครับ หรือพิมพ์ "สอนหน่อย" ครับ');
     }

     // ถ้าเป็นกรณี Greeting หรือ Help ให้ตอบเป็นข้อความ Text ปกติ
     if (aiResponse.type !== 'calculate') {
         return replyText(event.replyToken, aiResponse.text || 'มีอะไรให้ผมช่วยไหมครับ?');
     }

     const data = aiResponse.data;
     if (!data || Object.keys(data).length === 0 || !data.salary) {
         return replyText(event.replyToken, aiResponse.text || 'กรุณาระบุข้อมูลเงินเดือนมาด้วยนะครับ เช่น "สมชาย เงินเดือน 30000"');
     }

     const params = new URLSearchParams();
     for (const key of Object.keys(data)) {
         if (data[key] !== undefined && data[key] !== null) {
             params.append(key, data[key]);
         }
     }

     const finalUrl = `${process.env.WEB_APP_URL}?${params.toString()}`;
     
     const flexMessage = {
       type: "flex",
       altText: `ลิ้งค์ระบบคำนวณรอบบิลของ ${data.name || 'คุณ'}`,
       contents: {
         type: "bubble",
         header: {
           type: "box",
           layout: "vertical",
           contents: [
             {
               type: "text",
               text: "สรุปข้อมูลที่ระบบอ่านได้",
               weight: "bold",
               color: "#ffffff"
             }
           ],
           backgroundColor: "#4f46e5"
         },
         body: {
           type: "box",
           layout: "vertical",
           contents: Object.keys(data).map(key => ({
             type: "box",
             layout: "horizontal",
             contents: [
               {
                 type: "text",
                 text: key.toUpperCase(),
                 size: "sm",
                 color: "#888888",
                 flex: 4
               },
               {
                 type: "text",
                 text: `${data[key]}`,
                 size: "sm",
                 color: "#111111",
                 align: "end",
                 weight: "bold",
                 flex: 6
               }
             ]
           }))
         },
         footer: {
           type: "box",
           layout: "vertical",
           contents: [
             {
               type: "button",
               action: {
                 type: "uri",
                 label: "เปิดหน้าคำนวณเงินเดือน",
                 uri: finalUrl
               },
               style: "primary",
               color: "#4f46e5"
             }
           ]
         }
       }
     };

     return lineClient.replyMessage({ 
         replyToken: event.replyToken, 
         messages: [flexMessage] 
     });
     
  } catch (error) {
     console.error(error);
     return replyText(event.replyToken, 'เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง');
  }
}

function replyText(replyToken, text) {
  return lineClient.replyMessage({
      replyToken: replyToken,
      messages: [{ type: 'text', text: text }]
  });
}

const PORT = port || 3000;
app.listen(PORT, () => {
  console.log(`LINE Bot listening on port ${PORT}`);
});
