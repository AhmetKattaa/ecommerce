<?php
// CORS ayarları
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight isteği için hızlı cevap ver
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

include 'db.php'; // Veritabanı bağlantısı

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || empty($data['name'])) {
    echo json_encode(['success' => false, 'error' => 'Category name is required']);
    exit;
}

try {
    $sql = "INSERT INTO categories (name) VALUES (:name)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':name', $data['name']);
    $stmt->execute();
    
    $categoryId = $pdo->lastInsertId();

    echo json_encode(['success' => true, 'id' => $categoryId]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error adding category: ' . $e->getMessage()]);
}
