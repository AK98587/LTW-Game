# 02. Kiến trúc

## 2.1. Sơ đồ tổng thể

```text
Trình duyệt (Front-end)
  HTML, CSS, JavaScript thuần
        |
        | HTTP, JSON, GET và POST
        v
Back-end (PHP API)
  api/index.php, config.php
        |
        | SQL, prepared statement, PDO
        v
Cơ sở dữ liệu (MySQL 8.0)
  Database qua_den, 11 bảng, 16 khóa ngoại
```

- Front-end không nói chuyện trực tiếp với database
- Mọi dữ liệu đi qua back-end, back-end kiểm tra rồi mới chạm database
- Back-end trả về JSON cho mọi request, không trả HTML

## 2.2. Thành phần

### Front-end (`frontend/`)

- `index.html`: khung trang game, màn hình đăng nhập, đăng ký, danh sách chương, màn chơi, túi đồ, bảng xếp hạng
- `css/`: giao diện game, phong cách tối, Sài Gòn 1998, màu vàng đồng và mực tím
- `js/`:
  - `api.js`: gọi API bằng fetch, xử lý JSON trả về
  - `game.js`: logic màn chơi, di chuyển giữa các phòng, nhặt đồ, giải câu đố
  - `auth.js`: đăng ký, đăng nhập, đăng xuất, giữ phiên
- `assets/`: ảnh phòng, ảnh đồ vật, ảnh trang sổ

### Back-end (`backend/`)

- `api/index.php`: 1 file điều phối, nhận tham số `action`, gọi hàm xử lý tương ứng, trả JSON
- `config.php`: thông tin kết nối database (host, dbname, user, password), tạo đối tượng PDO
- `sql/qua_den.sql`: file tạo database, 11 bảng, dữ liệu mẫu 6 chương, 3 phòng chương 1, 8 câu đố chương 1

### Cơ sở dữ liệu (`qua_den`)

- 11 bảng, xem chi tiết ở [03-csdl.md](03-csdl.md)
- Bảng mã utf8mb4, đối chiếu utf8mb4_unicode_ci
- Khóa chính INT tự tăng, khóa ngoại INT chép lại giá trị

## 2.3. Luồng request

- Front-end gửi request bằng fetch tới `backend/api/index.php?action=<tên hành động>`
- GET dùng cho các hành động chỉ đọc: lấy danh sách chương, lấy túi đồ, lấy bảng xếp hạng
- POST dùng cho các hành động ghi dữ liệu: đăng ký, đăng nhập, lưu game, giải câu đố
- POST gửi body dạng JSON, header `Content-Type: application/json`
- Back-end đọc `action`, kiểm tra tham số bắt buộc, chạy câu SQL bằng prepared statement, trả JSON
- Dạng response thành công:

```json
{
  "success": true,
  "data": {}
}
```

- Dạng response lỗi:

```json
{
  "success": false,
  "message": "Ten dang nhap hoac mat khau khong dung"
}
```

- Front-end kiểm tra `success`, nếu false thì hiển thị `message` cho người chơi

## 2.4. Sequence: đăng nhập

```text
Người chơi        Front-end         Back-end (api/index.php)        MySQL
    |                 |                      |                    |
    | nhập tài khoản  |                      |                    |
    |---------------->|                      |                    |
    |                 | POST ?action=login   |                    |
    |                 | {ten_dang_nhap,      |                    |
    |                 |  mat_khau}           |                    |
    |                 |--------------------->|                    |
    |                 |                      | SELECT mat_khau    |
    |                 |                      | FROM NGUOI_CHOI    |
    |                 |                      | WHERE              |
    |                 |                      | ten_dang_nhap = ?  |
    |                 |                      |------------------->|
    |                 |                      |      1 dòng        |
    |                 |                      |<-------------------|
    |                 |                      | password_verify()  |
    |                 |                      | đúng: tạo session  |
    |                 | {success,             |                    |
    |                 |  ma_nguoi_choi,      |                    |
    |                 |  ten_dang_nhap}      |                    |
    |                 |<---------------------|                    |
    | vào màn hình    |                      |                    |
    | danh sách chương|                      |                    |
    |<----------------|                      |                    |
```

- Mật khẩu kiểm tra bằng `password_verify`, không so sánh text thuần
- Session PHP giữ `ma_nguoi_choi`, các action cần đăng nhập kiểm tra session trước khi chạy

## 2.5. Sequence: lưu game

```text
Người chơi        Front-end         Back-end (api/index.php)        MySQL
    |                 |                      |                    |
    | bấm Lưu game    |                      |                    |
    |---------------->|                      |                    |
    |                 | POST ?action=save    |                    |
    |                 | {ma_chuong,          |                    |
    |                 |  ma_phong_hien_tai,  |                    |
    |                 |  thoi_gian_choi,     |                    |
    |                 |  so_goi_y_da_dung,   |                    |
    |                 |  tui_do: [...],      |                    |
    |                 |  cau_do: [...]}      |                    |
    |                 |--------------------->|                    |
    |                 |                      | BEGIN TRANSACTION  |
    |                 |                      |------------------->|
    |                 |                      | INSERT LUU_GAME    |
    |                 |                      | (lấy ma_luu mới)   |
    |                 |                      |------------------->|
    |                 |                      | INSERT TUI_DO      |
    |                 |                      | (từng vật phẩm)    |
    |                 |                      |------------------->|
    |                 |                      | INSERT             |
    |                 |                      | TIEN_DO_CAU_DO     |
    |                 |                      | (từng câu đố)      |
    |                 |                      |------------------->|
    |                 |                      | COMMIT             |
    |                 |                      |------------------->|
    |                 | {success, ma_luu}    |                    |
    |                 |<---------------------|                    |
    | báo đã lưu      |                      |                    |
    |<----------------|                      |                    |
```

- Lưu game ghi 3 bảng trong 1 transaction, lỗi ở bước nào thì rollback toàn bộ
- `ma_luu` mới tạo dùng làm khóa cho TUI_DO và TIEN_DO_CAU_DO của bản lưu đó
- Tải lại game làm ngược lại: đọc LUU_GAME, TUI_DO, TIEN_DO_CAU_DO theo `ma_luu`, khôi phục trạng thái

## 2.6. Quy tắc kiến trúc

- Không có SQL trong file JS, không có HTML trong file PHP
- Front-end không bao giờ thấy mật khẩu băm hay cấu trúc bảng
- Mọi input từ người dùng đều qua prepared statement
- 1 action là 1 hàm trong `api/index.php`, không viết logic xử lý rải rác trong file HTML
