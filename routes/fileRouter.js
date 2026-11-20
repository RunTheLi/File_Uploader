//routes/fileRouter.js

const { Router } = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");
const upload = require("../middleware/uploadMiddleware");

const fileRouter = Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/log-in");
};

const handleFileUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send("File too large. Maximum allowed size is 10 MB.");
    }

    if (err.code === "INVALID_FILE_TYPE") {
      return res.status(400).send(err.message);
    }

    return next(err);
  });
};

fileRouter.post("/upload", isAuthenticated, handleFileUpload, fileController.uploadFile);
fileRouter.get("/:id", isAuthenticated, fileController.getFileDetails);
fileRouter.get("/:id/download", isAuthenticated, fileController.downloadFile);
fileRouter.post("/:id/delete", isAuthenticated, fileController.deleteFile);

module.exports = fileRouter;