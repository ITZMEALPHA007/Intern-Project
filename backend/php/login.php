<?php
header("Content-Type: application/json");

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/redis.php';

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (!$username || !$password) {
    echo json_encode([
        "success" => false,
        "errorType" => "missing_fields",
        "message" => "Please enter both username and password"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username OR email = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            "success" => false,
            "errorType" => "user_not_found",
            "message" => "User not found"
        ]);
        exit;
    }

    if (!password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => false,
            "errorType" => "invalid_password",
            "message" => "Incorrect password"
        ]);
        exit;
    }

    $sessionToken = bin2hex(random_bytes(32));
    $redisKey = "session:" . $sessionToken;
    $redis->setex($redisKey, 3600, $user['id']); 

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "sessionToken" => $sessionToken,
        "userId" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email']
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "errorType" => "server_error",
        "message" => "Server error: " . $e->getMessage()
    ]);
}
