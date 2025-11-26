
import { Student } from '../types';

// ************************************************************
// TODO: วาง Web App URL ที่ได้จากการ Deploy Google Apps Script ตรงนี้
// ************************************************************
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwAkYXUE0fijaZ6Z-Z_V9Hf2J01g8KDoMNUnVPBi_SqBFgmI86I2UKoAu7yqpQzYWExzw/exec"; 

export const saveStudentToSheet = async (student: Student): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Script URL is not configured. Data will only be saved locally.");
    return false;
  }

  try {
    // Google Apps Script Web App ต้องใช้ mode: 'no-cors' หรือจัดการ redirect ให้ดี
    // วิธีที่เสถียรที่สุดสำหรับการส่งข้อมูลคือใช้ fetch POST text/plain (เพื่อเลี่ยง Preflight CORS ของ Browser บางตัว)
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      // ใช้ stringify ข้อมูลทั้งหมดส่งไป
      body: JSON.stringify({
        action: 'SAVE_STUDENT',
        student: student
      })
    });

    // หมายเหตุ: ถ้าใช้ mode: 'no-cors' เราจะไม่สามารถอ่าน response.json() ได้
    // แต่ถ้า Deploy เป็น "Anyone" ส่วนใหญ่จะอ่านค่ากลับมาได้
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log("Data synced to Google Sheet successfully");
      return true;
    } else {
      console.error("Google Sheet Error:", result.message);
      return false;
    }

  } catch (error) {
    console.error("Failed to sync with Google Sheet:", error);
    return false;
  }
};

// ตัวอย่างฟังก์ชันดึงข้อมูล (ถ้าต้องการใช้ในอนาคต)
export const fetchStudentsFromSheet = async (classLevel: string) => {
    // Implementation pending...
};
