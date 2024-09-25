<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $title = $_POST['title'];
    $content = $_POST['content'];
    $author = $_POST['author'];
    $imagePath = $_POST['existing_image'] ?? ''; // Mevcut resim yolunu varsayılan olarak al

    // Yeni resim dosyası yüklendi mi kontrol et
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageName = basename($_FILES['image']['name']);
        $uploadDir = __DIR__ . '/uploads/';
        $uploadFile = $uploadDir . $imageName;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            $imagePath = 'uploads/' . $imageName; // Yeni resim yolu
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to upload image']);
            exit;
        }
    } elseif (isset($_POST['image_url']) && filter_var($_POST['image_url'], FILTER_VALIDATE_URL)) {
        // Yeni resim URL'si varsa, mevcut yolu güncelle
        $imagePath = $_POST['image_url'];
    }

    try {
        $sql = "UPDATE blog_posts SET title = ?, content = ?, author = ?, image = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$title, $content, $author, $imagePath, $id]);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request method']);
}
