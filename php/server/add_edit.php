<?php
include 'php/globals/globals.php';
include 'php/globals/student.php';
include 'php/globals/submissionerror.php';

$response_status = true;
$student = new Student();
$errors = array();
$errorArr = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!GoodSubmit() || !GoodDB()) {
        $response_status = false;
    }

    foreach ($errors as $error){
        array_push($errorArr, (array)$error);
    }
    
    $data = array(
        "status" => $response_status,
        "errors" => $errorArr,
        "student" => (array)$student
    );

    header('Content-type: application/json');
    print_r(json_encode($data));
}

function GoodSubmit() : bool {
    $result = true;
    global $student, $errors;

    if (!ValidString($_POST["fname"])) {
        array_push($errors, new SubmissionError("Invalid first name", 100));
        $result = false;
    }
    else {
        $student->fname = $_REQUEST["fname"] ?? null;
    }

    if (!ValidString($_POST["lname"])) {
        array_push($errors, new SubmissionError("Invalid last name", 101));
        $result = false;
    }
    else {
        $student->lname = $_POST["lname"] ?? null;
    }

    $student->studentid = $_POST["studentid"] ?? null;
    $student->group = $_POST["group"] ?? null;
    $student->gender = $_POST["gender"] ?? null;
    $student->birthday = $_POST["birthday"] ?? null;
    
    return $result;
}

function ValidString($str) : bool {
    if (empty($str) || !ctype_alpha($str)) {
        return false;
    }
    return true;
}

function GoodDB() : bool {
    $result = true;
    global $student, $errors;

    if (ExistsInDB($student)) {
        array_push($errors, new SubmissionError("Student already exists in the database.", 200));
        $result = false;
    }
    else {
        if($_POST["studentid"] == "") {
            AddToStudentDB($student);
        }
        else {
            if (!EditInStudentDB($student)) {
                array_push($errors, new SubmissionError("Student doesn't exist in the database.", 201));
                $result = false;
            } 
        }
    }
    
    return $result;
}

function ExistsInDB($std) {
    $conn = new MySQLi(SERVERNAME, USERNAME, PASSWORD, DATABASE);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT * FROM students WHERE id!=? AND fname=? AND lname=? AND gender=? AND birthday=?");
    $stmt->bind_param("issis", $std->studentid, $std->fname, $std->lname, $std->gender, $std->birthday);
    $stmt->execute();
    $stmt->store_result();
    
    $exists = false;
    if ($stmt->num_rows() > 0) {
        $exists = true;
    }

    $stmt->close();
    $conn->close();

    return $exists;
}

function AddToStudentDB($std) {
    $conn = new MySQLi(SERVERNAME, USERNAME, PASSWORD, DATABASE);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO students (studygroup, fname, lname, gender, birthday) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issis", $std->group, $std->fname, $std->lname, $std->gender, $std->birthday);
    $stmt->execute();
    
    $std->studentid = $conn->insert_id;
    
    $stmt->close();
    $conn->close();
}

function EditInStudentDB($std) {
    $conn = new MySQLi(SERVERNAME, USERNAME, PASSWORD, DATABASE);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT * FROM students WHERE id=? AND studygroup=? AND fname=? AND lname=? AND gender=? AND birthday=?");
    $stmt->bind_param("iissis", $std->studentid, $std->group, $std->fname, $std->lname, $std->gender, $std->birthday);
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows() == 0) {
        $stmt->close();

        $stmt = $conn->prepare("UPDATE students SET studygroup=?, fname=?, lname=?, gender=?, birthday=? WHERE id=?");
        $stmt->bind_param("issisi", $std->group, $std->fname, $std->lname, $std->gender, $std->birthday, $std->studentid);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->affected_rows == 0) {
            return false;
        }
    
        $stmt->close();
    }
    
    $conn->close();

    return true;
}
?>