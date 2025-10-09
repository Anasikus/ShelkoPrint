<?php
$servername = "localhost";
$username = "root"; // если у тебя другой пользователь — поменяй
$password = "";     // если есть пароль — укажи его
$dbname = "ShelkoPrint";

$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Ошибка подключения: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
