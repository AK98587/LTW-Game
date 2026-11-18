# Backend game Quạ Đen

Backend PHP thuần, khong dung framework, dung PDO noi MySQL.
Day la khung xuong de chia viec cho nhom, moi endpoint da chay duoc
o muc toi thieu, thanh vien nhan viec se lam tiep phan cua minh.

## Cau truc thu muc

```
backend/
  config.php       Ket noi MySQL qua PDO, doc cau hinh tu bien moi truong hoac file .env
  .env.example     Mau cau hinh, copy thanh .env roi dien gia tri that
  db/
    schema.sql     Ban sao file SQL ERD v2, 11 bang, 16 khoa ngoai, database qua_den
    seed.sql       Du lieu mau: 6 chuong, 20 phong, do vat, vat pham, cau do, manh moi
  api/
    index.php      Router duy nhat, goi bang ?action=ten_endpoint, tra JSON
```

## Yeu cau

- PHP 8.0 tro len, co extension pdo_mysql
- MySQL 8.0 tro len, hoac XAMPP tren Windows
- Khong can cai them thu vien nao

## Cai dat

### 1. Tao database va nap du lieu

```bash
mysql -u root -p < backend/db/schema.sql
mysql -u root -p < backend/db/seed.sql
```

Luu y: `schema.sql` tao database `qua_den` va chen san 6 chuong,
3 phong chuong 1, 8 cau do chuong 1. `seed.sql` viet lai ten co dau
dung cot truyen, them phong, do vat, vat pham, cau do va manh moi
cho du 6 chuong. Chi chay `seed.sql` 1 lan tren DB moi.

Kiem tra nhanh trong MySQL:

```sql
USE qua_den;
SELECT COUNT(*) FROM CHUONG;
SELECT COUNT(*) FROM PHONG;
SELECT COUNT(*) FROM CAU_DO;
```

Ket qua dung la 6 chuong, 20 phong, 18 cau do mau.

### 2. Cau hinh ket noi

```bash
cd backend
cp .env.example .env
```

Mo file `.env` sua lai neu MySQL cua ban khac mac dinh:

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=qua_den
DB_USER=root
DB_PASS=
DB_CHARSET=utf8mb4
```

File `.env` khong commit len git. Neu khong co file `.env` thi backend
dung gia tri mac dinh o tren.

### 3. Chay server

Chay tu thu muc goc cua project `qua-den-game` de vua phuc vu frontend
tinh, vua phuc vu API:

```bash
cd qua-den-game
php -S localhost:8000
```

API chay o dia chi goc:

```
http://localhost:8000/backend/api/?action=ten_endpoint
```

## Danh sach endpoint

Tat ca tra JSON dang `{ "ok": true, "data": ... }`
hoac `{ "ok": false, "error": "..." }`, kem ma HTTP dung.
Cac endpoint can dang nhap dung session PHP, frontend goi fetch
kem `credentials: 'include'` de trinh duyet gui cookie session.

| Endpoint | Method | Can dang nhap | Lam gi |
| --- | --- | --- | --- |
| `?action=register` | POST | Khong | Dang ky tai khoan moi, bang NGUOI_CHOI |
| `?action=login` | POST | Khong | Dang nhap, mo session |
| `?action=chapters` | GET | Khong | Danh sach 6 chuong, kem so phong va so cau do |
| `?action=save` | POST | Co | Luu game, bang LUU_GAME + TIEN_DO_CAU_DO |
| `?action=load` | GET | Co | Tai ban luu moi nhat, kem tien do cau do |
| `?action=leaderboard` | GET | Khong | Xem bang xep hang theo chuong, tang dan theo thoi gian |
| `?action=leaderboard` | POST | Co | Ghi diem len bang xep hang, bang BANG_XEP_HANG |

## Vi du curl

Cac vi du duoi day chay tren `localhost:8000`. Len `--cookie-jar` va
`--cookie` de giu session dang nhap giua cac lenh.

### Dang ky

```bash
curl -X POST http://localhost:8000/backend/api/?action=register \
  -H "Content-Type: application/json" \
  -d '{"ten_dang_nhap": "an", "mat_khau": "123456", "email": "an@example.com"}'
```

### Dang nhap

```bash
curl -X POST http://localhost:8000/backend/api/?action=login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"ten_dang_nhap": "an", "mat_khau": "123456"}'
```

### Xem danh sach chuong

```bash
curl http://localhost:8000/backend/api/?action=chapters
```

### Luu game

```bash
curl -X POST http://localhost:8000/backend/api/?action=save \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"ma_chuong": 1, "ma_phong_hien_tai": 1, "thoi_gian_choi": 420, "so_goi_y_da_dung": 1, "cau_do_da_giai": [1, 2]}'
```

Gui lai cung `ma_luu` de cap nhat ban luu cu thay vi tao ban moi:

```bash
curl -X POST http://localhost:8000/backend/api/?action=save \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"ma_luu": 1, "ma_chuong": 1, "ma_phong_hien_tai": 3, "thoi_gian_choi": 900, "cau_do_da_giai": [1, 2, 4]}'
```

### Tai ban luu

```bash
curl http://localhost:8000/backend/api/?action=load -b cookies.txt
```

Tai mot ban luu cu the:

```bash
curl "http://localhost:8000/backend/api/?action=load&ma_luu=1" -b cookies.txt
```

### Ghi diem len bang xep hang

```bash
curl -X POST http://localhost:8000/backend/api/?action=leaderboard \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"ma_chuong": 1, "thoi_gian_hoan_thanh": 1320}'
```

### Xem bang xep hang chuong 1

```bash
curl "http://localhost:8000/backend/api/?action=leaderboard&ma_chuong=1&limit=10"
```

## Quy tac an toan

- Moi cau SQL deu dung prepared statement, khong noi chuoi truc tiep.
- Mat khau luu bang `password_hash`, doi chieu bang `password_verify`.
- Cot `dap_an` cua bang CAU_DO khong bao gio duoc tra ra API.
  Ma ket sat nha thuoc 0312 chi nam trong DB, viec doi chieu dap an
  se lam o phia server trong endpoint solve.
- Endpoint `save` va `load` chi cho sua, doc ban luu cua chinh minh.

## Viec con lai cho nhom

Khung xuong chi co 6 endpoint toi thieu. Cac viec duoi day de thanh
vien nhan lam tiep, moi viec viet them mot khoi `if ($action === ...)`
trong `backend/api/index.php`, theo dung mau cac endpoint da co:

- `logout` POST: huy session bang `session_destroy()`.
- `chapter` GET `?ma_chuong=`: chi tiet 1 chuong, kem phong, do vat,
  cau do. Chu y: chi select cac cot can thiet, khong select `dap_an`.
- `inventory` GET: tui do cua nguoi dang nhap, join TUI_DO voi VAT_PHAM.
- `pickup` POST: nhat vat pham, them vao TUI_DO, tang `so_luong` neu da co.
- `solve` POST: nhan `ma_cau_do` va `dap_an`, kiem tra vat pham can
  trong tui do, doi chieu dap an voi DB o phia server, ghi TIEN_DO_CAU_DO
  va thuong vat pham neu dung. Dap an sai thi tra `correct: false`,
  khong bao gio tra dap an dung ra ngoai.
- Seed bo sung: kich ban co 46 cau do, hien seed moi co 18 cau mau.
  Thanh vien phu trach cot truyen them cau do vao `db/seed.sql`.
