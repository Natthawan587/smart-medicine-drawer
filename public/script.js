let doctorName = "";

// login
function login() {
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.ok) {
      doctorName = d.name;
      localStorage.setItem("doctor", doctorName);
      location.href = "/order";
    } else {
      msg.innerText = "เข้าสู่ระบบไม่สำเร็จ";
    }
  });
}

// แสดงชื่อหมอหน้า order
if (location.pathname === "/order") {
  document.getElementById("doctorName").innerText =
    "แพทย์: " + localStorage.getItem("doctor");
}

// ส่งใบสั่งยา
function sendOrder() {
  const drugs = [];
  document.querySelectorAll(".drug").forEach(d => {
    const qty = d.querySelector("input").value;
    if (qty > 0) {
      const drugName = d.childNodes[0].textContent.trim();
      drugs.push({ drug: drugName, qty });
    }
  });

  const patient = document.getElementById("patient").value;
  const hn = document.getElementById("hn").value;

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
  .then(d => {
    alert("ส่งใบสั่งยาแล้ว");
  });
}

// ค้นหายาใน Order
function filterDrugs() {
  const query = document.getElementById("searchDrug").value.toLowerCase();
  document.querySelectorAll(".drug").forEach(d => {
    const name = d.childNodes[0].textContent.toLowerCase();
    d.style.display = name.includes(query) ? "block" : "none";
  });
}
