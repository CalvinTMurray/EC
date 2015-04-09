<?php
require 'db.php';
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/scores','getScores');

$app->run();

// GET http://www.yourwebsite.com/api/users
function getScores() {
	$sql = "SELECT * FROM stops_reliability";
	try {
		$db = getDB();
		$stmt = $db->query($sql); 
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"stops": ' . json_encode($users) . '}';
	} catch(PDOException $e) {
	//error_log($e->getMessage(), 3, '/var/tmp/phperror.log'); //Write error log
	echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


?>