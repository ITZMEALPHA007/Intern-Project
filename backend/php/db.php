<?php
$host = "sql312.infinityfree.com";      // MySQL Hostname
$dbname = "if0_40066517_guvi";          // Database name
$username = "if0_40066517";             // MySQL Username
$password = "YOUR_PASSWORD_HERE";       // MySQL Password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode([
        "success" => false,
        "message" => "DB Connection failed: " . $e->getMessage()
    ]));
}
?>
