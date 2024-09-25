<?php
// Add headers to support CORS
header("Access-Control-Allow-Origin: http://localhost:5173"); // React uygulamanızın çalıştığı adres
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

// Decode the JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid JSON format: ' . json_last_error_msg()]);
    exit;
}

// Check if the required field is present
if (!isset($data['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Missing required field: id']);
    exit;
}

$id = $data['id'];

try {
    $sql = "DELETE FROM products WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
