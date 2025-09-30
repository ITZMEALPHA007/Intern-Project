<?php
header("Content-Type: application/json");
require 'db.php';   

$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$username || !$email || !$password) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR username = :username LIMIT 1");
$stmt->execute(['email' => $email, 'username' => $username]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "User already exists"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:username, :email, :password)");
    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => $hashedPassword
    ]);
    $userId = $pdo->lastInsertId();

    $redis->hMSet("user:$userId", [
        "username" => $username,
        "email" => $email
    ]);

    echo json_encode(["success" => true, "message" => "Registration successful"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
