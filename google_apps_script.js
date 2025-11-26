// ==========================================
// Google Apps Script for Student Assessment
// ==========================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // รอคิวเขียนข้อมูลสูงสุด 10 วินาที

  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = {};

    if (action === 'SAVE_STUDENT') {
      result = saveStudent(ss, data.student);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  // ฟังก์ชันสำหรับดึงข้อมูล (ถ้าต้องการดึงข้อมูลกลับมาแสดงผลในอนาคต)
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'GET_ALL') {
    // ตัวอย่าง: อ่านข้อมูลทั้งหมด (หรือเลือกเฉพาะห้องที่ต้องการ)
    // การ implement ขึ้นอยู่กับความต้องการว่าจะดึงข้อมูลกลับมาอย่างไร
    return ContentService.createTextOutput(JSON.stringify({ status: 'ready' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ฟังก์ชันหลักในการบันทึกข้อมูล
function saveStudent(ss, student) {
  // 1. จัดการชื่อ Sheet (เช่น "ป.4/A" -> "ป.4-A") เพื่อให้ตั้งชื่อ Sheet ได้ถูกต้อง
  var sheetName = student.classLevel.replace('/', '-'); 
  var sheet = ss.getSheetByName(sheetName);

  // 2. ถ้ายังไม่มี Sheet ให้สร้างใหม่พร้อมหัวตาราง
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    createHeaders(sheet);
  }

  // 3. เตรียมข้อมูลที่จะลงตาราง
  var rowData = [
    student.id,
    "'" + student.number, // ใส่ ' เพื่อบังคับเป็น Text ป้องกัน format เพี้ยน
    student.firstName + " " + student.lastName,
    student.score || 0,
    student.percentage || 0,
    student.evaluationLevel || "",
    student.strengths || "",
    student.improvements || "",
    student.teacherName || "",
    student.assessmentDate || new Date().toLocaleDateString('th-TH'),
    JSON.stringify(student.rawScores || {}) // เก็บข้อมูลดิบไว้ช่องสุดท้ายเผื่อดึงกลับมาแก้ไข
  ];

  // 4. ค้นหาว่ามีนักเรียนคนนี้อยู่แล้วหรือไม่ (เช็คจาก ID ในคอลัมน์ A)
  var lastRow = sheet.getLastRow();
  var rowIndex = -1;

  // ถ้ามีข้อมูลมากกว่าแค่หัวตาราง (มากกว่า 1 แถว) ให้ค้นหา
  if (lastRow > 1) {
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues(); // อ่าน Column A ทั้งหมด
    for (var i = 0; i < ids.length; i++) {
      if (ids[i][0] == student.id) {
        rowIndex = i + 2; // +2 เพราะ i เริ่ม 0 และมีหัวตาราง 1 แถว
        break;
      }
    }
  }

  // 5. บันทึกหรืออัปเดต
  if (rowIndex > 0) {
    // อัปเดตแถวเดิม
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // เพิ่มแถวใหม่
    sheet.appendRow(rowData);
  }

  return { message: "Saved to " + sheetName };
}

// ฟังก์ชันสร้างหัวตาราง
function createHeaders(sheet) {
  var headers = [
    "ID", 
    "เลขที่", 
    "ชื่อ-นามสกุล", 
    "คะแนนรวม", 
    "ร้อยละ", 
    "ผลการประเมิน", 
    "จุดเด่น", 
    "จุดควรพัฒนา", 
    "ครูผู้ประเมิน", 
    "วันที่ประเมิน",
    "RawData" // ซ่อนหรือไม่ก็ได้ ใช้เก็บ JSON คะแนนรายข้อ
  ];
  
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // จัดรูปแบบหัวตาราง
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#102a43"); // สี Navy
  headerRange.setFontColor("#ffffff");
  sheet.setFrozenRows(1);
}
