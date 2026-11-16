//routes/indexRouter.js//

const { Router } = require("express");
const folderController = require("../controllers/folderController");

const folderRouter = Router();

// Middleware ตรวจสอบการเข้าสู่ระบบ
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/log-in");
};

// Route สร้าง Folder ใหม่ (รับค่าจาก Form POST)
folderRouter.post("/create", isAuthenticated, folderController.createFolder);

// Route ดูหน้าตาและไฟล์ภายใน Folder เฉพาะ
folderRouter.get("/:id", isAuthenticated, folderController.getFolderDetails);

// Route ลบ Folder
folderRouter.post("/:id/delete", isAuthenticated, folderController.deleteFolder);

folderRouter.post("/:id/share", isAuthenticated, folderController.shareFolder);

module.exports = folderRouter;