<?php
include '../db.php';

$id = $_POST['id'] ?? 0;
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';

if (!$id || !$title || !$description || !$price) {
    exit('missing_fields');
}

$imagePath = null;
if (!empty($_FILES['image']['name'])) {
    $uploadDir = '../../uploads/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $fileName = time() . '_' . basename($_FILES['image']['name']);
    $targetFile = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $imagePath = 'uploads/' . $fileName;
    }
}

if ($imagePath) {
    $stmt = $conn->prepare("UPDATE assortment SET title=?, description=?, price=?, image=? WHERE id=?");
    $stmt->bind_param("ssdsi", $title, $description, $price, $imagePath, $id);
} else {
    $stmt = $conn->prepare("UPDATE assortment SET title=?, description=?, price=? WHERE id=?");
    $stmt->bind_param("ssdi", $title, $description, $price, $id);
}

echo $stmt->execute() ? "success" : "error";
$stmt->close();
$conn->close();
?>
