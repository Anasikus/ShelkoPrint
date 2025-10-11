<?php
include 'db.php';

$id = $_POST['id'];
$title = $_POST['title'];
$description = $_POST['description'];

$imageData = null;
if (!empty($_FILES['image']['tmp_name'])) {
    $imageData = file_get_contents($_FILES['image']['tmp_name']);
}

if ($imageData !== null) {
    $stmt = $conn->prepare("UPDATE services SET title=?, description=?, image=? WHERE id=?");
    $stmt->bind_param("sssi", $title, $description, $imageData, $id);
} else {
    $stmt = $conn->prepare("UPDATE services SET title=?, description=? WHERE id=?");
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
