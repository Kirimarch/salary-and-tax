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
คุณคือผู้ช่วยดึงข้อมูลเงินเดือนและการทำงานจากข้อความ
ให้ดึงข้อมูลต่อไปนี้ และคืนค่าผลลัพธ์เป็น JSON Object เท่านั้น ห้ามมีข้อความอื่น ห้ามมี markdown format
คีย์สำหรับ JSON:
- name (string: ชื่อพนักงาน หากไม่มีไม่ต้องใส่)
- salary (number: เงินเดือนฐาน)
- days (number: จำนวนวันที่มาทำงานจริง)
- pos (number: ค่าตำแหน่ง)
- dil (number: เบี้ยขยัน)
- ot (number: จำนวนชั่วโมง OT)
- late (number: สายกี่นาที)
- absent (number: ขาดงานกี่วัน)

หากไม่พบข้อมูลไหนในประโยค ให้เอาคีย์นั้นออกไปเลย ห้ามใส่ null หรือ 0 ยกเว้นผู้ใช้ระบุว่า 0

ข้อความที่ต้องดึงข้อมูล:
"{MESSAGE}"
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
     const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
     const prompt = promptTemplate.replace('{MESSAGE}', userText);
     const result = await model.generateContent(prompt);
     const responseText = result.response.text().trim();
     
     // Remove markdown formatting if any
     let jsonString = responseText;
     if (jsonString.startsWith('```json')) {
         jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
     } else if (jsonString.startsWith('```')) {
         jsonString = jsonString.replace(/```/g, '').trim();
     }

     let data;
     try {
         data = JSON.parse(jsonString);
     } catch (e) {
         console.log("Failed to parse JSON: ", jsonString);
         return replyText(event.replyToken, 'ขออภัย ระบบไม่สามารถแยกแยะข้อมูลเงินเดือนได้ กรุณาลองพิมพ์ใหม่ เช่น "สมชาย เงินเดือน 25000 หักสาย 30 นาที"');
     }

     if (Object.keys(data).length === 0) {
         return replyText(event.replyToken, 'กรุณาระบุข้อมูลที่ต้องการคำนวณ เช่น "สมชาย เงินเดือน 30000 ขาดงาน 1 วัน"');
     }

     const params = new URLSearchParams();
     for (const key of Object.keys(data)) {
         params.append(key, data[key]);
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
           contents: [Object.keys(data).map(key => ({
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
           })).flat()]
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
