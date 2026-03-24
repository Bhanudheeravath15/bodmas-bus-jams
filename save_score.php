<?php
// Allow JSON requests
header("Content-Type: application/json");

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!$data || !isset($data["score"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid data"
    ]);
    exit;
}

// Extract values
$level = $data["level"] ?? "unknown";
$score = intval($data["score"]);
$time  = intval($data["time"]);
$date  = date("Y-m-d H:i:s");

// Format entry
$entry = "$date | Level: $level | Time: {$time}s | Score: $score\n";

// Save to file
file_put_contents("scores.txt", $entry, FILE_APPEND | LOCK_EX);

// Response
echo json_encode([
    "status" => "success",
    "message" => "Score saved successfully"
]);
``