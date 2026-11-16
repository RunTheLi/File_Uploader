//controllers/fileController.js//
const prisma = require("../db/prisma");
const path = require("path");
const fs = require("fs");

// 1. file Upload management
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;

    // บันทึก Metadata ของไฟล์ลงในฐานข้อมูล PostgreSQL ผ่าน Prisma
    await prisma.file.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`,
        userId: req.user.id,
        folderId: folderId,
      },
    });

    // ถ้าอัปโหลดเข้า Folder ไหน ให้เด้งกลับไปหน้า Folder นั้น ถ้าไม่มีให้กลับหน้าแรก
    if (folderId) {
      res.redirect(`/folders/${folderId}`);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    next(err);
  }
};

// 2. ดูรายละเอียดไฟล์
const getFileDetails = async (req, res, next) => {
  try {
    const fileId = parseInt(req.params.id);

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    // เช็คว่ามีไฟล์นี้จริง และเป็นเจ้าของไฟล์หรือไม่
    if (!file || file.userId !== req.user.id) {
      return res.status(404).render("404");
    }

    res.render("file-details", { file });
  } catch (err) {
    next(err);
  }
};

// 3. ดาวน์โหลดไฟล์
const downloadFile = async (req, res, next) => {
  try {
    const fileId = parseInt(req.params.id);

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== req.user.id) {
      return res.status(404).render("404");
    }

    const filePath = path.join(__dirname, "../public/uploads", file.filename);
    
    // ใช้คำสั่ง res.download เพื่อส่งไฟล์ให้ผู้ใช้ดาวน์โหลดโดยใช้ชื่อเดิม (originalName)
    res.download(filePath, file.originalName);
  } catch (err) {
    next(err);
  }
};

// 4. delete file
const deleteFile = async (req, res, next) => {
  try {
    const fileId = parseInt(req.params.id);

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== req.user.id) {
      return res.status(404).render("404");
    }

    // ลบไฟล์จริงออกจากเครื่อง (Filesystem)
    const filePath = path.join(__dirname, "../public/uploads", file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // ลบข้อมูลออกจาก Database
    await prisma.file.delete({
      where: { id: fileId },
    });

    // ถ้าไฟล์นี้เคยอยู่ใน Folder ให้เด้งกลับไปหน้า Folder นั้น ถ้าไม่มีกลับหน้าแรก
    if (file.folderId) {
      res.redirect(`/folders/${file.folderId}`);
    } else {
      res.redirect("/");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadFile,
  getFileDetails,
  downloadFile,
  deleteFile
};