<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Если пришёл preflight-запрос — выходим сразу
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include '../db.php';

// Проверим, что форма действительно отправлена методом POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "error: Неверный метод запроса";
    exit;
}

// Получаем данные из формы
$title = isset($_POST['title']) ? trim($_POST['title']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : '';
$imageData = null;

// Проверим, что реально пришло
// (можно временно включить для отладки)
// file_put_contents('debug.log', print_r($_POST, true));

if (!empty($_FILES['image']['tmp_name'])) {
    $imageData = file_get_contents($_FILES['image']['tmp_name']);
}

// Проверяем, что обязательные поля заполнены
if ($title === '' || $description === '') {
    echo "error: Пустые поля";
    exit;
}

// Подготавливаем SQL-запрос
$stmt = $conn->prepare("INSERT INTO services (title, description, image, created_at) VALUES (?, ?, ?, NOW())");
if (!$stmt) {
    echo "error: " . $conn->error;
    exit;
}

// Привязываем параметры (только 'sss', бинарные данные передаются корректно)
$stmt->bind_param("sss", $title, $description, $imageData);

// Выполняем запрос
if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
