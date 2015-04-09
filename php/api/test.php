<?php
ini_set('max_execution_time', 0); //no limit

function Haversine($start, $finish) {
 
    $theta = $start[1] - $finish[1]; 
    $distance = (sin(deg2rad($start[0])) * sin(deg2rad($finish[0]))) + (cos(deg2rad($start[0])) * cos(deg2rad($finish[0])) * cos(deg2rad($theta))); 
    $distance = acos($distance); 
    $distance = rad2deg($distance); 
    $distance = $distance * 60 * 1.1515; 
 
    return round($distance, 2);
 
}

$conn = new mysqli("localhost", "martin", "111111", "api_data");
// check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM live_data_services";
$result = $conn->query($sql);

$sql2 = "SELECT * FROM stops_data";
$result2 = $conn->query($sql2);

$ids = array();

if ($result2->num_rows > 0) {
    // output data of each row
    while($row = $result2->fetch_assoc()) {
       echo $row['id'];
       echo "<br>";
       array_push($ids,$row['id']);
    }
} else {
    echo "0 results";
}
echo "<br>";
echo "First: " . $ids[1];
echo "<br>";

for ($i = 0; $i <= 5693; $i++) {

	$select = $ids[$i];
	$sql5 = "SELECT * FROM live_data_services WHERE stop_id=$select ";
	$result5 = $conn->query($sql5);

	$total = 0;

	while($row2 = $result5->fetch_assoc()) {
       $total = $total + $row2['score'];
    }

	echo $total;


}

/*
$times = array("8:00","8:15","8:30","8:45","9:00","9:15","9:30","9:45","10:00","16:00","16:15","16:30" ,"16:45", "17:00","17:15","17:30" ,"17:45" ,"18:00");
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
    	$service_name = $row['service_name'];
    	$timestamp = $row['time_recorded'];
    	$hour = $timestamp / 3600 % 24;
    	$minute = $timestamp / 60 % 60;
    	$time = $hour . ":" . $minute;
    	if (in_array($time, $times)) {
    		$lat = $row['latitude'];
    		$long = $row['longitude'];
    		echo "Time: " . $time;
    		echo "<br>";
    		$lowest = 100;
    		$sql3 = "SELECT * FROM stops_services_times WHERE service_name=$service_name AND time='17:15'";
			$result3 = $conn->query($sql3);
			if ($result3->num_rows > 0) {
    			// output data of each row
    			while($row2 = $result3->fetch_assoc()) {
    				$stop_lat = $row2['latitude'];
    				$stop_long = $row2['longitude'];
    				$stop_id = $row2['stop_id'];
    				$stop_service = $row2['service_name'];
		
    				$bus = array($lat, $long);
					$stop = array($stop_lat, $stop_long);
 
					$distance = Haversine($bus, $stop);
					
					if ($distance < $lowest){
						$lowest = $distance * 1.609344;
					}
					$sql4 = "UPDATE stops_services_times SET score=$lowest WHERE service_name=$stop_service AND stop_id=$stop_id AND time=$time";
					$conn->query($sql4);
					echo "<br>";
					echo "Score: " . $lowest;
    			}
				} else {
    				echo "0 results";
				}
       		
    	}
       	
    }
} else {
    echo "0 results";
}
*/


	


echo implode(",",$ids);
echo "<br>";
echo $ids[1];
echo "<br>";
echo count($ids);
echo "<br>";
echo 'https://tfe-opendata.com/api/v1/timetables/' . $ids[0];
echo "<br>";
echo date_default_timezone_get();

/*
for ($i = 0; $i <= 5693; $i++) {
	$api_string = 'https://tfe-opendata.com/api/v1/timetables/' . $ids[$i];
    $api_data = file_get_contents($api_string);
	// parse the data in JSON format
	$parsed_data = json_decode($api_data);
	foreach ($parsed_data->{'departures'} as $item) 
	{ 
		
		$service_name = $item->service_name;
		$time = $item->time;
		
		$times = array("8:00","8:15","8:30","8:45","9:00","9:15","9:30","9:45","10:00","16:00","16:15","16:30" ,"16:45", "17:00","17:15","17:30" ,"17:45" ,"18:00");
		
		if (in_array($time, $times))
		{	
			$sql1 = "INSERT INTO stops_services_times (stop_id, service_name, time) VALUES ('$ids[$i]', '$service_name', '$time')";
			// execute the query
			$conn->query($sql1);
		}
	} 
}
*/
$conn->close();


$start = array(55.950428, -3.205781);
$finish = array(55.952578, -3.193443);
 
$distance = Haversine($start, $finish);
echo "<br>";
echo $distance * 1.609344;
?>