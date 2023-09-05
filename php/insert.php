<?php
	// Include connection 
	include 'connection.php';
	
	// Check if the HTTP request method is POST
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
	    try {
	        $jsonData = file_get_contents("php://input"); // Read JSON data from the request body
			
			// If no JSON data is received, throw an exception
	        if ($jsonData === false) {
	            throw new Exception("Error reading input data");
	        }
			
			// Decode the received JSON data into an associative array
	        $data = json_decode($jsonData, true);
			
			// If JSON decoding fails, throw an exception
	        if ($data === null) {
	            throw new Exception("Error decoding JSON data");
	        }
			
			// Extract data from the JSON and construct an SQL INSERT query
			$date = date('Y-m-d'); // Get the current date
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
			
			// Execute the SQL INSERT query
	        if ($connection->query($sql) === TRUE) {
				// If the query is successful, send a JSON response indicating success
				header('Content-Type: application/json');
	            echo json_encode(['success' => true, 'message' => 'Data processed successfully']);
	        } else {
				// If the query fails, throw an exception
	            throw new Exception("Error inserting data");
	        }
			
	        $connection->close(); // Close the database connection
	    } catch (Exception $e) {
	        http_response_code(400); // Set the HTTP response code to 400 (Bad Request)
	        echo json_encode(['success' => false, 'error' => $e->getMessage()]); // Send a JSON error response
	    }
	} else {
	    http_response_code(405); // Set the HTTP response code to 405 (Method Not Allowed)
	    echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed']); // Send a JSON error response
	}

