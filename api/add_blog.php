<?php
// Hata raporlamayı açalım
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

// Slug oluşturmak için fonksiyon
function createSlug($string) {
    $string = strtolower(trim($string));
    $string = preg_replace('/[^a-z0-9-]/', '-', $string);
    $string = preg_replace('/-+/', '-', $string);
    return $string;
}

// HTML etiketlerini temizleyen fonksiyon
function stripHtmlTags($text) {
    return $text ? strip_tags($text) : ""; // HTML etiketlerini temizler
}

// Gerekli alanların kontrolü
if (isset($_POST['title'], $_POST['content'], $_POST['author'])) {
    $title = stripHtmlTags($_POST['title']); // Başlığı HTML etiketlerinden temizle
    $content = $_POST['content'];
    $author = $_POST['author'];
    $slug = createSlug($title); // Slug'ı başlıktan oluştur

    $imagePath = '';

    // Resim URL'si varsa ekleyelim, yoksa boş bırakabiliriz
    if (isset($_POST['image_url']) && filter_var($_POST['image_url'], FILTER_VALIDATE_URL)) {
        $imagePath = $_POST['image_url'];
    } else {
        $imagePath = null; // Resim URL'si boş olabilir
    }

    try {
        // Blog kaydını ekleyelim
        $sql = "INSERT INTO blog_posts (title, content, author, image, slug) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$title, $content, $author, $imagePath, $slug]);
        $lastId = $pdo->lastInsertId();

        // Yeni blogu döndürüyoruz
        $newBlog = [
            'id' => $lastId,
            'title' => $title,
            'content' => $content,
            'author' => $author,
            'image' => $imagePath,
            'slug' => $slug
        ];

        echo json_encode(['success' => true, 'blog' => $newBlog]);
    } catch (Exception $e) {
        echo "Database error: " . $e->getMessage();
        http_response_code(500); // Internal Server Error
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Missing required fields']);
}
?>
