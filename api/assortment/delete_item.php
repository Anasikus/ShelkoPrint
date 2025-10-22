<?php
include '../db.php';

$id = $_POST['id'] ?? 0;
if (!$id) exit('no_id');

$stmt = $conn->prepare("DELETE FROM assortment WHERE id = ?");
$stmt->bind_param("i", $id);
echo $stmt->execute() ? "success" : "error";

$stmt->close();
$conn->close();
?>
