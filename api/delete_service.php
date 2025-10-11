<?php
include 'db.php';

$id = $_POST['id'];

$stmt = $conn->prepare("DELETE FROM services WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
