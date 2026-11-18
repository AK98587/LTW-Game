# Frontend game Quạ Đen, Sáu Vụ Án Sài Gòn 1998

Frontend thuần HTML, CSS, JavaScript, không framework, không build step.
Nhóm 5, môn Lập trình Web.

## Chạy thử

1. Chạy backend PHP + MySQL từ thư mục gốc project:
   `php -S localhost:8000`
   API nằm ở `http://localhost:8000/backend/api`.
   Nếu backend chạy ở địa chỉ khác, sửa `API_BASE_URL` trong `config.js`.
2. Mở `frontend/index.html` bằng trình duyệt, hoặc chạy server tĩnh:
   `python3 -m http.server 8080` trong thư mục `frontend/`, rồi mở `http://localhost:8080`.
   Lưu ý: khi mở bằng file:// hoặc qua server tĩnh khác cổng, trình duyệt vẫn gọi
   được API ở localhost:8000 vì mọi fetch đều kèm `credentials: "include"` và
   backend bật CORS cho origin đó.

## Các trang

- `index.html`: trang chủ, giới thiệu cốt truyện, danh sách 6 chương (lấy từ API
  `chapters`), bảng xếp hạng top 5 Chương 1 (lấy từ API `leaderboard`).
- `auth.html`: đăng nhập và đăng ký. Đăng ký xong tự đăng nhập rồi chuyển vào game.
- `game.html`: game Chương 1 chơi được, đúng kịch bản canon. Có nút Lưu game,
  Tải game, túi đồ đồng bộ với máy chủ. Chơi khách vẫn được (xem phòng, nhặt móc áo
  ở máy mình) nhưng không giải được câu đố và không lưu được lên máy chủ.
- `leaderboard.html`: bảng xếp hạng theo từng chương, bấm tab để đổi chương.

## Chuỗi câu đố Chương 1 (đúng kịch bản)

Chương 1, Căn phòng khóa trái ở hẻm 41, có 4 câu đố chơi được, lấy đúng từ
bảng CAU_DO trong database, không bịa thêm, không giữ câu đố của bản demo gốc:

1. Câu 1.1, Chốt cửa gài theo rãnh chữ L (phòng trọ số 4): bấm chốt cửa,
   kéo chốt theo rãnh chữ L qua 2 bước, rồi giải trên máy chủ.
2. Câu 1.2, Hộp thiếc dưới gầm giường và chiếc móc áo uốn cong (phòng trọ
   số 4): lấy móc áo trong tủ áo gỗ, dùng móc áo khều hộp thiếc ra, giải
   trên máy chủ.
3. Câu 1.4, Chậu cây giấy xoay theo vết xước (sân thượng phơi đồ): xoay chậu
   cây theo vết xước, nhận chìa đồng vào túi đồ, giải trên máy chủ.
4. Câu 1.8, câu đố cuối ở cửa phòng (phòng trọ số 4): gõ đáp án vào ô nhập,
   máy chủ kiểm tra, đúng thì nhận Trang sổ số 1 và mở cửa thắng chương.

3 câu đố còn lại trong database (1.3 bức ảnh gia đình, 1.5 cuộn băng ghi tiếng
mưa, 1.6 tủ áo và tờ giấy gấp, 1.7 gương cầm tay) hiện chỉ xem được nội dung,
chưa có đáp án trong database nên chưa chơi được. Bức ảnh gia đình và gương
cầm tay vẫn bấm xem được, tủ áo mở xem được móc áo. Két mã 0312 là của
Chương 5, không có trong Chương 1.

## Đăng nhập: session cookie, không dùng token

Backend dùng session cookie PHP. Mọi fetch trong `js/api.js` đều kèm
`credentials: "include"` để trình duyệt gửi cookie session. Không còn logic
token localStorage. `login` chỉ lưu cờ `qd_logged_in` và tên đăng nhập để
hiển thị, không lưu token. Đăng xuất gọi `POST ?action=logout` để hủy session.

## API backend

Mọi lệnh gọi đi qua `js/api.js` (biến toàn cục `window.QD`). Base URL mặc định
trong `config.js` là `http://localhost:8000/backend/api`:

- `POST ?action=register` (tên đăng nhập, email, mật khẩu)
- `POST ?action=login` (tên đăng nhập, mật khẩu; session cookie)
- `POST ?action=logout`
- `GET ?action=chapters` (danh sách 6 chương, có phòng, đồ vật, câu đố)
- `GET ?action=chapter&ma_chuong=1` (một chương, không trả đáp án)
- `GET ?action=inventory` (túi đồ trên máy chủ)
- `POST ?action=pickup` (ma_vat_pham, nhặt vật phẩm vào túi đồ)
- `POST ?action=solve` (ma_cau_do, dap_an, ma_luu tùy chọn; máy chủ kiểm tra
  vật phẩm cần và đáp án, trả đúng/sai và phần thưởng, không bao giờ trả đáp án)
- `POST ?action=save` (ma_chuong, ma_phong_hien_tai, trang_thai JSON,
  thoi_gian_choi, so_goi_y_da_dung, cau_do_da_giai, da_hoan_thanh, ma_luu tùy chọn)
- `GET ?action=load&ma_luu=<id bản lưu>` (tải theo id bản lưu, không theo mã chương)
- `GET ?action=leaderboard&ma_chuong=<số>`
- `POST ?action=leaderboard` (ghi kết quả khi thắng chương)

Khi backend chưa chạy, các trang vẫn mở được và hiện rõ thông báo lỗi kết nối,
không có nút nào chết: mọi nút bấm đều có tác dụng thật (chuyển trang, mở modal,
gọi API, hoặc báo lỗi rõ ràng).
