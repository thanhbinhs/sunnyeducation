let rawData = [];
let headers = [
  "Họ và tên",
  "Giới tính",
  "Ngày tháng năm sinh",
  "Lớp",
  "Điểm Toán",
  "Điểm Anh",
  "Tổng điểm",
  "Ghi chú"
];

// Load file JSON nhưng không hiển thị bảng ngay
fetch("./diem.json")
  .then(res => res.json())
  .then(data => {
    rawData = data;
    // Không gọi renderTable ở đây nữa để ẩn dữ liệu ban đầu
  })
  .catch(err => {
    document.getElementById("output").innerHTML =
      `<p style="color:red">${err}</p>`;
  });

// Xử lý sự kiện tìm kiếm
document.getElementById("btn-search").addEventListener("click", () => {
  const nameInput = document.getElementById("input-name").value.trim().toLowerCase();
  const dobRaw = document.getElementById("input-dob").value;

  if (!nameInput || !dobRaw) {
    document.getElementById("output").innerHTML =
      '<p style="color:red">Vui lòng nhập đầy đủ thông tin</p>';
    return;
  }

  const dobParts = dobRaw.split("-");
  let dob = "";
  if (dobParts.length === 3) {
    dob = `${dobParts[2].padStart(2, "0")}/${dobParts[1].padStart(2, "0")}/${dobParts[0]}`;
  } else {
    dob = dobRaw;
  }

  const result = rawData.filter(item =>
    String(item["Họ và tên"] || "").trim().toLowerCase() === nameInput &&
    String(item["Ngày tháng năm sinh"] || "") === dob
  );

  if (result.length === 0) {
    document.getElementById("output").innerHTML =
      '<p style="color:red">Không tìm thấy thông tin</p>';
  } else {
    renderTable(result);
  }
});

// Hàm render bảng giữ nguyên
function renderTable(data) {
  const cols = [
    "Họ và tên",
    "Giới tính",
    "Ngày tháng năm sinh",
    "Lớp",
    "Điểm Toán",
    "Điểm Anh",
    "Tổng điểm",
    "Ghi chú"
  ];

  let html = `<table><thead><tr>${
    cols.map(c => `<th>${c}</th>`).join("")
  }</tr></thead><tbody>`;

  data.forEach(item => {
    html += "<tr>";
    cols.forEach(c => {
      html += `<td>${item[c] ?? ""}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  document.getElementById("output").innerHTML = html;
}
