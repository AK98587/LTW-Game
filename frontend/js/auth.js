/* auth.js: form Đăng ký / Đăng nhập + trạng thái tài khoản trên thanh điều hướng.
   Dùng chung cho index.html, auth.html, leaderboard.html, game.html.
   Cần api.js (window.QD) được nạp trước. */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function showMsg(el, text, isError) {
    if (!el) return;
    el.textContent = text;
    el.classList.remove("hidden");
    el.classList.toggle("msg-error", !!isError);
    el.classList.toggle("msg-ok", !isError);
  }

  /* Cập nhật thanh điều hướng theo trạng thái đăng nhập.
     Các nút có id: navLogin, navRegister, navUser, navLogout, navPlay. */
  function updateAuthUI() {
    var loggedIn = window.QD && QD.isLoggedIn();
    var user = loggedIn ? QD.getUser() : "";
    ["navLogin", "navRegister"].forEach(function (id) {
      var el = $(id);
      if (el) el.classList.toggle("hidden", loggedIn);
    });
    var userEl = $("navUser");
    if (userEl) {
      userEl.classList.toggle("hidden", !loggedIn);
      if (loggedIn) userEl.textContent = "Xin chào, " + user;
    }
    var logoutEl = $("navLogout");
    if (logoutEl) logoutEl.classList.toggle("hidden", !loggedIn);
  }

  function bindLogout() {
    var btn = $("navLogout");
    if (btn) {
      btn.addEventListener("click", function () {
        QD.logout();
        updateAuthUI();
        if (window.location.pathname.indexOf("game.html") >= 0) {
          window.location.href = "index.html";
        }
      });
    }
  }

  function bindLoginForm() {
    var form = $("loginForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("loginName").value.trim();
      var pass = $("loginPass").value;
      var msg = $("loginMsg");
      var btn = form.querySelector("button[type=submit]");
      if (!name || !pass) { showMsg(msg, "Hãy nhập đầy đủ tên đăng nhập và mật khẩu.", true); return; }
      btn.disabled = true;
      btn.textContent = "Đang đăng nhập...";
      QD.login(name, pass).then(function () {
        showMsg(msg, "Đăng nhập thành công. Đang chuyển vào game...", false);
        setTimeout(function () { window.location.href = "game.html"; }, 700);
      }).catch(function (err) {
        showMsg(msg, err.message || "Đăng nhập thất bại. Kiểm tra lại tên và mật khẩu.", true);
        btn.disabled = false;
        btn.textContent = "Đăng nhập";
      });
    });
  }

  function bindRegisterForm() {
    var form = $("registerForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("regName").value.trim();
      var email = $("regEmail").value.trim();
      var pass = $("regPass").value;
      var pass2 = $("regPass2").value;
      var msg = $("regMsg");
      var btn = form.querySelector("button[type=submit]");
      if (!name || !email || !pass) { showMsg(msg, "Hãy nhập đầy đủ tên đăng nhập, email và mật khẩu.", true); return; }
      if (pass.length < 6) { showMsg(msg, "Mật khẩu cần ít nhất 6 ký tự.", true); return; }
      if (pass !== pass2) { showMsg(msg, "Hai lần nhập mật khẩu không khớp.", true); return; }
      btn.disabled = true;
      btn.textContent = "Đang tạo tài khoản...";
      QD.register(name, email, pass).then(function () {
        /* Đăng ký xong thì đăng nhập luôn cho tiện. */
        return QD.login(name, pass);
      }).then(function () {
        showMsg(msg, "Tạo tài khoản thành công. Đang chuyển vào game...", false);
        setTimeout(function () { window.location.href = "game.html"; }, 700);
      }).catch(function (err) {
        showMsg(msg, err.message || "Tạo tài khoản thất bại. Tên đăng nhập hoặc email có thể đã tồn tại.", true);
        btn.disabled = false;
        btn.textContent = "Tạo tài khoản";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateAuthUI();
    bindLogout();
    bindLoginForm();
    bindRegisterForm();
  });
})();
