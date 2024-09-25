<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? null;
$phone = $data['phone'] ?? null;
$address = $data['address'] ?? null;
$payment_method = $data['payment_method'] ?? 'credit_card';
$total_amount = $data['total_amount'] ?? 0;
$products = $data['products'] ?? [];

if (!$email || !$phone || !$address || !$total_amount) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $pdo->beginTransaction();

    foreach ($products as $product) {
        $stmt = $pdo->prepare("INSERT INTO orders (product_id, email, phone, address, total_amount, payment_method, order_date) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$product['id'], $email, $phone, $address, $total_amount, $payment_method]);
    }

    $pdo->commit();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
