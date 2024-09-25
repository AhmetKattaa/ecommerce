<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

// Gelen verileri loglamak için
error_log(print_r($_POST, true)); // POST verilerini logla
error_log(print_r($_FILES, true)); // Dosya verilerini logla

$imageName = null;

// Resim yükleme kontrolü
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $imageTmpPath = $_FILES['image']['tmp_name'];
    $imageName = basename($_FILES['image']['name']);
    $uploadDir = __DIR__ . '/uploads/';
    $imageFilePath = $uploadDir . $imageName;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (!move_uploaded_file($imageTmpPath, $imageFilePath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file']);
        exit;
    }
} elseif (isset($_POST['image_url'])) {
    $imageName = $_POST['image_url'];
}

// Zorunlu alanları alalım
$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? null;
$price = $_POST['price'] ?? null;
$description = $_POST['description'] ?? null;
$stock = $_POST['stock'] ?? null;
$category_id = $_POST['category_id'] ?? null;

// JSON formatında gelen alanları kontrol edelim ve boş değerler için varsayılan atayalım
$flavors = $_POST['flavors'] ?? '[]';
$variants = $_POST['variants'] ?? '[]';
$quantities = $_POST['quantities'] ?? '[]';
$nutrition = $_POST['nutrition'] ?? '[]';
$promotion = $_POST['promotion'] ?? '{}';

// Gelen POST verilerini kontrol edelim
if (!$id || !$name || !$price || !$description || !$stock || !$category_id) {
    error_log("Eksik alanlar: ID=$id, Name=$name, Price=$price, Description=$description, Stock=$stock, Category ID=$category_id");
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    // Dinamik olarak sadece güncellenen alanları ayarla
    $sql = "UPDATE products SET 
                name = :name, 
                price = :price, 
                description = :description, 
                stock = :stock, 
                category_id = :category_id, 
                image = IFNULL(:image, image), 
                flavors = :flavors, 
                quantities = :quantities, 
                variants = :variants, 
                nutrition = :nutrition,
                promotion = :promotion
            WHERE id = :id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':price', $price);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':stock', $stock); 
    $stmt->bindParam(':category_id', $category_id); 
    $stmt->bindParam(':image', $imageName);
    $stmt->bindParam(':flavors', $flavors);
    $stmt->bindParam(':quantities', $quantities);
    $stmt->bindParam(':variants', $variants);
    $stmt->bindParam(':nutrition', $nutrition);
    $stmt->bindParam(':promotion', $promotion);
    $stmt->bindParam(':id', $id);
    
    $stmt->execute();

    echo json_encode(['success' => true, 'image' => $imageName]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
