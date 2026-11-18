# 03. Cơ sở dữ liệu

- Database: `qua_den`
- Bảng mã: utf8mb4, đối chiếu utf8mb4_unicode_ci
- Tổng: 11 bảng, 16 khóa ngoại
- Khóa chính: INT tự tăng AUTO_INCREMENT, trừ 2 bảng có khóa chính kép
- Khóa ngoại: INT chép lại giá trị khóa chính của bảng cha, không tự tăng
- Không có quan hệ 1-1, toàn bộ quan hệ là 1-n
- File SQL đầy đủ: `backend/sql/qua_den.sql`

## 3.1. NGUOI_CHOI (người chơi)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_nguoi_choi | INT | PRIMARY KEY, AUTO_INCREMENT |
| ten_dang_nhap | VARCHAR(50) | UNIQUE, NOT NULL |
| mat_khau | VARCHAR(255) | NOT NULL, lưu dạng băm password_hash |
| email | VARCHAR(100) | UNIQUE |
| ngay_tao | DATETIME | DEFAULT CURRENT_TIMESTAMP |

- 1 người chơi có nhiều bản lưu, nhiều dòng túi đồ, nhiều dòng xếp hạng

## 3.2. CHUONG (chương)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_chuong | INT | PRIMARY KEY, AUTO_INCREMENT |
| ten_chuong | VARCHAR(100) | NOT NULL |
| thu_tu | INT | NOT NULL |
| mo_ta | TEXT | |

- Dữ liệu mẫu, 6 chương:
  - 1: Can phong khoa trai o hem 41
  - 2: Buoi chieu cuoi o rap Le Thanh
  - 3: Tiem radio Chinh Phat o Nhat Tao
  - 4: Chuyen xe do luc nua dem
  - 5: Nha thuoc An Binh va lo thuoc khong nhan
  - 6: Nha in Muc Tim trong dem cuoi
- 1 chương có nhiều phòng, nhiều bản lưu, nhiều dòng xếp hạng

## 3.3. PHONG (phòng)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_phong | INT | PRIMARY KEY, AUTO_INCREMENT |
| ma_chuong | INT | NOT NULL, FK tới CHUONG(ma_chuong) |
| ten_phong | VARCHAR(100) | NOT NULL |
| thu_tu | INT | NOT NULL |

- Dữ liệu mẫu, 3 phòng chương 1:
  - 1: Phong tro so 4
  - 2: Hanh lang va cau thang
  - 3: San thuong phoi do
- 1 phòng có nhiều đồ vật, nhiều câu đố

## 3.4. DO_VAT (đồ vật trong phòng)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_do_vat | INT | PRIMARY KEY, AUTO_INCREMENT |
| ma_phong | INT | NOT NULL, FK tới PHONG(ma_phong) |
| ten_do_vat | VARCHAR(100) | NOT NULL |
| vi_tri_x | INT | Tọa độ x của đồ vật trên màn hình phòng |
| vi_tri_y | INT | Tọa độ y của đồ vật trên màn hình phòng |

- 1 đồ vật cho ra 0 hoặc 1 vật phẩm nhặt được trong bảng VAT_PHAM

## 3.5. VAT_PHAM (vật phẩm nhặt được)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_vat_pham | INT | PRIMARY KEY, AUTO_INCREMENT |
| ten_vat_pham | VARCHAR(100) | NOT NULL |
| mo_ta | TEXT | |
| ma_do_vat | INT | FK tới DO_VAT(ma_do_vat), cho NULL |

- `ma_do_vat` cho NULL, vì có vật phẩm nhận được từ câu đố thưởng, không nhặt từ đồ vật trong phòng
- 1 vật phẩm có thể là vật phẩm cần của nhiều câu đố, và là vật phẩm thưởng của nhiều câu đố

## 3.6. CAU_DO (câu đố)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_cau_do | INT | PRIMARY KEY, AUTO_INCREMENT |
| ma_phong | INT | NOT NULL, FK tới PHONG(ma_phong) |
| ten_cau_do | VARCHAR(100) | NOT NULL |
| thu_tu | INT | NOT NULL |
| mo_ta | TEXT | Mô tả câu đố |
| dap_an | VARCHAR(200) | Đáp án đúng, back-end kiểm tra |
| ma_vat_pham_can | INT | FK tới VAT_PHAM(ma_vat_pham), cho NULL |
| ma_vat_pham_thuong | INT | FK tới VAT_PHAM(ma_vat_pham), cho NULL |

- `ma_vat_pham_can`: vật phẩm bắt buộc phải có mới giải được câu đố, cho NULL nếu không cần vật phẩm
- `ma_vat_pham_thuong`: vật phẩm thưởng khi giải xong, cho NULL nếu không có thưởng
- Dữ liệu mẫu: 8 câu đố chương 1, gồm câu 1.1 chốt cửa gài theo rãnh chữ L
- 1 câu đố có nhiều manh mối trong bảng MANH_MOI

## 3.7. MANH_MOI (manh mối của câu đố)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_manh_moi | INT | PRIMARY KEY, AUTO_INCREMENT |
| ma_cau_do | INT | NOT NULL, FK tới CAU_DO(ma_cau_do) |
| noi_dung | TEXT | NOT NULL |

- 1 câu đố có nhiều manh mối, mỗi manh mối là 1 dòng

