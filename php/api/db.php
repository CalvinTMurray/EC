<?php
function getDB() {

$dbhost="sql308.byethost9.com";
$dbuser="b9_15611618";
$dbpass="q1w2e3r4";
$dbname="b9_15611618_api";
/*
$dbhost="localhost";
$dbuser="martin";
$dbpass="111111";
$dbname="api_data";
*/
$dbConnection = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass); 
$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
return $dbConnection;
}
?>