let doctorName = "";

// LOGIN
function login() {
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user.value, password: pass.value })
  })
  .then(r => r.json())
  .then(d => {
    if (d.ok) {
      localStorage.setItem("doctor", d.name);
      location.href = "/order";
    } else {
      msg.innerText = "เข้าสู่ระบบไม่สำเร็จ";
    }
  });
}

// แสดงชื่อหมอหน้า order
if (document.getElementById("doctorName")) {
  document.getElementById("doctorName").innerText =
    "แพทย์: " + localStorage.getItem("doctor");
}

// ส่งใบสั่งยา
function sendOrder() {
  const drugs = [];
  document.querySelectorAll(".drug").forEach(d => {
    const qty = d.querySelector("input").value;
    if (qty > 0) {
      drugs.push({ drug: d.firstChild.textContent.trim(), qty });
    }
  });

  const patient = document.getElementById("patientInput").value;
  const hn = document.getElementById("hnInput").value;

  if (!patient || !hn) {
    alert("กรุณากรอกชื่อผู้ป่วยและ HN");
    return;
  }

  fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patient, hn, drugs })
  })
  .then(r => r.json())
  .then(() => alert("ส่งใบสั่งยาแล้ว"));
}

// ค้นหายาใน Order
function filterDrugs() {
  const query = document.getElementById("searchDrug").value.toLowerCase();
  document.querySelectorAll(".drug").forEach(d => {
    const name = d.firstChild.textContent.toLowerCase();
    d.style.display = name.includes(query) ? "block" : "none";
  });
}


