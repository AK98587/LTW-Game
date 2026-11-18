# 09. Vibe coding, dùng AI để code trong nhóm

Hướng dẫn để thành viên trong nhóm dùng AI viết code cho nhanh mà vẫn đúng, vẫn không xung đột nhau. Đọc cùng với `AGENTS.md` ở gốc repo và `docs/07-huong-dan-lam-viec.md`.

## Vibe coding là gì trong project này

- Bạn mô tả việc cần làm, AI viết code, bạn đọc lại, chạy thử, rồi mới nộp.
- AI không thay bạn hiểu bài. Bạn phải đọc code AI viết ra và chạy thử được thì mới tạo pull request.
- Mỗi người chỉ dùng AI làm phần của mình, theo bảng chia file ở `docs/08-chia-viec-hoan-thanh.md`.

## Trước khi nhờ AI

1. Đọc `AGENTS.md` ở gốc repo và `docs/08-chia-viec-hoan-thanh.md` phần của mình.
2. Mở file mình sẽ sửa, đọc qua để biết nó đang có gì.
3. Chuẩn bị sẵn: tên file, việc cần làm, tiêu chí xong.

## Mẫu prompt copy paste

Dán đúng mẫu này vào AI, thay phần trong ngoặc thành việc của bạn:

```
Bạn là AI viết code cho project game Quạ Đen, Nhóm 5, môn Lập trình Web.
Đọc kỹ AGENTS.md ở gốc repo và docs/08-chia-viec-hoan-thanh.md trước khi làm.

Việc của tôi: (ghi rõ việc, ví dụ: làm JS đăng nhập gọi API login)
File tôi được sửa: (ghi rõ file, ví dụ: frontend/js/auth.js)
File tôi không được sửa: (ghi rõ, ví dụ: mọi file HTML, CSS, backend)

Quy tắc:
- Chỉ sửa file trong phần của tôi, không sửa file người khác.
- API dùng session cookie, mọi fetch kèm credentials: "include", không dùng token.
- Base URL: http://localhost:8000/backend/api.
- Mọi câu SQL dùng prepared statement. Không lộ cột dap_an ra API.
- Không bịa nội dung cốt truyện, chỉ dùng dữ liệu trong backend/db/seed.sql.
- Không dùng ký tự em dash trong chữ hiển thị.
- Sau khi viết xong, chạy php -l nếu sửa PHP, node --check nếu sửa JS, và ghi rõ đã test gì.
```

## Prompt mẫu cho từng người

- Ân, giao diện: `Việc của tôi: rà lại giao diện 4 trang, sửa hình nền phòng B và C cho đúng cảnh hành lang và sân thượng. File tôi được sửa: frontend/*.html, frontend/css/style.css.`
- Nam, đăng nhập và bảng xếp hạng: `Việc của tôi: làm JS đăng nhập, đăng ký và bảng xếp hạng live tự tải lại mỗi 10 giây. File tôi được sửa: frontend/js/auth.js, frontend/js/leaderboard.js.`
- Đình, demo Chương 1: `Việc của tôi: làm game Chương 1 đi đủ 3 phòng, gắn hotspot cho 4 câu đố 1.1, 1.2, 1.4, 1.8. File tôi được sửa: frontend/js/game.js, dữ liệu phòng trong backend/db/seed.sql.`
- Thư, túi đồ: `Việc của tôi: làm túi đồ gọi API inventory và pickup, thêm, xem, sửa, xóa vật phẩm. File tôi được sửa: frontend/js/api.js phần inventory và pickup.`
- Nghi, câu đố: `Việc của tôi: bổ sung đáp án cho câu 1.3, 1.5, 1.6, 1.7 và gợi ý từng câu. File tôi được sửa: backend/db/seed.sql khối Chương 1, JS giải đố.`
- Hoàng Anh, backend: `Việc của tôi: giữ đủ 11 endpoint và kiểm thử đầu cuối trên XAMPP. File tôi được sửa: backend/api/index.php, backend/config.php.`

## Sau khi AI viết xong

1. Đọc lại từng dòng AI sửa, hỏi lại AI chỗ nào bạn không hiểu.
2. Chạy kiểm tra: `php -l` cho file PHP, `node --check` cho file JS.
3. Chạy thử local theo `docs/05-huong-dan-chay.md`, bấm thử đúng phần mình làm.
4. Chạy `git diff` xem lại, chỉ có file trong phần của mình thì mới commit.
5. Tạo pull request, ghi rõ đã test gì, để Ân review.

## Lỗi thường gặp khi dùng AI

- AI tự bịa API mới không có trong backend: bắt AI đọc `docs/04-api.md` trước, chỉ dùng action đã có.
- AI tự đổi id trong HTML: nhắc AI chỉ viết JS, không sửa HTML và CSS, id nào thiếu thì báo Ân thêm.
- AI viết đáp án ra frontend: cấm, đáp án chỉ đối chiếu ở server trong action `solve`.
- AI làm hộ phần người khác: nhắc AI chỉ sửa file trong phần của bạn.
- AI nói xong nhưng chưa chạy thử: bắt AI chạy `php -l` và `node --check` rồi mới tin.
- AI thêm bảng Database mới: cấm, ERD đã chốt 11 bảng, thêm bảng phải hỏi Ân trước.
