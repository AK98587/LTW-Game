# 04. API

- Base URL local: `http://localhost:8000/backend/api/index.php` (chay `php -S localhost:8000` tu thu muc goc project)
- Mọi endpoint dùng chung 1 file `backend/api/index.php`, phân biệt bằng tham số `action`
- GET dùng cho hành động chỉ đọc, POST dùng cho hành động ghi dữ liệu
- POST gửi body JSON, header `Content-Type: application/json`
- Mọi response đều là JSON, dạng chung:

```json
{
  "success": true,
  "data": {}
}
```

- Lỗi trả về:

```json
{
  "success": false,
  "message": "Noi dung loi"
}
```

- Các endpoint cần đăng nhập kiểm tra session PHP trước khi chạy, chưa đăng nhập trả về `success: false` và message `Chua dang nhap`

## 4.1. Đăng ký

- Method: POST
- URL: `backend/api/index.php?action=register`
- Body:

```json
{
  "ten_dang_nhap": "an123",
  "mat_khau": "matkhau123",
  "email": "an123@example.com"
}
```

- Xử lý: kiểm tra tên đăng nhập và email chưa tồn tại, băm mật khẩu bằng `password_hash`, ghi 1 dòng vào NGUOI_CHOI
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_nguoi_choi": 1,
    "ten_dang_nhap": "an123"
  }
}
```

- Response lỗi, tên đăng nhập đã tồn tại:

```json
{
  "success": false,
  "message": "Ten dang nhap da ton tai"
}
```

## 4.2. Đăng nhập

- Method: POST
- URL: `backend/api/index.php?action=login`
- Body:

```json
{
  "ten_dang_nhap": "an123",
  "mat_khau": "matkhau123"
}
```

- Xử lý: lấy `mat_khau` đã băm từ NGUOI_CHOI theo `ten_dang_nhap`, kiểm tra bằng `password_verify`, tạo session lưu `ma_nguoi_choi`
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_nguoi_choi": 1,
    "ten_dang_nhap": "an123"
  }
}
```

- Response lỗi, sai tài khoản hoặc mật khẩu:

```json
{
  "success": false,
  "message": "Ten dang nhap hoac mat khau khong dung"
}
```

## 4.3. Đăng xuất

- Trạng thái: đã làm xong, có trong backend/api/index.php.

- Method: POST
- URL: `backend/api/index.php?action=logout`
- Body: không cần
- Xử lý: hủy session PHP
- Response thành công:

```json
{
  "success": true,
  "data": null
}
```

## 4.4. Lấy danh sách chương

- Method: GET
- URL: `backend/api/index.php?action=chapters`
- Xử lý: lấy toàn bộ dòng trong CHUONG, xếp theo `thu_tu` tăng dần
- Response thành công:

```json
{
  "success": true,
  "data": [
    {
      "ma_chuong": 1,
      "ten_chuong": "Can phong khoa trai o hem 41",
      "thu_tu": 1,
      "mo_ta": "Nha tro Sau Lanh, hem 41 Nguyen Trai, Q5. Sang 10/03/1998, 08:00-09:40."
    },
    {
      "ma_chuong": 2,
      "ten_chuong": "Buoi chieu cuoi o rap Le Thanh",
      "thu_tu": 2,
      "mo_ta": "Rap Le Thanh, Cho Lon. Trua 10/03/1998, 10:30-12:10."
    }
  ]
}
```

## 4.5. Lấy dữ liệu 1 chương để chơi

- Trạng thái: đã làm xong, có trong backend/api/index.php.

- Method: GET
- URL: `backend/api/index.php?action=chapter&ma_chuong=1`
- Xử lý: lấy phòng, đồ vật, câu đố, manh mối của chương, xếp theo `thu_tu`
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_chuong": 1,
    "ten_chuong": "Can phong khoa trai o hem 41",
    "phong": [
      {
        "ma_phong": 1,
        "ten_phong": "Phong tro so 4",
        "thu_tu": 1,
        "do_vat": [
          {
            "ma_do_vat": 1,
            "ten_do_vat": "Hop thiec duoi gam giuong",
            "vi_tri_x": 120,
            "vi_tri_y": 300
          }
        ],
        "cau_do": [
          {
            "ma_cau_do": 1,
            "ten_cau_do": "Chot cua gai theo ranh chu L",
            "thu_tu": 1,
            "mo_ta": "Chot cua gai theo ranh chu L"
          }
        ]
      }
    ]
  }
}
```

- Ghi chú: response không bao gồm `dap_an`, đáp án chỉ kiểm tra ở back-end

## 4.6. Lấy túi đồ

- Trạng thái: đã làm xong, có trong backend/api/index.php.

- Method: GET
- URL: `backend/api/index.php?action=inventory`
- Yêu cầu: đã đăng nhập
- Xử lý: lấy TUI_DO của người chơi trong session, nối với VAT_PHAM để lấy tên và mô tả
- Response thành công:

```json
{
  "success": true,
  "data": [
    {
      "ma_vat_pham": 3,
      "ten_vat_pham": "Chia dong",
      "mo_ta": "Chia dong nhat duoc tu chau cay giay",
      "so_luong": 1,
      "ngay_nhat": "2026-11-18 15:00:00"
    }
  ]
}
```

## 4.7. Nhặt vật phẩm

- Trạng thái: đã làm xong, có trong backend/api/index.php.

- Method: POST
- URL: `backend/api/index.php?action=pickup`
- Yêu cầu: đã đăng nhập
- Body:

```json
{
  "ma_vat_pham": 3
}
```

- Xử lý: kiểm tra vật phẩm tồn tại, ghi hoặc cập nhật `so_luong` trong TUI_DO theo cặp (ma_nguoi_choi, ma_vat_pham)
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_vat_pham": 3,
    "so_luong": 1
  }
}
```

