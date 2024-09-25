<?php
// CORS başlıklarını ekleyelim
header("Access-Control-Allow-Origin: http://localhost:5173"); // İsteğin geldiği adresi belirtiyoruz
header("Access-Control-Allow-Methods: POST, OPTIONS"); // İzin verilen HTTP metodları
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // İzin verilen başlıklar
header("Content-Type: application/json; charset=UTF-8");

// Preflight isteği kontrolü
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php'; // Veritabanı bağlantısı

$data = json_decode(file_get_contents("php://input"), true);

// Silinecek kategorinin ID'si eksikse hata verelim
if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'Category ID is required']);
    exit;
}

try {
    // Unknown kategori ID'sini bulalım
    $unknownCategoryId = 1; // Unknown kategorisinin ID'si, veritabanında tanımlı olmalı

    // Kategoriye bağlı ürünleri Unknown kategorisine taşı
    $sql = "UPDATE products SET category_id = :unknownCategoryId WHERE category_id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':unknownCategoryId', $unknownCategoryId, PDO::PARAM_INT);
    $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
    $stmt->execute();

    // Kategoriyi silme işlemi
    $sql = "DELETE FROM categories WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $data['id'], PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error deleting category: ' . $e->getMessage()]);
}
?>
