<?php
include '../db.php';

$id = intval($_POST['id']);
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';

if (!empty($_FILES['image']['tmp_name'])) {
    $imageData = file_get_contents($_FILES['image']['tmp_name']);
    $stmt = $conn->prepare("UPDATE services SET title = ?, description = ?, image = ? WHERE id = ?");
    $null = NULL;
    $stmt->bind_param("ssbi", $title, $description, $null, $id);
    $stmt->send_long_data(2, $imageData);
} else {
    $stmt = $conn->prepare("UPDATE services SET title = ?, description = ? WHERE id = ?");
    $stmt->bind_param("ssi", $title, $description, $id);
}

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
