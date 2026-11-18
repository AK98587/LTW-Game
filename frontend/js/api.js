/* api.js: lớp gọi backend Quạ Đen (PHP + MySQL).
   Backend dùng session cookie PHP, KHÔNG dùng token.
   Mọi fetch đều kèm credentials: "include" để trình duyệt gửi cookie
   session. Trạng thái đăng nhập chỉ lưu cờ ở localStorage, không lưu token.
   Contract: <API_BASE>/index.php?action=<tên>
   - POST register, login, logout, pickup, solve, save, leaderboard
   - GET  chapters, chapter, load, inventory, leaderboard
   Mọi trả lời đều là JSON dạng { ok: true, data: ... }
   hoặc { ok: false, error: "..." }. */
(function () {
  "use strict";

  var BASE = (window.QUA_DEN_API_BASE || "http://localhost:8000/backend/api").replace(/\/+$/, "");
  var FLAG = "qd_logged_in";
  var USER_KEY = "qd_user";

  function isLoggedIn() {
    try { return localStorage.getItem(FLAG) === "1"; } catch (e) { return false; }
  }
  function getUser() {
    try { return localStorage.getItem(USER_KEY) || ""; } catch (e) { return ""; }
  }
  function markLoggedIn(username) {
    try {
      localStorage.setItem(FLAG, "1");
      if (username) localStorage.setItem(USER_KEY, username);
    } catch (e) { /* bỏ qua khi trình duyệt chặn localStorage */ }
  }
  function markLoggedOut() {
    try {
      localStorage.removeItem(FLAG);
      localStorage.removeItem(USER_KEY);
    } catch (e) { /* bỏ qua */ }
  }

  function buildUrl(action, params) {
    var url = BASE + "/index.php?action=" + encodeURIComponent(action);
    if (params) {
      Object.keys(params).forEach(function (k) {
        if (params[k] === undefined || params[k] === null) return;
        url += "&" + encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      });
    }
    return url;
  }

  /* Gọi API. Trả về JSON đã parse (cả envelope { ok, data }).
     Lỗi mạng (backend chưa chạy) ném lỗi có thông điệp rõ ràng. */
  function api(action, options) {
    options = options || {};
    var method = (options.method || "GET").toUpperCase();
    var url = buildUrl(action, options.params);
    var headers = { "Accept": "application/json" };
    var fetchOptions = { method: method, headers: headers, credentials: "include" };
    if (method !== "GET") {
      headers["Content-Type"] = "application/json";
      if (options.body !== undefined) fetchOptions.body = JSON.stringify(options.body);
    }
    return fetch(url, fetchOptions).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
        if (!res.ok) {
          var msg = (data && (data.error || data.message)) || ("Lỗi " + res.status + " từ máy chủ.");
          var err = new Error(msg);
          err.status = res.status;
          err.data = data;
          throw err;
        }
        return data;
      });
    }).catch(function (err) {
      if (err && err.name === "TypeError") {
        throw new Error("Không kết nối được máy chủ (" + BASE + "). Hãy chắc backend đang chạy.");
      }
      throw err;
    });
  }

  function unwrap(res) {
    if (res && res.data !== undefined) return res.data;
    return res;
  }

  function register(tenDangNhap, email, matKhau) {
    return api("register", {
      method: "POST",
      body: { ten_dang_nhap: tenDangNhap, email: email, mat_khau: matKhau }
    });
  }
  function login(tenDangNhap, matKhau) {
    return api("login", {
      method: "POST",
      body: { ten_dang_nhap: tenDangNhap, mat_khau: matKhau }
    }).then(function (res) {
      var payload = unwrap(res) || {};
      markLoggedIn(payload.ten_dang_nhap || tenDangNhap);
      return res;
    });
  }
  function logout() {
    markLoggedOut();
    return api("logout", { method: "POST" }).catch(function () { return null; });
  }

  function saveGame(payload) {
    return api("save", { method: "POST", body: payload });
  }
  /* Backend load chỉ đọc ma_luu, không đọc ma_chuong.
     Không truyền gì thì lấy bản lưu mới nhất của người chơi. */
  function loadGame(maLuu) {
    var params = {};
    if (maLuu) params.ma_luu = maLuu;
    return api("load", { params: params });
  }
  function getInventory() {
    return api("inventory", {});
  }
  function pickup(maVatPham) {
    return api("pickup", { method: "POST", body: { ma_vat_pham: maVatPham } });
  }
  function solve(maCauDo, dapAn, maLuu) {
    var body = { ma_cau_do: maCauDo, dap_an: dapAn };
    if (maLuu) body.ma_luu = maLuu;
    return api("solve", { method: "POST", body: body });
  }
  function getChapter(maChuong) {
    return api("chapter", { params: { ma_chuong: maChuong } });
  }
  function getLeaderboard(maChuong) {
    return api("leaderboard", { params: { ma_chuong: maChuong } });
  }
  function postLeaderboard(maChuong, thoiGianHoanThanh) {
    return api("leaderboard", {
      method: "POST",
      body: { ma_chuong: maChuong, thoi_gian_hoan_thanh: thoiGianHoanThanh }
    });
  }
  function getChapters() {
    return api("chapters", {});
  }

  window.QD = {
    BASE: BASE,
    api: api,
    unwrap: unwrap,
    buildUrl: buildUrl,
    getUser: getUser,
    isLoggedIn: isLoggedIn,
    register: register,
    login: login,
    logout: logout,
    saveGame: saveGame,
    loadGame: loadGame,
    getInventory: getInventory,
    pickup: pickup,
    solve: solve,
    getChapter: getChapter,
    getLeaderboard: getLeaderboard,
    postLeaderboard: postLeaderboard,
    getChapters: getChapters
  };
})();
