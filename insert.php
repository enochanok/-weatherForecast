<?php
	// Include connection
	include 'connection.php';
	// Get data from POST
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
	    try {
	        $jsonData = file_get_contents("php://input");
			// If no JSON
	        if ($jsonData === false) {
	            throw new Exception("Error reading input data");
	        }
			// Unparse data
	        $data = json_decode($jsonData, true);
	        if ($data === null) {
	            throw new Exception("Error decoding JSON data");
	        }
			// SQL query
			$date = date('Y-m-d');
			$sql = "INSERT INTO weatherDetail (
				city, 
				country,
				weather_description,
				temperature,
				humidity,
				pressure,
				wind_speed,
				icon,
				date_accessed
			
			) VALUES (
				'{$data['name']}',
				'{$data['sys']['country']}',
				'{$data['weather'][0]['description']}',
				'{$data['main']['temp']}',
				'{$data['main']['humidity']}',
				'{$data['main']['pressure']}',
				'{$data['wind']['speed']}',
				'{$data['weather'][0]['icon']}',
				'$date'
			)";
	        if ($connection->query($sql) === TRUE) {
				// If successful, send True
				header('Content-Type: application/json');
	            echo json_encode(['success' => true, 'message' => 'Data processed successfully']);
	        } else {
				// If unsuccessful, send False
	            throw new Exception("Error inserting data: ");
	        }
	        $connection->close();
	    } catch (Exception $e) {
	        http_response_code(400);
	        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
	    }
	} else {
	    http_response_code(405);
	    echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed']);
	}
