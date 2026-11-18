# AGENTS.md

File hướng dẫn cho AI agent làm việc trong repo LTW-Game. Mọi agent (của Ân hay của thành viên nào trong nhóm) đều phải đọc file này trước khi sửa code.

## Project

- Game Quạ Đen, Sáu Vụ Án Sài Gòn 1998, point and click giải đố, phong cách Rusty Lake.
- Front-end: HTML, CSS, JavaScript thuần, không framework, không build step.
- Back-end: PHP thuần, PDO, MySQL. Không framework, không thư viện ngoài.
- Database `qua_den`: 11 bảng, 16 khóa ngoại, xem `backend/db/schema.sql` và `docs/03-csdl.md`.
- Tài liệu đầy đủ trong `docs/`, đọc đúng file mình cần trước khi làm, xem `README.md`.

## Cách làm việc

- Hiểu trước rồi mới viết: đọc docs, đọc file cần sửa, rồi mới sửa.
- Thay đổi nhỏ, đúng việc được giao, không sửa lan sang file khác.
- Chạy kiểm tra rồi mới báo xong, không nói xong khi chưa chạy thử.
- Viết xong thì tự review lại diff một lượt trước khi dừng.
- Commit nhỏ, mỗi commit 1 việc, message tiếng Việt không dấu, bắt đầu bằng `feat`, `fix`, `docs`.

## Tuyệt đối không làm

- Không push thẳng lên `main`, không force push.
- Không sửa file của người khác khi chưa được giao. Bảng chia file xem ở `docs/07-huong-dan-lam-viec.md` và `docs/08-chia-viec-hoan-thanh.md`.
- Không thêm bảng Database mới khi chưa có ý của Ân. ERD đã chốt 11 bảng.
- Không bịa câu đố, đáp án, số liệu cốt truyện. Mọi nội dung game lấy từ kịch bản và `backend/db/seed.sql`.
- Không để lộ cột `dap_an` của bảng CAU_DO ra API hay ra frontend. Đáp án chỉ đối chiếu ở phía server trong action `solve`.
- Không commit file `.env`, mật khẩu, hay dữ liệu test.
- Không dùng ký tự em dash trong chữ hiển thị ra ngoài.
- Không viết code chết, không để TODO trong code nộp.

## Quy ước kỹ thuật

- API: 1 file `backend/api/index.php`, gọi bằng `?action=<tên>`, trả JSON `{ "ok": true, "data": ... }` hoặc `{ "ok": false, "error": "..." }`. Danh sách action xem `docs/04-api.md`.
- Đăng nhập dùng session cookie PHP. Mọi fetch phải kèm `credentials: "include"`. Không dùng token.
- Base URL local: `http://localhost:8000/backend/api`, chạy `php -S localhost:8000` từ thư mục gốc project.
- Mọi câu SQL dùng prepared statement, không nối chuỗi vào SQL.
- Front-end: Ân làm HTML và CSS, giữ id ổn định. JS chỉ gọi đúng id đã có, không sửa HTML và CSS, không đổi cấu trúc DOM. Mọi lệnh gọi API đi qua `frontend/js/api.js`.
- Mật khẩu lưu bằng `password_hash`, đối chiếu bằng `password_verify`.

## Kiểm tra trước khi báo xong

- Sửa PHP: chạy `php -l` cho từng file, phải pass.
- Sửa JS: chạy `node --check` cho từng file, phải pass.
- Chạy thử local: import Database `backend/db/schema.sql` và `backend/db/seed.sql` (1 lần trên Database mới), chạy `php -S localhost:8000` từ gốc project, mở frontend bấm thử đúng phần mình làm.
- Kiểm tra không lỗi console, không nút chết, không lộ `dap_an` trong response.
- Đọc lại diff, chỉ có file trong phần của mình.

## Khi không chắc

- Không đoán. Dừng lại, ghi rõ chỗ chưa chắc và hỏi Ân, đừng tự bịa rồi nộp.
- Nội dung cốt truyện, tên chương, tên phòng, số cân, mã két: đối chiếu với kịch bản và `docs/03-csdl.md`, sai một chữ cũng phải hỏi lại.
