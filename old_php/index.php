<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="js/async.js"></script>
    <title>Transferencias Insolectric</title>
</head>
<body id="main-body">
    <!-- <a href="http://transfer.insolectric.com/test.php">PHP test</a> -->
    <?php
    // create session if it's not created
    if (session_id() == '' || !isset($_SESSION)) {
        session_start();
    }

    if (isset($_SESSION['user_id'])) {
        echo '<h1>Hello ' . $_SESSION['user_id'] . '</h1>';
    } else {
        // redirect to login page
        echo "<script>ReplacePage('main-body', './login.php')</script>";
    }
    ?> 
    <!-- <div id="test-div">Test</div>
    <button onclick="ReplacePage('test-div', './test1.php')">1</button>
    <button onclick="ReplacePage('test-div', './test2.php')">2</button> -->
</body>
</html>