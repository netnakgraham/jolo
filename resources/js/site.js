// This is all you.
 // Load the seating data from the JSON file
 fetch('seating.json')
 .then(response => response.json())
 .then(data => {
   const seatingPlanDiv = document.getElementById('seatingPlan');
   
   // Create the seating plan sections
   data.sections.forEach(section => {
	 const sectionDiv = document.createElement('div');
	 sectionDiv.className = 'section';
	 const sectionName = document.createElement('h2');
	 sectionName.textContent = section.name;
	 sectionDiv.appendChild(sectionName);
	 
	 // Create the seating plan rows within each section
	 section.rows.forEach(row => {
	   const rowDiv = document.createElement('div');
	   rowDiv.className = 'row';
	   const rowNumber = document.createElement('span');
	   rowNumber.textContent = 'Row ' + row.number + ': ';
	   rowDiv.appendChild(rowNumber);
	   
	   // Create the seats within each row
	   row.seats.forEach(seat => {
		 const seatDiv = document.createElement('div');
		 seatDiv.className = 'seat ' + seat.status;
		 seatDiv.textContent = seat.number;
		 seatDiv.addEventListener('click', () => {
		   if (seat.status === 'available') {
			 // Temporarily reserve the seat
			 seat.status = 'reserved';
			 seatDiv.className = 'seat reserved';
			 setTimeout(() => {
			   // After a certain period, release the reservation
			   seat.status = 'available';
			   seatDiv.className = 'seat available';
			 }, 5000); // 5 seconds
			 // Send a reservation request to the server
			 const xhr = new XMLHttpRequest();
			 xhr.onreadystatechange = function() {
			   if (xhr.readyState === 4 && xhr.status === 200) {
				 console.log(xhr.responseText);
			   }
			 };
			 xhr

.open('POST', 'reserve-seat.php', true);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('seat=' + encodeURIComponent(seat.number));
}
});
rowDiv.appendChild(seatDiv);
});



   sectionDiv.appendChild(rowDiv);
 });
 
 seatingPlanDiv.appendChild(sectionDiv);
});
});