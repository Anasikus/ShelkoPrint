<?php
include 'db.php';

$sql = "SELECT id, name, review, rating, image, DATE_FORMAT(date, '%d.%m.%Y %H:%i') AS date FROM reviews ORDER BY id DESC";
$result = $conn->query($sql);

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $row['image'] = $row['image'] ? 'data:image/jpeg;base64,' . base64_encode($row['image']) : null;
    $reviews[] = $row;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
?>
