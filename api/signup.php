<?php
// CORS başlıklarını ekle
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Hata gösterimi ve hata raporlama ayarları
ini_set('log_errors', 1);  // Hataları logla
ini_set('error_log', __DIR__ . '/php_errors.log');  // Hataları bu dosyaya yaz
error_reporting(E_ALL);  // Tüm hataları raporla

// Eğer istek OPTIONS ise, 200 OK ile yanıt ver ve çık
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Veritabanı ve .env dosyasını yükle
require_once 'db.php';
require_once 'loadEnv.php';
loadEnv(__DIR__ . '/.env');  // .env dosyasını oku

// JSON verisini al
$data = json_decode(file_get_contents("php://input"));

// Eğer JSON verisi geçersizse hata mesajı döndür
if (!$data) {
    echo json_encode(["message" => "Invalid input data."]);
    http_response_code(400);  // 400 Bad Request
    exit();
}

$username = $data->username;
$password = $data->password;

try {
    // Kullanıcı adının veritabanında olup olmadığını kontrol et
    $query = "SELECT * FROM users WHERE username = :username";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(["message" => "Username already exists."]);
        http_response_code(400);
        exit();
    }

    // Şifreyi hash'le
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Yeni kullanıcıyı veritabanına ekle
    $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(["message" => "User registered successfully."]);
        http_response_code(201);  // 201 Created
    } else {
        echo json_encode(["message" => "User registration failed."]);
        http_response_code(500);  // 500 Internal Server Error
        exit();
    }
} catch (Exception $e) {
    // Hata logu ve json mesajı döndür
    error_log($e->getMessage());
    echo json_encode(["message" => "An error occurred during registration."]);
    http_response_code(500);
    exit();
}
?>
