# 08. Chia việc để hoàn thành

Bảng chia việc đầy đủ nhất để hoàn thành project Quạ Đen. Chỉ nói code, không nói slide. Mỗi người có danh sách việc chi tiết, file làm, việc cần xong trước, lệnh chạy thử, và tiêu chí xong.

## Giai đoạn 1: trước 19/11, để nộp báo cáo tiến độ

Làm xong giai đoạn này là đủ 7 mục bắt buộc của thầy và 3 minh chứng thực hành.

### Ân, trưởng nhóm, giao diện

File: `frontend/index.html`, `frontend/auth.html`, `frontend/game.html`, `frontend/leaderboard.html`, `frontend/css/style.css`, `frontend/config.js`.

Việc làm:

1. Rà lại giao diện 4 trang: chữ có dấu đầy đủ, không lỗi console, nút nào bấm cũng có tác dụng.
2. Giữ id của các phần tử ổn định, ghi danh sách id ra `docs/07-huong-dan-lam-viec.md` nếu thêm id mới, để các bạn viết JS không bị lệch.
3. Sửa hình nền phòng B hành lang và phòng C sân thượng cho đúng cảnh, thay tranh phòng ngủ và bếp cũ.
4. Tổng hợp danh sách chức năng đã xong và chưa xong vào `docs/01-yeu-cau.md` và `docs/06-ke-hoach.md`, ghi đúng sự thật.
5. Review pull request của mọi người rồi merge vào `main`.

Chạy thử: `python3 -m http.server 8080` trong `frontend/`, mở `http://localhost:8080`.
Xong khi: 4 trang mở không lỗi, đủ id cho JS, danh sách xong và chưa xong đúng thực tế.

### Nam, trang chủ, đăng nhập, bảng xếp hạng

File: `frontend/js/auth.js`, `frontend/js/leaderboard.js`.

Việc làm:

1. Đăng nhập và đăng ký chạy thật qua API, đăng ký xong tự đăng nhập rồi chuyển vào game, đăng nhập sai báo rõ.
2. Bảng xếp hạng hiện đúng theo từng chương, bấm tab đổi chương, chế độ live tự tải lại mỗi 10 giây, có giờ cập nhật.
3. Sơ đồ kiến trúc Front-end, Back-end, Database vào `docs/02-kien-truc.md`, đúng đường chạy thật.
4. Chụp ảnh màn hình các trang chính từ bản giao diện của Ân, lưu vào `docs/`, ghi rõ trang nào.

Cần xong trước: Ân xong id trong HTML, Hoàng Anh xong endpoint login, register, leaderboard.
Chạy thử: `node --check frontend/js/auth.js frontend/js/leaderboard.js`, rồi mở trang đăng nhập và bảng xếp hạng bấm thử.
Xong khi: đăng ký và đăng nhập được thật, bảng xếp hạng đúng từng chương, sơ đồ và ảnh chụp khớp với code thật.

### Đình, demo Chương 1 và phòng

File: `frontend/game.html`, `frontend/js/game.js` (tách từ `game.html` khi cần), dữ liệu phòng trong `backend/db/seed.sql`.

Việc làm:

1. Demo Chương 1 chơi được: đi đủ 3 phòng Phòng trọ số 4, Hành lang và cầu thang, Sân thượng phơi đồ, nhân vật đi tới điểm bấm, nhặt được đồ.
2. Gắn đủ hotspot cho 4 câu đố chơi được 1.1, 1.2, 1.4, 1.8, đúng vị trí phòng.
3. Bổ sung hotspot xem cho 4 câu còn lại 1.3, 1.5, 1.6, 1.7, để người chơi xem được nội dung dù chưa giải được.
4. Ghi hình màn hình demo để nộp minh chứng.

Cần xong trước: Ân xong id trong HTML, Nghi xong dữ liệu câu đố.
Chạy thử: mở `game.html`, đi hết 3 phòng, bấm thử từng hotspot.
Xong khi: 3 phòng đi được, 4 câu đố giải được qua server, video demo quay được.

### Thư, vật phẩm và túi đồ

File: `frontend/js/api.js` phần inventory và pickup, giao diện túi đồ trong `frontend/game.html` (chỉ sửa phần JS, phần HTML báo Ân).

