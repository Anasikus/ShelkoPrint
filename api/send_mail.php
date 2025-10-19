<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Метод не разрешён"]);
    exit;
}

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$subject = trim($_POST["subject"] ?? "Без темы");
$message = trim($_POST["message"] ?? "");

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(["error" => "Заполните все обязательные поля"]);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'mail.твойдомен.ru';
    $mail->SMTPAuth = true;
    $mail->Username = 'contacts@shelko-print.ru';
    $mail->Password = 'dE5iZ4hI0t';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // или STARTTLS
    $mail->Port = 465; // если STARTTLS, то 587

    $mail->setFrom('info@твойдомен.ru', 'ShelkoPrint');
    $mail->addAddress("nastyadavydova20@gmail.com");
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = "Обратная связь с сайта ShelkoPrint: $subject";
    $mail->Body = "Имя: $name\nEmail: $email\nТема: $subject\n\nСообщение:\n$message";

    $mail->send();
    http_response_code(200);
    echo json_encode(["success" => "Сообщение отправлено"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $mail->ErrorInfo]);
}
