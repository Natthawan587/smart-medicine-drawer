document.getElementById("doctorName").innerText =
  "แพทย์: " + localStorage.getItem("doctor");

function loadHistory() {
  const hn = document.getElementById("hn").value;
  if (!hn) return alert("กรุณากรอก HN");

  fetch(`/history/${hn}`)
    .then(r => r.json())
    .then(d => updateHistoryCards(d.history));
}

function updateHistoryCards(history) {
  const container = document.getElementById("historyContainer");
  container.innerHTML = "";

  if (history.length === 0) {
    container.innerHTML = "<p>ยังไม่มีประวัติการจ่ายยา</p>";
    return;
  }

  history.forEach(item => {
    const card = document.createElement("div");
    card.className = "history-card";
    card.innerHTML = `
      <span><strong>ยา:</strong> ${item.drug}</span>
      <span><strong>จำนวน:</strong> ${item.qty}</span>
      <span><strong>วันที่:</strong> ${item.date}</span>
      <span><strong>หมอ:</strong> ${item.doctor}</span>
    `;
    container.appendChild(card);
  });
}

// ค้นหาใน History
function filterHistory() {
  const query = document.getElementById("searchHistory").value.toLowerCase();
  document.querySelectorAll(".history-card").forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(query) ? "flex" : "none";
  });
}
