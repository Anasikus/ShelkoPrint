<?php
include '../db.php';

$result = $conn->query("SELECT * FROM assortment ORDER BY id DESC");
$items = [];

while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
