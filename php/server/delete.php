<?php
include 'php/globals/globals.php';
include 'php/globals/submissionerror.php';

$response_status = true;
$errors = array();
$errorArr = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $studentid = $_REQUEST["studentid"] ?? null;

    if (!GoodDB($studentid)) {
        $response_status = false;
    }

    foreach ($errors as $error){
        array_push($errorArr, (array)$error);
    }

    $student = array (
        "studentid" => $studentid
    );

    $data = array(
        "status" => $response_status,
        "errors" => $errorArr,
        "student" => $student
    );

    header('Content-type: application/json');
    print_r(json_encode($data));
}

function GoodDB($id) { 
    $result = true; 
    global $errors;

    if (!DeleteFromStudentDB($id)) {
        array_push($errors, new SubmissionError("Student doesn't exist in the database.", 201));
        $result = false;
    }

    return $result;
}

function DeleteFromStudentDB($id) {
    $conn = new MySQLi(SERVERNAME, USERNAME, PASSWORD, DATABASE);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("DELETE FROM students WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        return false;
    }
    
    $stmt->close();
    $conn->close();

    return true;
}
?>