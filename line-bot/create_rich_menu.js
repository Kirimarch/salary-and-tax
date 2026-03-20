import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;
const HR_LINE_ID_URL = 'https://line.me/R/ti/p/@HR_ID_HERE'; // เปลี่ยนเป็นลิงก์เพิ่มเพื่อน HR ของคุณ

const richMenu = {
  size: { width: 2500, height: 843 }, // แบบเตี้ย (Half) เพื่อไม่ให้บังแชทเยอะ
  selected: true,
  name: "Main Menu",
  chatBarText: "เมนูหลัก",
  areas: [
    {
      // ช่องที่ 1: เงินเดือน (เปิดเว็บ)
      bounds: { x: 0, y: 0, width: 833, height: 843 },
      action: { type: "uri", label: "เงินเดือน", uri: WEB_APP_URL }
    },
    {
      // ช่องที่ 2: ติดต่อ HR
      bounds: { x: 833, y: 0, width: 833, height: 843 },
      action: { type: "uri", label: "ติดต่อ HR", uri: HR_LINE_ID_URL }
    },
    {
      // ช่องที่ 3: แชท (สั่งเปิดคีย์บอร์ด)
      bounds: { x: 1666, y: 0, width: 834, height: 843 },
      action: { type: "message", label: "แชท", text: "สอนใช้บอทหน่อย" }
    }
  ]
};

async function createRichMenu() {
  try {
    // 1. สร้าง Rich Menu
    const res = await axios.post(
      'https://api.line.me/v2/bot/richmenu',
      richMenu,
      { headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`, 'Content-Type': 'application/json' } }
    );
    const richMenuId = res.data.richMenuId;
    console.log(`✅ สร้าง Rich Menu สำเร็จ! ID: ${richMenuId}`);

    // 2. ตั้งค่าให้เป็นเมนูหลัก (Default)
    await axios.post(
      `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
      {},
      { headers: { 'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}` } }
    );
    console.log('🚀 ตั้งค่าให้เป็นเมนูหลักของทุกคนเรียบร้อย!');

    console.log('\n⚠️ หมายเหตุ: อย่าลืมอัปโหลดรูปภาพเมนูผ่าน LINE Official Account Manager หรือใช้ API อัปโหลดรูปภาพด้วยนะครับ');
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.response ? error.response.data : error.message);
  }
}

createRichMenu();
