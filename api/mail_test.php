<?php
if (mail("nastyadavydova20@gmail.com", "Test mail", "Тестовое письмо", "From: test@shelkoprint.ru")) {
    echo "✅ Отправлено";
} else {
    echo "❌ Ошибка";
}
?>
