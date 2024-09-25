<?php
require_once __DIR__ . '/lib/php-jwt/src/JWT.php';
require_once __DIR__ . '/lib/php-jwt/src/Key.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

// Veritabanı bağlantısı
require_once 'db.php';  // Veritabanı bağlantı dosyanı dahil et

$secretKey = 'your_secret_key';
$jwt = null;

// Authorization header'ını al
$headers = apache_request_headers();
if (isset($headers['Authorization'])) {
    $jwt = trim(str_replace('Bearer', '', $headers['Authorization']));
}

if ($jwt) {
    try {
        // Token'ı doğrula
        $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
        $userId = $decoded->data->userId;  // Token'dan kullanıcı ID'sini al

        // Kullanıcı doğrulandı, işlemler devam edebilir
        echo json_encode(["message" => "Access granted", "userId" => $userId]);

    } catch (Exception $e) {
        // Token geçersizse hata döndür
        http_response_code(401);
        echo json_encode(["message" => "Access denied."]);
    }
} else {
    // JWT yoksa hata döndür
    http_response_code(401);
    echo json_encode(["message" => "Access denied."]);
}
?>
