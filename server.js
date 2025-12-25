const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Mock doctor
const doctors = [
  { username: "doctor", password: "1234", name: "นพ.สมชาย" }
];

// Session ง่าย ๆ
let currentDoctor = null;

// ประวัติยาเก็บตาม HN
let history = {};

// หน้า login
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));

// login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const doc = doctors.find(d => d.username === username && d.password === password);
  if (doc) {
    currentDoctor = doc;
    res.json({ ok: true, name: doc.name });
  } else res.status(401).json({ ok: false });
});

// หน้า order
app.get("/order", (req, res) => {
  if (!currentDoctor) return res.redirect("/");
  res.sendFile(path.join(__dirname, "public", "order.html"));
});

// หน้า history
app.get("/history", (req, res) => {
  if (!currentDoctor) return res.redirect("/");
  res.sendFile(path.join(__dirname, "public", "history.html"));
});

// รับใบสั่งยา + เก็บประวัติ
app.post("/order", (req, res) => {
  if (!currentDoctor) return res.status(403).json({ error: "not login" });
  const { patient, hn, drugs } = req.body;
  if (!history[hn]) history[hn] = [];
  history[hn].push(...drugs.map(d => ({
    ...d,
    date: new Date().toLocaleString(),
    doctor: currentDoctor.name
  })));
  res.json({ ok: true });
});

// ดึงประวัติยา
app.get("/history/:hn", (req, res) => {
  const hn = req.params.hn;
  res.json({ history: history[hn] || [] });
});

// ใช้ process.env.PORT สำหรับ Cloud deployment, default 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
  console.log(`For LAN access, use your computer IP + port ${PORT}`);
});
