<?php
	// Include connection
	include 'connection.php';
	// Get data from POST
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
	 
			// City name from url
	        $jsonData = file_get_contents("php://input");
	        if ($jsonData === false) {
	            throw new Exception("Error reading input data");
	        }

	        $data = json_decode($jsonData, true);
	        if ($data === null) {
	            throw new Exception("Error decoding JSON data");
	        }
	        $city = $data['city'];
			// SQL query
			// $query = "SELECT 
			// 		MAX(id) as id, city, country, temperature, weather_description, humidity, pressure, wind_speed,
			// 	    AS date_accessed, icon
			// 	FROM 
			// 		weatherDetail
			// 	WHERE 
			// 		city = '$city' 
			// 	GROUP BY 
			// 		DATE(date_accessed)
			// 	ORDER BY 
			// 		date_accessed DESC;";
			$query = "SELECT * from weatherDetail where city='$city' GROUP BY DATE(date_accessed);";
			// $query = "SELECT * FROM weatherDetail;";
			// Query exceution
			$sql = mysqli_query($connection, $query);
			$rows = array();
			// Collecting rows
			while ($row = mysqli_fetch_assoc($sql)) {
			    $rows[] = $row;
			}
			// Send data back
			header('Content-Type: application/json');
			echo json_encode($rows);
	        $connection->close();
	    } 

// select * from weather group by city order by date desc limit 7