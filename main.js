let rawData = []
let headers = []

function formatDate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');  // Tháng (01-12)
  const dd = String(d.getDate()).padStart(2, '0');       // Ngày (01-31)
  const yyyy = d.getFullYear();                           // Năm (yyyy)

  // Trả về ngày theo định dạng dd-mm-yyyy
  return `${dd}/${mm}/${yyyy}`;
}
fetch("./diem.xlsx")
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const arr = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

    if (arr.length > 0) {
      headers = arr[0];
      rawData = arr.slice(1)
        .map(row => {
          const obj = {};
          headers.forEach((h, idx) => {
            let v = row[idx];

            if (v instanceof Date) {
              v = formatDate(v); // Sử dụng hàm formatDate để chuyển đổi ngày
            } else if (typeof v === "string") {
              const parts = v.split("-");
              // Kiểm tra nếu chuỗi ngày là mm-dd-yyyy
              if (parts.length === 3 && parts[0].length === 2) {
                const [m, d, y] = parts;
                v = `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
              }
            }

            obj[h] = v;
          });
          return obj;
        });
    }
  })
  .catch(err => {
    document.getElementById("output").innerHTML =
      `<p style="color:red">${err}</p>`;
  });

document.getElementById("btn-search").addEventListener("click", () => {
  const nameInput = document.getElementById("input-name").value.trim().toLowerCase();
  const dobRaw = document.getElementById("input-dob").value;

  if (!nameInput || !dobRaw) {
    document.getElementById("output").innerHTML =
      '<p style="color:red">Vui lòng nhập đầy đủ thông tin</p>';
    return;
  }

  // Định dạng lại ngày sinh từ mm-dd-yyyy sang dd-mm-yyyy
  const [yy, mm, dd] = dobRaw.split("-");
  const dob = `${dd}/${mm}/${yy}`;  // Đảm bảo ngày là dd-mm-yyyy

  console.log("Name:", nameInput);
  console.log("DOB:", dob)

  console.log(rawData)

  const result = rawData.filter(item =>
    String(item["Họ và tên"] || "").trim().toLowerCase() === nameInput &&
    String(item["Ngày tháng năm sinh"] || "") === dob  // So sánh ngày đúng format
  );


  if (result.length === 0) {
    document.getElementById("output").innerHTML =
      '<p style="color:red">Không tìm thấy thông tin</p>';
    return;
  } else {
    renderTable(result);
  }
});

function renderTable(data) {
  const cols = [ // Đây là các header sẽ được dùng làm data-label
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