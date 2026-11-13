//controllers/folderController.js//
const prisma = require("../db/prisma");

// สร้าง Folder ใหม่
const createFolder = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === "") {
      return res.redirect("/");
    }

    // บันทึก Folder ลง Database โดยผูกกับ userId ของผู้ใช้ที่กำลังล็อกอินอยู่
    await prisma.folder.create({
      data: {
        name: name.trim(),
        userId: req.user.id, // ได้มาจาก Passport Session (`req.user`)
      },
    });

    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

// ดูรายละเอียด Folder และไฟล์ข้างใน
const getFolderDetails = async (req, res, next) => {
  try {
    const folderId = parseInt(req.params.id);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true }, // ดึงไฟล์ที่อยู่ในโฟลเดอร์นี้มาด้วย
    });

    // ถ้าไม่พบโฟลเดอร์ หรือไม่ใช่เจ้าของโฟลเดอร์นั้น
    if (!folder || folder.userId !== req.user.id) {
      return res.status(404).render("404");
    }

    res.render("folder-details", { folder, files: folder.files });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFolder,
  getFolderDetails,
};