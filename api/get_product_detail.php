<?php
// CORS Ayarları
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Preflight OPTIONS isteği için
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

$id = $_GET['id'] ?? null;

// Ürün ID yoksa hata döndür
if (!$id) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Product ID is required']);
    exit;
}

try {
    // Ürünü al
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        http_response_code(404); // Not Found
        echo json_encode(['error' => 'Product not found']);
        exit;
    }

    // Varyantları al
    $stmtVariants = $pdo->prepare("SELECT * FROM product_variants WHERE product_id = ?");
    $stmtVariants->execute([$id]);
    $product['variants'] = $stmtVariants->fetchAll(PDO::FETCH_ASSOC);

    // Yorumları al
    $stmtReviews = $pdo->prepare("SELECT * FROM product_reviews WHERE product_id = ?");
    $stmtReviews->execute([$id]);
    $product['reviews'] = $stmtReviews->fetchAll(PDO::FETCH_ASSOC);

    // Besin değerlerini al
    $stmtNutrition = $pdo->prepare("SELECT * FROM product_nutrition WHERE product_id = ?");
    $stmtNutrition->execute([$id]);
    $product['nutrition'] = $stmtNutrition->fetchAll(PDO::FETCH_ASSOC);

    // Promosyonu al
    $stmtPromo = $pdo->prepare("SELECT * FROM promotions WHERE product_id = ? AND active = 1");
    $stmtPromo->execute([$id]);
    $product['promotion'] = $stmtPromo->fetch(PDO::FETCH_ASSOC);

    // Quantities ve Flavors alanlarını JSON formatında decode et
    $product['quantities'] = json_decode($product['quantities'], true) ?: [];
    $product['flavors'] = json_decode($product['flavors'], true) ?: [];

    // Ürünü JSON formatında döndür
    echo json_encode($product);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
