<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include 'db.php';

try {
    $sql = "SELECT id, name FROM categories";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($categories);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Error fetching categories: ' . $e->getMessage()
    ]);
}
