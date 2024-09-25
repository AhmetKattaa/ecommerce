<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db.php';

try {
    $sql = "
        SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.price, 
            p.stock, 
            IF(LEFT(p.image, 4) = 'http', p.image, CONCAT('http://localhost/R/images/', p.image)) AS image,  /* Eğer tam URL değilse başına yol ekle */
            IFNULL(pr.description, '') AS promotion_description, 
            IFNULL(pr.discount_percentage, 0) AS promotion_discount_percentage, 
            IFNULL(pr.active, 0) AS promotion_active 
        FROM products p
        LEFT JOIN promotions pr ON p.id = pr.product_id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($products);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error fetching products: ' . $e->getMessage()]);
}
?>
