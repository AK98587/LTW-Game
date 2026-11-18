# 05. Hướng dẫn chạy

## 5.1. Yêu cầu hệ thống

- PHP 8.0 trở lên
- MySQL 8.0 trở lên
- Trình duyệt Chrome hoặc Edge bản mới nhất
- Windows: dùng XAMPP, đã gồm Apache, PHP, MySQL
- Linux: cài PHP và MySQL riêng, chạy bằng PHP built-in server

## 5.2. Chạy trên Windows bằng XAMPP

### Bước 1: cài XAMPP

- Tải XAMPP tại https://www.apachefriends.org, chọn bản có PHP 8.x
- Cài vào `C:\xampp`, mở XAMPP Control Panel
- Bấm Start ở 2 dòng Apache và MySQL, cả hai phải hiện màu xanh

### Bước 2: chép code vào htdocs

- Chép toàn bộ thư mục `qua-den-game` vào `C:\xampp\htdocs\qua-den-game`
- Đường dẫn back-end sẽ là `C:\xampp\htdocs\qua-den-game\backend`

### Bước 3: tạo database

- Mở trình duyệt, vào `http://localhost/phpmyadmin`
- Bấm tab Import, chọn file `backend\sql\qua_den.sql`, bấm Go
- Kiểm tra: database `qua_den` xuất hiện, có đủ 11 bảng, bảng CHUONG có 6 dòng

### Bước 4: sửa thông tin kết nối

- Mở file `backend\config.php`
- Sửa đúng 4 giá trị:
  - host: `localhost`
  - dbname: `qua_den`
  - user: `root`
  - password: để trống, vì MySQL của XAMPP mặc định user root không có mật khẩu

### Bước 5: chạy

- Mở trình duyệt, vào `http://localhost/qua-den-game/frontend/index.html`
- Đăng ký 1 tài khoản, đăng nhập, chơi thử chương 1

## 5.3. Chạy trên Linux bằng php -S và MySQL

### Bước 1: cài PHP và MySQL

```bash
sudo apt update
sudo apt install php php-mysql php-mbstring mysql-server
```

### Bước 2: tạo database

```bash
sudo mysql -u root -p < backend/sql/qua_den.sql
```

- Kiểm tra:

```bash
mysql -u root -p -e "USE qua_den; SHOW TABLES; SELECT COUNT(*) FROM CHUONG;"
```

- Kết quả phải là 11 bảng, bảng CHUONG có 6 dòng

### Bước 3: tạo user MySQL cho project, tùy chọn nhưng nên làm

```bash
sudo mysql -u root -p -e "CREATE USER 'quaden'@'localhost' IDENTIFIED BY 'quaden123'; GRANT ALL PRIVILEGES ON qua_den.* TO 'quaden'@'localhost'; FLUSH PRIVILEGES;"
```

- Sau đó sửa `backend/config.php`:
  - host: `localhost`
  - dbname: `qua_den`
  - user: `quaden`
  - password: `quaden123`

### Bước 4: chạy back-end

```bash
cd backend
php -S localhost:8000
```

- Giữ terminal này chạy, không tắt
- Kiểm tra API:

```bash
curl "http://localhost:8000/api/index.php?action=chapters"
```

- Kết quả phải là JSON có `success: true` và 6 chương

### Bước 5: chạy front-end

- Cách 1: mở trực tiếp file `frontend/index.html` bằng trình duyệt
- Cách 2: chạy thêm 1 server tĩnh ở thư mục frontend:

```bash
cd frontend
php -S localhost:8080
```

- Mở trình duyệt, vào `http://localhost:8080`
- Lưu ý: nếu mở file trực tiếp thì request fetch tới API phải dùng đường dẫn tuyệt đối `http://localhost:8000/api/index.php`, vì file mở bằng `file://` không có origin

## 5.4. Kiểm tra nhanh sau khi chạy

- Đăng ký tài khoản mới thành công
- Đăng nhập bằng tài khoản vừa tạo thành công
- Danh sách chương hiện đủ 6 chương
- Vào chương 1, thấy 3 phòng: Phòng trọ số 4, Hành lang và cầu thang, Sân thượng phơi đồ
- Nhặt 1 vật phẩm, mở túi đồ thấy vật phẩm đó
- Bấm lưu game, kiểm tra trong MySQL:

```bash
mysql -u root -p -e "USE qua_den; SELECT * FROM LUU_GAME;"
```

- Phải thấy 1 dòng bản lưu vừa tạo

## 5.5. Xử lý lỗi thường gặp

- Lỗi `Connection refused` khi gọi API:
  - Nguyên nhân: chưa chạy `php -S localhost:8000`, hoặc chạy sai thư mục
  - Cách sửa: vào đúng thư mục `backend`, chạy lại `php -S localhost:8000`
- Lỗi `Access denied for user 'root'@'localhost'`:
  - Nguyên nhân: sai user hoặc sai password trong `config.php`
  - Cách sửa: kiểm tra lại user và password, thử đăng nhập MySQL bằng tay trước
- Lỗi `Unknown database 'qua_den'`:
  - Nguyên nhân: chưa import file SQL
  - Cách sửa: chạy lại `mysql -u root -p < backend/sql/qua_den.sql`
- Lỗi `Table 'qua_den.CHUONG' doesn't exist`:
  - Nguyên nhân: import SQL chưa xong hoặc import sai database
  - Cách sửa: xóa database rồi import lại từ đầu
- Lỗi `CORS` trên trình duyệt:
  - Nguyên nhân: mở front-end bằng `file://` và fetch sang `localhost:8000`
  - Cách sửa: chạy front-end bằng `php -S localhost:8080` thay vì mở file trực tiếp
- Lỗi chữ tiếng Việt hiện dấu hỏi:
  - Nguyên nhân: database không dùng utf8mb4, hoặc kết nối PDO không set charset
  - Cách sửa: kiểm tra database dùng utf8mb4, trong `config.php` thêm `charset=utf8mb4` vào DSN
- Lỗi `Port 8000 already in use`:
  - Nguyên nhân: đã có tiến trình PHP khác chạy ở cổng 8000
  - Cách sửa: đổi cổng, ví dụ `php -S localhost:8001`, và sửa base URL trong `frontend/js/api.js`
- Apache trong XAMPP không Start được:
  - Nguyên nhân: cổng 80 bị chương trình khác chiếm, thường là Skype hoặc IIS
  - Cách sửa: tắt chương trình chiếm cổng 80, hoặc đổi cổng Apache sang 8080 trong XAMPP Control Panel
- MySQL trong XAMPP không Start được:
  - Nguyên nhân: cổng 3306 bị MySQL khác chiếm, hoặc file dữ liệu bị lỗi
  - Cách sửa: tắt MySQL ngoài XAMPP, hoặc kiểm tra log trong `C:\xampp\mysql\data\*.err`
