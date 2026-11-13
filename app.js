// app.js
const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("passport");
prisma = require("./db/prisma"); // หากประกาศ prisma ไว้แล้ว หรือเรียกผ่านตัวแปรเดิม

// โหลด Passport Config
require("./config/passport");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const folderRouter = require("./routes/folderRouter");
const fileRouter = require("./routes/fileRouter");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ตั้งค่า Session ร่วมกับ Prisma Session Store
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 สัปดาห์
    },
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000, // ตรวจสอบและเคลียร์ session ที่หมดอายุทุกๆ 2 นาที
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    ),
  })
);

// เริ่มต้นใช้งาน Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware เพื่อส่งตัวแปร user ไปให้ทุกๆ ไฟล์ EJS ใช้งาน (เช่น เช็คว่าล็อกอินหรือยัง)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});