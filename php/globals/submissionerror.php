<?php
class SubmissionError {
    public $message;
    public $code;

    function __construct($message, $code) {
        $this->message = $message;
        $this->code = $code;
    }
}
?>