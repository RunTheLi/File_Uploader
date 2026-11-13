//middleware/uploadMiddleware.js//
const multer = require("multer");
const path = require("path");

// ตั้งค่าการจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // เก็บไว้ที่โฟลเดอร์ public/uploads
  },
  filename: (req, file, cb) => {
    // ป้องกันชื่อไฟล์ซ้ำกันโดยการเติม Timestamp และสุ่มตัวเลข
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;