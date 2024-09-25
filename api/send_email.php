<?php
// CORS başlıkları
header("Access-Control-Allow-Origin: http://localhost:5173"); // Spesifik frontend URL'sini belirtin
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight (ön kontrol) isteklerini ele alma
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Eğer istek OPTIONS ise ve başarılı bir şekilde işlendiğinde
    header("HTTP/1.1 204 No Content");
    exit();
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';
require 'PHPMailer-master/src/Exception.php';

header('Content-Type: application/json');

// CORS başlıkları
header("Access-Control-Allow-Origin: http://localhost:5173"); // Spesifik frontend URL'sini belirtin
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight (ön kontrol) isteklerini ele alma
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$mail = new PHPMailer(true);

try {
    // Sunucu ayarları
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com'; // Gmail SMTP sunucu adresi
    $mail->SMTPAuth = true;
    $mail->Username = 'ahmadkattaa2020@gmail.com'; // Gmail adresiniz
    $mail->Password = '5710616.Ab'; // Gmail uygulama şifreniz
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Güvenlik türü
    $mail->Port = 587; // TLS portu

    // Gönderici bilgilerini formdan al
    $mail->setFrom($data['email'], $data['name']); // Formdan gelen gönderici adı ve e-postası
    $mail->addAddress('ahmadkattaa2020@gmail.com', 'Admin'); // E-postayı alacak kişinin adresi ve adı

    // İçerik
    $mail->isHTML(true);
    $mail->Subject = 'Yeni İletişim Formu Gönderimi'; // E-postanın konusu
    $mail->Body    = 'Ad: ' . htmlspecialchars($data['name']) . '<br>Email: ' . htmlspecialchars($data['email']) . '<br>Mesaj: ' . nl2br(htmlspecialchars($data['message']));
    $mail->AltBody = 'Ad: ' . $data['name'] . "\nEmail: " . $data['email'] . "\nMesaj: " . $data['message'];

    $mail->send();
    echo json_encode(['message' => 'Mesaj başarıyla gönderildi']);
} catch (Exception $e) {
    echo json_encode(['message' => 'Mesaj gönderilemedi. Hata: ' . $mail->ErrorInfo]);
}


?>





