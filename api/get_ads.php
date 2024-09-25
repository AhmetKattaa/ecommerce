<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");
include 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM ads WHERE active = 1 AND start_date <= CURDATE() AND end_date >= CURDATE()");
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ads);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
