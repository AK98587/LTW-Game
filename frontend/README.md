# Frontend game Quạ Đen, Sáu Vụ Án Sài Gòn 1998

Frontend thuần HTML, CSS, JavaScript, không framework, không build step.
Nhóm 5, môn Lập trình Web.

## Chạy thử

1. Chạy backend PHP + MySQL (thư mục `backend/`), mặc định ở `http://localhost:8000`.
   Nếu backend chạy ở địa chỉ khác, sửa `API_BASE_URL` trong `config.js`.
2. Mở `frontend/index.html` bằng trình duyệt, hoặc chạy server tĩnh:
   `python3 -m http.server 8080` trong thư mục `frontend/`, rồi mở `http://localhost:8080`.

## Các trang

- `index.html`: trang chủ, giới thiệu cốt truyện, danh sách 6 chương (lấy từ API `chapters`),
  bảng xếp hạng top 5 Chương 1 (lấy từ API `leaderboard`).
- `auth.html`: đăng nhập và đăng ký. Đăng ký xong tự đăng nhập rồi chuyển vào game.
- `game.html`: game Chương 1 chơi được, chuyển thể từ bản demo gốc. Có nút Lưu game,
  Tải game, túi đồ đồng bộ với máy chủ. Chơi khách vẫn được nhưng không lưu.
- `leaderboard.html`: bảng xếp hạng theo từng chương, bấm tab để đổi chương.

## API backend

Mọi lệnh gọi đi qua `js/api.js` (biến toàn cục `window.QD`):

- `POST /api/index.php?action=register` (tên đăng nhập, email, mật khẩu)
- `POST /api/index.php?action=login` (trả về token, lưu ở localStorage)
- `POST /api/index.php?action=save` (mã chương, mã phòng, trạng thái JSON, thời gian chơi,
  số gợi ý, đã hoàn thành)
- `GET /api/index.php?action=load&ma_chuong=1`
- `GET /api/index.php?action=inventory`
- `GET /api/index.php?action=leaderboard&ma_chuong=<số>`
- `GET /api/index.php?action=chapters`

Khi backend chưa chạy, các trang vẫn mở được và hiện rõ thông báo lỗi kết nối,
không có nút nào chết: mọi nút bấm đều có tác dụng thật (chuyển trang, mở modal,
gọi API, hoặc báo lỗi rõ ràng).
