<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS başlıkları
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Devamında var olan PHP kodunuz

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = $_POST['product_id'];
    $description = $_POST['description'];
    $discount_percentage = $_POST['discount_percentage'];
    $active = isset($_POST['active']) ? 1 : 0;

    // Eğer bu ürüne ait daha önce bir promosyon varsa, güncelleyelim
    $query = $conn->prepare("SELECT id FROM promotions WHERE product_id = ?");
    $query->bind_param("i", $product_id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        // Promosyon zaten varsa güncelle
        $stmt = $conn->prepare("UPDATE promotions SET description = ?, discount_percentage = ?, active = ? WHERE product_id = ?");
        $stmt->bind_param("sdii", $description, $discount_percentage, $active, $product_id);
    } else {
        // Yeni bir promosyon ekle
        $stmt = $conn->prepare("INSERT INTO promotions (product_id, description, discount_percentage, active) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isdi", $product_id, $description, $discount_percentage, $active);
    }

    if ($stmt->execute()) {
        echo json_encode(["message" => "Promosyon başarıyla kaydedildi."]);
    } else {
        echo json_encode(["error" => "Promosyon kaydedilemedi."]);
    }

    $stmt->close();
    $conn->close();
}
?>
