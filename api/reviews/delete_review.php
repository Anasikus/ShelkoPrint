<?php
header('Content-Type: text/plain');

// Подключаем БД через mysqli
include '../db.php'; // здесь создаётся $conn

// Получаем ID отзыва из POST-запроса
$id = $_POST['id'] ?? null;

if (!$id) {
    echo "Ошибка: не указан ID";
    exit;
}

// Подготавливаем запрос и удаляем запись
$stmt = $conn->prepare("DELETE FROM reviews WHERE id = ?");
if (!$stmt) {
    echo "Ошибка подготовки запроса: " . $conn->error;
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "Ошибка при удалении: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
