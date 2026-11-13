//controller/authController.js//
const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

// 1. Validation Rules สำหรับตอนสมัครสมาชิก
const validateSignUp = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long.")
    .custom(async (value) => {
      // ตรวจสอบว่า Username นี้มีคนใช้หรือยัง
      const existingUser = await prisma.user.findUnique({
        where: { username: value },
      });
      if (existingUser) {
        throw new Error("A user with this username already exists.");
      }
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password.");
      }
      return true;
    }),
];

// 2. แสดงหน้าฟอร์มสมัครสมาชิก
const getSignUp = (req, res) => {
  res.render("sign-up", { errors: [] });
};

// 3. จัดการข้อมูลเมื่อผู้ใช้กด Submit สมัครสมาชิก
const postSignUp = [
  validateSignUp,
  async (req, res, next) => {
    const errors = validationResult(req);
    
    // ถ้าข้อมูลไม่ผ่าน Validation ให้กลับไปหน้าเดิมพร้อมแสดง Error
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { errors: errors.array() });
    }

    try {
      // เข้ารหัส Password ด้วย bcrypt (Salt rounds = 10)
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // บันทึก User ลงใน PostgreSQL ผ่าน Prisma
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
        },
      });

      // สมัครเสร็จ พาไปหน้า Login
      res.redirect("/auth/log-in");
    } catch (err) {
      return next(err);
    }
  },
];

const getLogin = (req, res) => {
  res.render("log-in", { errorMessage: req.query.error });
};

// 5. จัดการระบบ Logout
const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogin,
  logoutUser,
};
