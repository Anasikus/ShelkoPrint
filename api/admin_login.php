<?php
session_start();

$admin_username = "admin";
$admin_password = "12345"; // измени на свой

$data = json_decode(file_get_contents("php://input"), true);

if ($data["username"] === $admin_username && $data["password"] === $admin_password) {
    $_SESSION["is_admin"] = true;
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Неверный логин или пароль"]);
}
?>