## 3.8. TUI_DO (túi đồ của người chơi)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_nguoi_choi | INT | NOT NULL, PK, FK tới NGUOI_CHOI(ma_nguoi_choi) |
| ma_vat_pham | INT | NOT NULL, PK, FK tới VAT_PHAM(ma_vat_pham) |
| so_luong | INT | DEFAULT 1 |
| ngay_nhat | DATETIME | DEFAULT CURRENT_TIMESTAMP |

- Khóa chính kép: (ma_nguoi_choi, ma_vat_pham)
- 1 người chơi chỉ có 1 dòng cho mỗi loại vật phẩm, nhặt thêm thì tăng `so_luong`

## 3.9. LUU_GAME (bản lưu game)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_luu | INT | PRIMARY KEY, AUTO_INCREMENT |
| ma_nguoi_choi | INT | NOT NULL, FK tới NGUOI_CHOI(ma_nguoi_choi) |
| ma_chuong | INT | NOT NULL, FK tới CHUONG(ma_chuong) |
| ma_phong_hien_tai | INT | FK tới PHONG(ma_phong), cho NULL |
| thoi_gian_choi | INT | Số giây đã chơi |
| so_goi_y_da_dung | INT | DEFAULT 0 |
| ngay_luu | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| da_hoan_thanh | BOOLEAN | DEFAULT FALSE |

- `ma_phong_hien_tai` cho NULL, vì bản lưu tạo lúc chưa vào phòng nào thì chưa có phòng hiện tại
- Khóa chính chỉ có `ma_luu`, không phải khóa chính kép
- 1 bản lưu có nhiều dòng tiến độ câu đố trong bảng TIEN_DO_CAU_DO

## 3.10. TIEN_DO_CAU_DO (tiến độ câu đố theo bản lưu)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_luu | INT | NOT NULL, PK, FK tới LUU_GAME(ma_luu) |
| ma_cau_do | INT | NOT NULL, PK, FK tới CAU_DO(ma_cau_do) |
| da_hoan_thanh | BOOLEAN | DEFAULT FALSE |
| ngay_giai | DATETIME | NULL cho tới khi giải xong |

- Khóa chính kép: (ma_luu, ma_cau_do)
- 1 bản lưu có 1 dòng cho mỗi câu đố đã chạm tới, chưa giải thì `da_hoan_thanh` là FALSE

## 3.11. BANG_XEP_HANG (bảng xếp hạng)

| Cột | Kiểu | Ràng buộc |
| --- | --- | --- |
| ma_xep_hang | INT | PRIMARY KEY, AUTO_INCREMENT |
| ma_nguoi_choi | INT | NOT NULL, FK tới NGUOI_CHOI(ma_nguoi_choi) |
| ma_chuong | INT | NOT NULL, FK tới CHUONG(ma_chuong) |
| thoi_gian_hoan_thanh | INT | Số giây hoàn thành chương |
| ngay_ghi_nhan | DATETIME | DEFAULT CURRENT_TIMESTAMP |

- Mỗi dòng là 1 lượt hoàn thành 1 chương của 1 người chơi
- 6 chương thì 1 người chơi hoàn thành hết có 6 dòng, chơi lại thì thêm dòng mới, không ghi đè
- Xếp hạng theo từng chương, xếp theo `thoi_gian_hoan_thanh` tăng dần

## 3.12. Quan hệ

| Quan hệ | Loại | Ghi chú |
| --- | --- | --- |
| NGUOI_CHOI 1-n LUU_GAME | 1-n | 1 người chơi có nhiều bản lưu |
| NGUOI_CHOI 1-n TUI_DO | 1-n | 1 người chơi có nhiều vật phẩm |
| NGUOI_CHOI 1-n BANG_XEP_HANG | 1-n | 1 người chơi có nhiều lượt xếp hạng |
| CHUONG 1-n PHONG | 1-n | 1 chương có nhiều phòng |
| CHUONG 1-n LUU_GAME | 1-n | 1 chương có nhiều bản lưu |
| CHUONG 1-n BANG_XEP_HANG | 1-n | 1 chương có nhiều lượt xếp hạng |
| PHONG 1-n DO_VAT | 1-n | 1 phòng có nhiều đồ vật |
| PHONG 1-n CAU_DO | 1-n | 1 phòng có nhiều câu đố |
| PHONG 1-n LUU_GAME | 1-n | 1 phòng là phòng hiện tại của nhiều bản lưu |
| DO_VAT 1-n VAT_PHAM | 1-n | 1 đồ vật cho ra nhiều vật phẩm |
| VAT_PHAM 1-n TUI_DO | 1-n | 1 vật phẩm nằm trong túi của nhiều người chơi |
| VAT_PHAM 1-n CAU_DO (can) | 1-n | 1 vật phẩm là đồ cần của nhiều câu đố |
| VAT_PHAM 1-n CAU_DO (thuong) | 1-n | 1 vật phẩm là đồ thưởng của nhiều câu đố |
| CAU_DO 1-n MANH_MOI | 1-n | 1 câu đố có nhiều manh mối |
| CAU_DO 1-n TIEN_DO_CAU_DO | 1-n | 1 câu đố có tiến độ ở nhiều bản lưu |
| LUU_GAME 1-n TIEN_DO_CAU_DO | 1-n | 1 bản lưu có tiến độ của nhiều câu đố |

- Tổng 16 khóa ngoại, khớp đúng 16 dòng quan hệ trên
- Chiều khóa ngoại: bảng con giữ khóa ngoại trỏ về bảng cha, ví dụ VAT_PHAM.ma_do_vat trỏ về DO_VAT, không có chiều ngược lại
