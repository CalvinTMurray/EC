<?php 
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
		// display the values on the screen
		echo "Stop id: ";
		echo $id;
		echo ", Stop name: ";
		echo $name;
		$service_list = ' ';
		echo ", Services: ";
		// implode() turns the PHP array into a string
		print_r(implode($services, ","));
		echo "<br>";
		$services = implode($services, ",");
		// create the query to insert the data into the DB
		$sql1 = "INSERT INTO stops_data (id, name, services) VALUES ('$id', '$name', '$services')";
		// execute the query
		$conn->query($sql1);
	} 
?>

