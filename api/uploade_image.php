<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        // Resim dosyasını al
        $image = $_FILES['image'];
        $imageName = basename($image['name']);
        $uploadDir = __DIR__ . '/uploads/';
        $uploadFile = $uploadDir . $imageName;

        // Eğer klasör yoksa oluştur
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Resmi yükle
        if (move_uploaded_file($image['tmp_name'], $uploadFile)) {
            $imageURL = 'http://localhost/R/uploads/' . $imageName;
            echo json_encode(['success' => true, 'url' => $imageURL]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to upload image']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No image uploaded']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
