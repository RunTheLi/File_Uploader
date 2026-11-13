//routes/indexRouter.js//
const { Router } = require("express");
const prisma = require("../db/prisma");

const indexRouter = Router();

indexRouter.get("/", async (req, res, next) => {
  try {
    let folders = [];
    // ถ้าผู้ใช้ล็อกอินแล้ว ให้ดึงเฉพาะโฟลเดอร์ของ User คนนั้น
    if (req.user) {
      folders = await prisma.folder.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      });
    }
    res.render("index", { folders });
  } catch (err) {
    next(err);
  }
});

module.exports = indexRouter;