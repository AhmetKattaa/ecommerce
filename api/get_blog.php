<?php
// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Hata raporlamayı etkinleştir
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

try {
    // Belirli bir blog detayını başlık slug ile almak için kontrol
    if (isset($_GET['slug'])) {
        // Slug parametresi varsa, tek bir blog kaydını getir
        $slug = $_GET['slug'];
        $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE slug = :slug");
        $stmt->bindParam(':slug', $slug, PDO::PARAM_STR);
        $stmt->execute();
        $blog = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($blog) {
            // Rastgele iki farklı blogu getir (Bu blog dışında)
            $stmt_related = $pdo->prepare("SELECT * FROM blog_posts WHERE slug != :slug ORDER BY RAND() LIMIT 2");
            $stmt_related->bindParam(':slug', $slug, PDO::PARAM_STR);
            $stmt_related->execute();
            $relatedBlogs = $stmt_related->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'blog' => $blog, 'relatedBlogs' => $relatedBlogs]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Blog not found']);
        }
    } else {
        // Slug parametresi yoksa, tüm blogları getir
        $stmt = $pdo->prepare("SELECT * FROM blog_posts ORDER BY created_at DESC");
        $stmt->execute();
        $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'blogs' => $blogs]);
    }
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
