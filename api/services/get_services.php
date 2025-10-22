<?php
include '../db.php';

$result = $conn->query("SELECT id, title, description, image FROM services ORDER BY id DESC");

$services = [];
while ($row = $result->fetch_assoc()) {
    if ($row['image'] !== null) {
        $row['image'] = 'data:image/jpeg;base64,' . base64_encode($row['image']);
    }
    $services[] = $row;
}

echo json_encode($services, JSON_UNESCAPED_UNICODE);
$conn->close();
?>
