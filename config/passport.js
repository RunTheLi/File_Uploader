//config/passport.js//
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("../db/prisma");
const bcrypt = require("bcrypt");

// ตั้งค่า Local Strategy สำหรับการล็อกอิน
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // ค้นหา User จาก username
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      // ตรวจสอบรหัสผ่านว่าตรงกับที่ Hash ไว้หรือไม่
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// เก็บ userID ไว้ใน Session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ดึงข้อมูล User จาก ID ที่เก็บใน Session เมื่อมีการรีเฟรชหรือเปลี่ยนหน้า
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});