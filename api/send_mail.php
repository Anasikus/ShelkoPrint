<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php'; // убедись, что PHPMailer установлен через composer

header('Content-Type: application/json; charset=utf-8');

// Настройки получателя
$to = "nastyadavydova20@gmail.com"; // адрес, куда будут приходить письма
$subjectPrefix = "Обратная связь с сайта ShelkoPrint";

// Проверяем метод
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Метод не разрешён"]);
    exit;
}

// Получаем данные формы
$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$subject = trim($_POST["subject"] ?? "Без темы");
$message = trim($_POST["message"] ?? "");

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(["error" => "Пожалуйста, заполните все обязательные поля."]);
    exit;
}

// === SMTP НАСТРОЙКИ ===
// ⚠️ ОБЯЗАТЕЛЬНО поменяй эти данные под свой почтовый ящик!
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();

    // Пример: Gmail SMTP
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'your_email@gmail.com'; // твой адрес Gmail
    $mail->Password = 'your_app_password'; // пароль приложения (не обычный!)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // От кого отправляем
    $mail->setFrom('your_email@gmail.com', 'ShelkoPrint');
    // Кому
    $mail->addAddress($to);

    // Ответить на
    $mail->addReplyTo($email, $name);

    // Контент письма
    $mail->isHTML(false);
    $mail->Subject = "$subjectPrefix: $subject";
    $mail->Body = "
Имя: $name
Email: $email
Тема: $subject

Сообщение:
$message
";

    // Отправляем
    $mail->send();

    http_response_code(200);
    echo json_encode(["success" => "Сообщение успешно отправлено!"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Ошибка при отправке письма: " . $mail->ErrorInfo]);
}
?>
