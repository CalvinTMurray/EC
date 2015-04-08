<?php
/*
$mysql_host = "mysql1.000webhost.com";
$mysql_database = "a1828314_api";
$mysql_user = "a1828314_api";
$mysql_password = "busapi2015";
*/

//$conn = new mysqli("localhost", "martin", "111111", "api_data");

ini_set('max_execution_time', 0); //no limit
// create connection, use your own user name and password when connecting
$conn = new mysqli("mysql1.000webhost.com", "a1828314_api", "busapi2015", "a1828314_api");
// check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

$sql = "SELECT * FROM stops_reliability";
$result = $conn->query($sql);

$json_response = array();

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $row_array['id'] = $row['id'];
		$row_array['name'] = $row['name'];
		$row_array['latitude'] = $row['latitude'];
		$row_array['longitude'] = $row['longitude'];
		$row_array['score'] = $row['score'];

		array_push($json_response,$row_array);

    }
} else {
    echo "0 results";
}

echo json_encode($json_response);

/*
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " Name: " . $row["name"]. " Latitude: " . $row["latitude"]. " Longitude: " . $row["longitude"]. " Reliability: " . $row["score"]. "%" . "<br>";
    }
} else {
    echo "0 results";
}
*/

$conn->close();
?>