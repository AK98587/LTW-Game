CREATE DATABASE IF NOT EXISTS qua_den
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qua_den;

CREATE TABLE NGUOI_CHOI (
  ma_nguoi_choi INT AUTO_INCREMENT PRIMARY KEY,
  ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
  mat_khau      VARCHAR(255) NOT NULL,
  email         VARCHAR(100) UNIQUE,
  ngay_tao      DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CHUONG (
  ma_chuong INT AUTO_INCREMENT PRIMARY KEY,
  ten_chuong VARCHAR(100) NOT NULL,
  thu_tu     INT NOT NULL,
  mo_ta      TEXT
);

CREATE TABLE PHONG (
  ma_phong  INT AUTO_INCREMENT PRIMARY KEY,
  ma_chuong INT NOT NULL,
  ten_phong VARCHAR(100) NOT NULL,
  thu_tu    INT NOT NULL,
  FOREIGN KEY (ma_chuong) REFERENCES CHUONG (ma_chuong)
);

CREATE TABLE DO_VAT (
  ma_do_vat  INT AUTO_INCREMENT PRIMARY KEY,
  ma_phong   INT NOT NULL,
  ten_do_vat VARCHAR(100) NOT NULL,
  vi_tri_x   INT,
  vi_tri_y   INT,
  FOREIGN KEY (ma_phong) REFERENCES PHONG (ma_phong)
);

CREATE TABLE VAT_PHAM (
  ma_vat_pham  INT AUTO_INCREMENT PRIMARY KEY,
  ten_vat_pham VARCHAR(100) NOT NULL,
  mo_ta        TEXT,
  ma_do_vat    INT,
  FOREIGN KEY (ma_do_vat) REFERENCES DO_VAT (ma_do_vat)
);

CREATE TABLE CAU_DO (
  ma_cau_do         INT AUTO_INCREMENT PRIMARY KEY,
  ma_phong          INT NOT NULL,
  ten_cau_do        VARCHAR(100) NOT NULL,
  thu_tu            INT NOT NULL,
  mo_ta             TEXT,
  dap_an            VARCHAR(200),
  ma_vat_pham_can   INT,
  ma_vat_pham_thuong INT,
  FOREIGN KEY (ma_phong) REFERENCES PHONG (ma_phong),
  FOREIGN KEY (ma_vat_pham_can) REFERENCES VAT_PHAM (ma_vat_pham),
  FOREIGN KEY (ma_vat_pham_thuong) REFERENCES VAT_PHAM (ma_vat_pham)
);

CREATE TABLE MANH_MOI (
  ma_manh_moi INT AUTO_INCREMENT PRIMARY KEY,
  ma_cau_do   INT NOT NULL,
  noi_dung    TEXT NOT NULL,
  FOREIGN KEY (ma_cau_do) REFERENCES CAU_DO (ma_cau_do)
);

CREATE TABLE TUI_DO (
  ma_nguoi_choi INT NOT NULL,
  ma_vat_pham   INT NOT NULL,
  so_luong      INT DEFAULT 1,
  ngay_nhat     DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ma_nguoi_choi, ma_vat_pham),
  FOREIGN KEY (ma_nguoi_choi) REFERENCES NGUOI_CHOI (ma_nguoi_choi),
  FOREIGN KEY (ma_vat_pham) REFERENCES VAT_PHAM (ma_vat_pham)
);

CREATE TABLE LUU_GAME (
  ma_luu           INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_choi    INT NOT NULL,
  ma_chuong        INT NOT NULL,
  ma_phong_hien_tai INT,
  thoi_gian_choi   INT,
  so_goi_y_da_dung INT DEFAULT 0,
  ngay_luu         DATETIME DEFAULT CURRENT_TIMESTAMP,
  da_hoan_thanh    BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (ma_nguoi_choi) REFERENCES NGUOI_CHOI (ma_nguoi_choi),
  FOREIGN KEY (ma_chuong) REFERENCES CHUONG (ma_chuong),
  FOREIGN KEY (ma_phong_hien_tai) REFERENCES PHONG (ma_phong)
);

CREATE TABLE TIEN_DO_CAU_DO (
  ma_luu         INT NOT NULL,
  ma_cau_do      INT NOT NULL,
  da_hoan_thanh  BOOLEAN DEFAULT FALSE,
  ngay_giai      DATETIME,
  PRIMARY KEY (ma_luu, ma_cau_do),
  FOREIGN KEY (ma_luu) REFERENCES LUU_GAME (ma_luu),
  FOREIGN KEY (ma_cau_do) REFERENCES CAU_DO (ma_cau_do)
);

CREATE TABLE BANG_XEP_HANG (
  ma_xep_hang         INT AUTO_INCREMENT PRIMARY KEY,
  ma_nguoi_choi       INT NOT NULL,
  ma_chuong           INT NOT NULL,
  thoi_gian_hoan_thanh INT,
  ngay_ghi_nhan       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ma_nguoi_choi) REFERENCES NGUOI_CHOI (ma_nguoi_choi),
  FOREIGN KEY (ma_chuong) REFERENCES CHUONG (ma_chuong)
);

INSERT INTO CHUONG (ma_chuong, ten_chuong, thu_tu, mo_ta) VALUES
(1, 'Can phong khoa trai o hem 41', 1, 'Nha tro Sau Lanh, hem 41 Nguyen Trai, Q5. Sang 10/03/1998, 08:00-09:40.'),
(2, 'Buoi chieu cuoi o rap Le Thanh', 2, 'Rap Le Thanh, Cho Lon. Trua 10/03/1998, 10:30-12:10.'),
(3, 'Tiem radio Chinh Phat o Nhat Tao', 3, 'Tiem radio Chinh Phat. Chieu 10/03/1998, 14:00-16:20.'),
(4, 'Chuyen xe do luc nua dem', 4, 'Ben xe Cho Lon. Dem 10/03/1998, 23:10-00:30.'),
(5, 'Nha thuoc An Binh va lo thuoc khong nhan', 5, 'Nha thuoc An Binh, Q10. Rang sang 11/03/1998, 05:00-07:10.'),
(6, 'Nha in Muc Tim trong dem cuoi', 6, 'Nha in Muc Tim, Q1. Sang 11/03/1998, 07:30-09:00, truoc gio kiem tra so 09:00.');

INSERT INTO PHONG (ma_phong, ma_chuong, ten_phong, thu_tu) VALUES
(1, 1, 'Phong tro so 4', 1),
(2, 1, 'Hanh lang va cau thang', 2),
(3, 1, 'San thuong phoi do', 3);

INSERT INTO CAU_DO (ma_cau_do, ma_phong, ten_cau_do, thu_tu) VALUES
(1, 1, 'Chot cua gai theo ranh chu L', 1),
(2, 1, 'Hop thiec duoi gam giuong va chiec moc ao uon cong', 2),
(3, 2, 'Buc anh gia dinh soi den moi doc duoc', 3),
(4, 3, 'Chau cay giay xoay theo vet xuoc', 4),
(5, 1, 'Cuon bang ghi tieng mua va tieng chuong', 5),
(6, 1, 'Tu ao va to giay gap theo nep cu', 6),
(7, 3, 'Guong cam tay hung nang vao khe toi duoi bon nuoc', 7),
(8, 1, 'Noi doi nguoi la qua cua phong', 8);
