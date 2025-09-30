<?php
header("Content-Type: application/json");
require 'db.php';

$input = json_decode(file_get_contents("php://input"), true);
$sessionToken = $input['sessionToken'] ?? '';

if (!$sessionToken) {
    echo json_encode(["success" => false, "message" => "Missing session token"]);
    exit;
}

try {
    $redisKey = "session:" . $sessionToken;
    $redis->del($redisKey); 

    echo json_encode(["success" => true, "message" => "Logged out successfully"]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Logout failed: " . $e->getMessage()]);
}
