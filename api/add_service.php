<?php
include 'db.php';

$title = $_POST['title'];
$description = $_POST['description'];

$imageData = null;
if (!empty($_FILES['image']['tmp_name'])) {
    $imageData = file_get_contents($_FILES['image']['tmp_name']);
}

// Подготовка запроса
$stmt = $conn->prepare("INSERT INTO services (title, description, image) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $title, $description, $imageData);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
