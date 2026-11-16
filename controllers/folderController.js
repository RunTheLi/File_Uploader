//controllers/folderController.js//
const prisma = require("../db/prisma");
const crypto = require("crypto");

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

// ลบ Folder (และไฟล์ข้างในถ้าต้องการ หรือให้ระบบจัดการตาม Prisma Schema)
const deleteFolder = async (req, res, next) => {
  try {
    const folderId = parseInt(req.params.id);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(404).render("404");
    }

    // (ทางเลือก) ลบไฟล์จริงในเครื่องที่อยู่ในโฟลเดอร์นี้ด้วย
    for (const file of folder.files) {
      const filePath = path.join(__dirname, "../public/uploads", file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // ลบ Folder ออกจาก Database (เนื่องจากตั้งค่า onDelete ไว้ ข้อมูลที่เกี่ยวข้องจะถูกจัดการอัตโนมัติ)
    await prisma.folder.delete({
      where: { id: folderId },
    });

    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

const shareFolder = async (req, res, next) => {
  try {
    const folderId = parseInt(req.params.id);
    const { duration } = req.body; // รับค่าจำนวนวัน เช่น "1", "7", "30"

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(404).render("404");
    }

    // สร้าง Token สุ่มด้วย crypto (UUID)
    const token = crypto.randomUUID();
    const days = parseInt(duration) || 1;
    
    // คำนวณวันหมดอายุ
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // บันทึกลง Database
    await prisma.folder.update({
      where: { id: folderId },
      data: {
        shareToken: token,
        shareExpiresAt: expiresAt,
      },
    });

    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    next(err);
  }
};

// 5. ดู Folder ผ่านลิงก์แชร์สาธารณะ (สำหรับ Unauthenticated users)
const getSharedFolder = async (req, res, next) => {
  try {
    const { token } = req.params;

    const folder = await prisma.folder.findUnique({
      where: { shareToken: token },
      include: { files: true, user: true },
    });

    // ถ้าไม่พบโฟลเดอร์ หรือไม่มี Token นี้ หรือหมดอายุแล้ว
    if (!folder || !folder.shareExpiresAt || folder.shareExpiresAt < new Date()) {
      return res.status(404).render("404");
    }

    res.render("shared-folder", { folder, files: folder.files });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFolder,
  getFolderDetails,
  deleteFolder,
  shareFolder,
  getSharedFolder
};