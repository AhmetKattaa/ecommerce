<?php
// CORS ve header ayarları
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// OPTIONS isteği için hızlı dönüş
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

// Resim dosyasını işleme
$imageName = null;
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

// POST verilerini al ve kontrol et
$name = $_POST['name'] ?? null;
$price = isset($_POST['price']) ? floatval($_POST['price']) : null;
$description = $_POST['description'] ?? null;

// Opsiyonel alanlar
$flavors = isset($_POST['flavors']) ? json_encode($_POST['flavors']) : '[]';
$quantities = isset($_POST['quantities']) ? json_encode($_POST['quantities']) : '[]';
$variants = isset($_POST['variants']) ? json_encode($_POST['variants']) : '[]';

// Zorunlu alanların kontrolü
if (!$name) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required field: name']);
    exit;
}

if ($price === null || $price <= 0) { // Price değeri null ya da sıfır veya negatifse
    http_response_code(400);
    echo json_encode(['error' => 'Missing or invalid field: price']);
    exit;
}

if (!$description) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required field: description']);
    exit;
}

// Veritabanına ekleme işlemi
try {
    $sql = "INSERT INTO products (name, price, description, image, flavors, quantities, variants) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $price, $description, $imageName, $flavors, $quantities, $variants]);
    $newProductId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'product' => [
            'id' => $newProductId,
            'name' => $name,
            'price' => $price,
            'description' => $description,
            'image' => $imageName,
            'flavors' => json_decode($flavors),
            'quantities' => json_decode($quantities),
            'variants' => json_decode($variants)
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
