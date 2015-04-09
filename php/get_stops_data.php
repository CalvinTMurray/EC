<?php 
ini_set('max_execution_time', 0); //no limit
// create connection, use your own user name and password when connecting
$conn = new mysqli("localhost", "martin", "111111", "api_data");
// check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

// get data from the API end point without authentication (don't know why)
$api_data = file_get_contents('https://tfe-opendata.com/api/v1/stops');
// parse the data in JSON format
$parsed_data = json_decode($api_data);

// loop over each entry in the JSON that is marked as a stop
foreach ($parsed_data->{'stops'} as $item) 
	{ 
		// take the values for each stop
		$id = $item->stop_id;
		$name = $item->name;
		$services = $item->services;
		$lat = $item->latitude;
		$long = $item->longitude;
		
		$sql1 = "UPDATE stops_services_times SET latitude=$lat, longitude=$long WHERE stop_id=$id";
		$conn->query($sql1);
	} 

?>

