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
include 'db.php';  // $pdo değişkeni burada geliyor

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = $_POST['product_id'] ?? null;
    $description = $_POST['description'] ?? null;
    $discount_percentage = $_POST['discount_percentage'] ?? null;
    $active = $_POST['active'] ?? null;

    // Zorunlu alanlar boş mu?
    if (empty($product_id) || empty($description) || empty($discount_percentage)) {
        echo json_encode(['success' => false, 'error' => 'All fields are required.']);
        exit();
    }

    // Promosyonu veritabanına ekleme (PDO kullanılıyor)
    try {
        $stmt = $pdo->prepare("INSERT INTO promotions (product_id, description, discount_percentage, active) VALUES (?, ?, ?, ?)");
        $stmt->execute([$product_id, $description, $discount_percentage, $active]);

        echo json_encode(['success' => true, 'promotion' => [
            'id' => $pdo->lastInsertId(),
            'product_id' => $product_id,
            'description' => $description,
            'discount_percentage' => $discount_percentage,
            'active' => $active
        ]]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>
