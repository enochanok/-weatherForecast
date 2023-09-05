<?php
	// Include connection 
	include 'connection.php';
	
	// Get data from POST - Check if the request method is POST
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		// City name from URL
		// Read JSON data from the request body
		$jsonData = file_get_contents("php://input"); 
		if ($jsonData === false) {
			throw new Exception("Error reading input data"); // Error handling if JSON data cannot be read
		}

		$data = json_decode($jsonData, true); // Decode the JSON data into an associative array
		if ($data === null) {
			throw new Exception("Error decoding JSON data"); // Error handling if JSON data cannot be decoded
		}
		$city = $data['city']; // Extract the 'city' parameter from the JSON data
		
		// SQL query to fetch weather details for a specific city
		$query = "SELECT * FROM weatherDetail WHERE city='$city' GROUP BY DATE(date_accessed) ORDER BY date_accessed DESC LIMIT 7;";
	
		$sql = mysqli_query($connection, $query); // Execute the SQL query
		$rows = array(); // Initialize an array to store query results
		
		// Collecting rows - Loop through the query results and store them in the 'rows' array
		while ($row = mysqli_fetch_assoc($sql)) {
			$rows[] = $row;
		}
		
		// Send data back as JSON response
		header('Content-Type: application/json'); // Set the response content type as JSON
		echo json_encode($rows); // Encode the 'rows' array as JSON and send it as the response
	    
	    $connection->close(); // Close the database connection
	} 

