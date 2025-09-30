<?php
header("Content-Type: application/json");
require_once "db.php";       
require_once "redis.php";    


$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['sessionToken'])) {
    echo json_encode(["valid" => false, "message" => "No session token provided"]);
    exit;
}

$sessionToken = $data['sessionToken'];

try {
    $userId = $redis->get("session:$sessionToken");

    if ($userId) {
        $stmt = $conn->prepare("SELECT id, username, email FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        echo json_encode([
            "valid" => true,
            "user" => $user
        ]);
    } else {
        echo json_encode(["valid" => false, "message" => "Invalid or expired session"]);
    }
} catch (Exception $e) {
    echo json_encode(["valid" => false, "message" => "Redis error: " . $e->getMessage()]);
}
?>