Việc làm:

1. Túi đồ hiện đúng đồ đã nhặt từ server, gọi action `inventory`.
2. Nhặt vật phẩm gọi action `pickup`, nhặt trùng thì tăng số lượng, không tạo dòng mới.
3. CRUD vật phẩm: thêm, xem, sửa, xóa vật phẩm, dữ liệu lưu thật trong Database.
4. Vật phẩm dùng được đúng chỗ: móc áo khều hộp thiếc, chìa đồng mở được đúng chỗ theo kịch bản.

Cần xong trước: Hoàng Anh xong endpoint inventory và pickup.
Chạy thử: `node --check frontend/js/api.js`, nhặt thử móc áo 2 lần rồi mở túi đồ kiểm tra số lượng.
Xong khi: thêm, xem, sửa, xóa đều chạy, túi đồ khớp với bảng TUI_DO trong Database.

### Nghi, câu đố và gợi ý

File: dữ liệu câu đố trong `backend/db/seed.sql`, JS giải đố trong `frontend/js/`.

Việc làm:

1. Hoàn thiện đáp án cho 4 câu Chương 1 còn thiếu: 1.3 ảnh gia đình, 1.5 cuộn băng, 1.6 tủ áo, 1.7 gương, ghi đúng vào `seed.sql`, không bịa đáp án ngoài kịch bản.
2. Gợi ý cho từng câu đố, gọi đúng manh mối trong bảng MANH_MOI, hiện khi người chơi bấm gợi ý.
3. Giải đố gọi action `solve`, đáp án đúng và sai đều báo đúng, đáp án có dấu và không dấu đều được chấp nhận.
4. Kiểm tra không lộ đáp án ra API: mở response của action `chapter` phải không có cột `dap_an`.

Cần xong trước: Đình xong phòng, Hoàng Anh xong endpoint solve.
Chạy thử: giải thử từng câu bằng đáp án đúng và đáp án sai, kiểm tra response không có `dap_an`.
Xong khi: 8 câu Chương 1 đều có đáp án và gợi ý, giải được qua server.

### Hoàng Anh, backend và Database

File: `backend/api/index.php`, `backend/config.php`, `backend/db/schema.sql`, `backend/db/seed.sql`.

Việc làm:

1. Giữ đủ 11 endpoint chạy được: register, login, logout, chapters, chapter, inventory, pickup, solve, save, load, leaderboard.
2. Kiểm thử đầu cuối trên XAMPP theo `docs/05-huong-dan-chay.md`, ghi lại kết quả test.
3. Chứng minh dữ liệu lưu thật: quay màn hình mở Workbench SELECT bảng NGUOI_CHOI, LUU_GAME, TUI_DO, BANG_XEP_HANG sau khi demo.
4. Giữ ERD đúng 11 bảng, không thêm bảng mới khi chưa có ý của Ân.

Chạy thử: `php -l backend/api/index.php backend/config.php`, import schema và seed, `php -S localhost:8000`, curl thử từng endpoint.
Xong khi: 11 endpoint đều trả đúng JSON, test đầu cuối pass, SELECT thấy dữ liệu thật.

## Thứ tự làm việc

1. Hoàng Anh làm backend trước, vì Thư và Nghi cần endpoint mới làm được JS.
2. Ân làm giao diện trước, vì Nam, Đình, Thư, Nghi cần id trong HTML mới viết JS.
3. Đình làm phòng trước, Nghi làm câu đố sau, vì câu đố gắn vào phòng.
4. Ai xong phần mình thì tạo pull request, Ân duyệt rồi merge, xem `docs/07-huong-dan-lam-viec.md`.
5. Hết ngày thì báo tiến độ cho Ân, để Ân cập nhật `docs/06-ke-hoach.md`.

## Quy tắc chung

- Mỗi người chỉ sửa file trong phần của mình, xem bảng ở `docs/07-huong-dan-lam-viec.md`.
- Việc nào chưa xong thì ghi đúng là chưa xong, không ghi đã xong.
- Dùng AI để code theo `docs/09-vibe-coding.md` và `AGENTS.md` ở gốc repo.
