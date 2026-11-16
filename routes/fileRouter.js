//routes/fileRouter.js

const { Router } = require("express");
const fileController = require("../controllers/fileController");
const upload = require("../middleware/uploadMiddleware");

const fileRouter = Router();

// Middleware เช็คการล็อกอิน
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/log-in");
};

// Route รับไฟล์อัปโหลด (ชื่อฟิลด์ในฟอร์มคือ "file")
fileRouter.post("/upload", isAuthenticated, upload.single("file"), fileController.uploadFile);

// Route ดูรายละเอียดไฟล์
fileRouter.get("/:id", isAuthenticated, fileController.getFileDetails);

// Route ดาวน์โหลดไฟล์
fileRouter.get("/:id/download", isAuthenticated, fileController.downloadFile);

// Route ลบไฟล์ (ใช้ POST เพื่อความปลอดภัย หรือ DELETE ตามชอบ)
fileRouter.post("/:id/delete", isAuthenticated, fileController.deleteFile);

module.exports = fileRouter;