<?php
// config.php
// Cau hinh ket noi MySQL cho game Qua Den.
// Mat khau KHONG viet cung trong file nay.
// Thu tu doc cau hinh: bien moi truong he thong, file backend/.env, gia tri mac dinh.
// File .env chi nam tren may chay backend, khong commit len git.

// Doc file .env neu co. Dinh dang moi dong: TEN=gia_tri
$envFile = __DIR__ . '/.env';
if (is_file($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }
        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));
        // Bo dau ngoac kep neu co: DB_PASS="abc"
        if (strlen($value) >= 2 && $value[0] === '"' && $value[strlen($value) - 1] === '"') {
            $value = substr($value, 1, -1);
        }
        if (getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
        }
    }
}

// Ham lay gia tri cau hinh, uu tien bien moi truong, neu khong co thi dung mac dinh.
function env_value($key, $default = '') {
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }
    return $value;
}

$dbHost    = env_value('DB_HOST', 'localhost');
$dbPort    = (int) env_value('DB_PORT', '3306');
$dbName    = env_value('DB_NAME', 'qua_den');
$dbUser    = env_value('DB_USER', 'root');
$dbPass    = env_value('DB_PASS', '');
$dbCharset = env_value('DB_CHARSET', 'utf8mb4');

// Ket noi PDO. Chi dung prepared statement o moi cho trong api,
// khong bao gio noi chuoi truc tiep vao cau SQL.
try {
    $pdo = new PDO(
        "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset={$dbCharset}",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    // Chi tra loi ngan gon, khong lo thong tin ket noi ra ngoai.
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'ok' => false,
        'error' => 'Khong ket noi duoc co so du lieu. Kiem tra lai file .env va chac chan MySQL dang chay, database qua_den da duoc import.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
