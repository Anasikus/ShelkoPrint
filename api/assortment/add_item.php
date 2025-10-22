<?php
include '../db.php';

$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? '';

if (!$title || !$description || !$price) {
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

$stmt = $conn->prepare("INSERT INTO assortment (title, description, price, image) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssds", $title, $description, $price, $imagePath);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error";
}
$stmt->close();
$conn->close();
?>
