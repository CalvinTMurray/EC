<?php 
ini_set('max_execution_time', 0); //no limit
// create connection, use your own user name and password when connecting
$conn = new mysqli("localhost", "martin", "111111", "api_data");
// check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 


// live data
$api_live_data = file_get_contents('https://tfe-opendata.com/api/v1/vehicle_locations');
// parse the data in JSON format
$parsed_live_data = json_decode($api_live_data);

	
while (True) 
{
	foreach ($parsed_live_data->{'vehicles'} as $item) 
	{
		$service_name = $item->service_name;
		$lat = $item->latitude;
		$long = $item->longitude;
		$date = time();

		$sql = "INSERT INTO live_data_services (service_name, latitude, longitude, time_recorded) VALUES ('$service_name', '$lat', '$long', '$date')";
		$conn->query($sql);
	}
	usleep(60000000); 
}
	
?>

