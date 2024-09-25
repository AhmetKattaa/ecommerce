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

// .env dosyasını frontend dizininden yükle
loadEnv(__DIR__ . '/../frontend/.env');  // frontend/.env dosyasını oku

// Kütüphaneleri yükle
require_once __DIR__ . '\lib\php-jwt-main\src\JWT.php';
require_once __DIR__ . '\lib\php-jwt-main\src\Key.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

// JSON verisini al
$data = json_decode(file_get_contents("php://input"));

// Eğer JSON verisi geçersizse hata mesajı döndür
if (!$data) {
    echo json_encode(["message" => "Invalid input data."]);
    http_response_code(400);  // 400 Bad Request
    exit();
}

$username = $data->username ?? null;
$password = $data->password ?? null;

// Giriş bilgileri eksikse hata döndür
if (!$username || !$password) {
    echo json_encode(["message" => "Eksik giriş bilgileri."]);
    http_response_code(400);  // 400 Bad Request
    exit();
}

try {
    // Kullanıcıyı veritabanında ara
    $query = "SELECT * FROM users WHERE username = :username";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Parola doğrulama
    if ($user && password_verify($password, $user['password'])) {
        // Secret key'i .env dosyasından al
        $secretKey = $_ENV['JWT_SECRET_KEY'] ?? null;

        // Hata ayıklama: JWT secret key'i logla
        error_log("JWT_SECRET_KEY: " . print_r($secretKey, true));

        if (!$secretKey) {
            error_log("JWT secret key tanımlı değil.");
            echo json_encode(["message" => "Sunucu yapılandırma hatası."]);
            http_response_code(500);  // 500 Internal Server Error
            exit();
        }

        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  // Token 1 saat geçerli olacak
        $payload = [
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => [
                'userId' => $user['id'],
                'username' => $user['username']
            ]
        ];

        // JWT token oluştur
        $jwt = JWT::encode($payload, $secretKey, 'HS256');

        echo json_encode([
            'message' => 'Login successful',
            'token' => $jwt
        ]);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Giriş başarısız."]);
        http_response_code(401);
    }
} catch (Exception $e) {
    // Hata logu ve json mesajı döndür
    error_log("Hata: " . $e->getMessage());
    echo json_encode(["message" => "Bir hata oluştu."]);
    http_response_code(500);
}
?>
