<?php
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $review = $_POST['review'] ?? '';
    $rating = $_POST['rating'] ?? 0;

    // Проверяем, есть ли изображение
    $imageData = null;
    if (!empty($_FILES['image']['tmp_name'])) {
        $imageData = file_get_contents($_FILES['image']['tmp_name']);
    }

    // Подготовка запроса
    $stmt = $conn->prepare("INSERT INTO reviews (name, review, rating, image) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $name, $review, $rating, $imageData);
    $stmt->send_long_data(3, $imageData);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Ошибка: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