## 4.8. Giải câu đố

- Trạng thái: đã làm xong, có trong backend/api/index.php.

- Method: POST
- URL: `backend/api/index.php?action=solve`
- Yêu cầu: đã đăng nhập
- Body:

```json
{
  "ma_cau_do": 1,
  "dap_an": "keo chot theo ranh chu L",
  "ma_luu": 5
}
```

- Xử lý:
  - Lấy `dap_an` và `ma_vat_pham_can` của câu đố từ CAU_DO
  - Nếu câu đố cần vật phẩm, kiểm tra TUI_DO của người chơi có vật phẩm đó không
  - So sánh đáp án gửi lên với `dap_an` trong database
  - Đúng thì ghi 1 dòng vào TIEN_DO_CAU_DO với `da_hoan_thanh` là TRUE và `ngay_giai` là thời điểm hiện tại, đồng thời thêm vật phẩm thưởng `ma_vat_pham_thuong` vào TUI_DO nếu có
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_cau_do": 1,
    "da_hoan_thanh": true,
    "vat_pham_thuong": null
  }
}
```

- Response lỗi, sai đáp án:

```json
{
  "success": false,
  "message": "Dap an chua dung"
}
```

- Response lỗi, thiếu vật phẩm cần:

```json
{
  "success": false,
  "message": "Can vat pham de giai cau do nay"
}
```

## 4.9. Lưu game

- Method: POST
- URL: `backend/api/index.php?action=save`
- Yêu cầu: đã đăng nhập
- Body:

```json
{
  "ma_chuong": 1,
  "ma_phong_hien_tai": 2,
  "thoi_gian_choi": 540,
  "so_goi_y_da_dung": 1,
  "tui_do": [
    { "ma_vat_pham": 3, "so_luong": 1 }
  ],
  "cau_do": [
    { "ma_cau_do": 1, "da_hoan_thanh": true }
  ]
}
```

- Xử lý: ghi 3 bảng trong 1 transaction, INSERT LUU_GAME, INSERT TUI_DO, INSERT TIEN_DO_CAU_DO, lỗi thì rollback
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_luu": 5
  }
}
```

## 4.10. Lấy danh sách bản lưu

- Method: GET
- URL: `backend/api/index.php?action=load`
- Yêu cầu: đã đăng nhập
- Xử lý: lấy các dòng LUU_GAME của người chơi trong session, xếp theo `ngay_luu` giảm dần
- Response thành công:

```json
{
  "success": true,
  "data": [
    {
      "ma_luu": 5,
      "ma_chuong": 1,
      "ma_phong_hien_tai": 2,
      "thoi_gian_choi": 540,
      "so_goi_y_da_dung": 1,
      "ngay_luu": "2026-11-18 15:10:00",
      "da_hoan_thanh": false
    }
  ]
}
```

## 4.11. Tải 1 bản lưu

- Method: GET
- URL: `backend/api/index.php?action=load&ma_luu=5`
- Yêu cầu: đã đăng nhập, bản lưu thuộc về người chơi trong session
- Xử lý: đọc LUU_GAME theo `ma_luu`, đọc TUI_DO và TIEN_DO_CAU_DO theo `ma_luu`
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_luu": 5,
    "ma_chuong": 1,
    "ma_phong_hien_tai": 2,
    "thoi_gian_choi": 540,
    "so_goi_y_da_dung": 1,
    "da_hoan_thanh": false,
    "tui_do": [
      { "ma_vat_pham": 3, "so_luong": 1 }
    ],
    "cau_do": [
      { "ma_cau_do": 1, "da_hoan_thanh": true }
    ]
  }
}
```

## 4.12. Lấy bảng xếp hạng

- Method: GET
- URL: `backend/api/index.php?action=leaderboard&ma_chuong=1`
- Xử lý: lấy BANG_XEP_HANG theo `ma_chuong`, nối NGUOI_CHOI để lấy `ten_dang_nhap`, xếp theo `thoi_gian_hoan_thanh` tăng dần, giới hạn 20 dòng
- Response thành công:

```json
{
  "success": true,
  "data": [
    {
      "ten_dang_nhap": "an123",
      "thoi_gian_hoan_thanh": 540,
      "ngay_ghi_nhan": "2026-11-18 15:20:00"
    }
  ]
}
```

## 4.13. Ghi bảng xếp hạng

- Method: POST
- URL: `backend/api/index.php?action=leaderboard`
- Yêu cầu: đã đăng nhập
- Body:

```json
{
  "ma_chuong": 1,
  "thoi_gian_hoan_thanh": 540
}
```

- Xử lý: ghi 1 dòng mới vào BANG_XEP_HANG, không ghi đè dòng cũ
- Response thành công:

```json
{
  "success": true,
  "data": {
    "ma_xep_hang": 12
  }
}
```

## 4.14. Bảng tổng hợp endpoint

| Action | Method | Đăng nhập | Mục đích |
| --- | --- | --- | --- |
| register | POST | Không | Đăng ký tài khoản |
| login | POST | Không | Đăng nhập |
| logout | POST | Có | Đăng xuất |
| chapters | GET | Không | Lấy danh sách 6 chương |
| chapter | GET | Không | Lấy dữ liệu 1 chương để chơi |
| inventory | GET | Có | Lấy túi đồ |
| pickup | POST | Có | Nhặt vật phẩm |
| solve | POST | Có | Giải câu đố |
| save | POST | Có | Lưu game |
| load | GET | Có | Lấy danh sách bản lưu, hoặc tải 1 bản lưu theo ma_luu |
| leaderboard | GET | Có (POST) | Lấy bảng xếp hạng, hoặc ghi lượt hoàn thành chương |
