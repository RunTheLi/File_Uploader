//routes/shareRouter.js//
const { Router } = require("express");
const folderController = require("../controllers/folderController");

const shareRouter = Router();

// Route สาธารณะสำหรับเปิดลิงก์แชร์
shareRouter.get("/:token", folderController.getSharedFolder);

module.exports = shareRouter;