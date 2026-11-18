/* leaderboard.js: bảng xếp hạng theo từng chương.
   GET /api/index.php?action=leaderboard&ma_chuong=<số>
   Cần api.js (window.QD) được nạp trước. */
(function () {
  "use strict";

  var CHAPTERS = [
    { ma: 1, ten: "Chương 1: Căn phòng khóa trái ở hẻm 41" },
    { ma: 2, ten: "Chương 2: Buổi chiếu cuối ở rạp Lệ Thanh" },
    { ma: 3, ten: "Chương 3: Tiệm radio Chính Phát ở Nhật Tảo" },
    { ma: 4, ten: "Chương 4: Chuyến xe đò lúc nửa đêm" },
    { ma: 5, ten: "Chương 5: Nhà thuốc An Bình và lọ thuốc không nhãn" },
    { ma: 6, ten: "Chương 6: Nhà in Mực Tím trong đêm cuối" }
  ];

  function fmtTime(value) {
    if (value === null || value === undefined || value === "") return "-";
    var s = parseInt(value, 10);
    if (isNaN(s)) return String(value);
    return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
  }
  function fmtDate(value) {
    if (!value) return "-";
    var d = new Date(String(value).replace(" ", "T"));
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }

  function renderRows(rows) {
    var body = document.getElementById("lbBody");
    var empty = document.getElementById("lbEmpty");
    if (!body) return;
    body.innerHTML = "";
    if (!rows || rows.length === 0) {
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");
    rows.forEach(function (row, i) {
      var tr = document.createElement("tr");
      var ten = row.ten_dang_nhap || row.ten || row.nguoi_choi || "Người chơi ẩn danh";
      var thoiGian = row.thoi_gian_hoan_thanh !== undefined ? row.thoi_gian_hoan_thanh : row.thoi_gian;
      var ngay = row.ngay_hoan_thanh || row.ngay_tao || row.created_at;
      var soGoiY = row.so_goi_y_da_dung !== undefined ? row.so_goi_y_da_dung : (row.so_goi_y || "-");
      tr.innerHTML =
        "<td>" + (i + 1) + "</td>" +
        "<td>" + escapeHtml(ten) + "</td>" +
        "<td>" + fmtTime(thoiGian) + "</td>" +
        "<td>" + escapeHtml(String(soGoiY)) + "</td>" +
        "<td>" + escapeHtml(fmtDate(ngay)) + "</td>";
      body.appendChild(tr);
    });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function loadChapter(maChuong) {
    var status = document.getElementById("lbStatus");
    var title = document.getElementById("lbChapterTitle");
    var ch = CHAPTERS.filter(function (c) { return c.ma === maChuong; })[0];
    if (title && ch) title.textContent = ch.ten;
    document.querySelectorAll(".lb-tab").forEach(function (b) {
      b.classList.toggle("active", parseInt(b.getAttribute("data-chuong"), 10) === maChuong);
    });
    if (status) { status.textContent = "Đang tải bảng xếp hạng..."; status.classList.remove("hidden"); }
    QD.getLeaderboard(maChuong).then(function (data) {
      var rows = (data && (data.rows || data.bang_xep_hang || data.data)) || [];
      if (status) status.classList.add("hidden");
      renderRows(rows);
    }).catch(function (err) {
      if (status) {
        status.textContent = "Chưa tải được bảng xếp hạng: " + (err.message || "lỗi kết nối") + ". Chương này có thể chưa có ai hoàn thành.";
        status.classList.remove("hidden");
      }
      renderRows([]);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lb-tab").forEach(function (b) {
      b.addEventListener("click", function () {
        loadChapter(parseInt(b.getAttribute("data-chuong"), 10));
      });
    });
    loadChapter(1);
  });
})();
