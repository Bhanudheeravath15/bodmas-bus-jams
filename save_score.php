<?php
$data = json_decode(file_get_contents("php://input"), true);
$score = $data["score"] ?? 0;

file_put_contents("scores.txt", "Score: $score\n", FILE_APPEND);
echo json_encode(["status" => "saved"]);