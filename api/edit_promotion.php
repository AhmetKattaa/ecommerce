<?php
// PHP'deki tüm hataları gösterme
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS başlıkları ekle
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Veritabanı bağlantısını dahil et (PDO kullanılıyor)
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    $product_id = $_POST['product_id'] ?? null;
    $description = $_POST['description'] ?? null;
    $discount_percentage = $_POST['discount_percentage'] ?? null;
    $active = $_POST['active'] ?? null;

    if (empty($id) || empty($product_id) || empty($description) || empty($discount_percentage)) {
        echo json_encode(['success' => false, 'error' => 'All fields are required.']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("UPDATE promotions SET product_id = ?, description = ?, discount_percentage = ?, active = ? WHERE id = ?");
        $stmt->execute([$product_id, $description, $discount_percentage, $active, $id]);

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>
