<?php
include '../db.php';

$id = intval($_POST['id']);
if ($id <= 0) {
    exit("error: invalid id");
}

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
