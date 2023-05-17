/*const shoppingCart = [];

// Load the seating data from the JSON file
fetch('seating.json')
  .then(response => response.json())
  .then(data => {
	const seatingPlanDiv = document.getElementById('seatingPlan');
	const shoppingCartUl = document.getElementById('shoppingCart');

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

		  // Add reserved seat ID to shopping cart
		  shoppingCart.push(seat.number);
		  const cartItem = document.createElement('li');
		  cartItem.textContent = seat.number;
		  shoppingCartUl.appendChild(cartItem);
		}
	  });
	  rowDiv.appendChild(seatDiv);

	  // Add aisle breaks

	  console.log(section.aisleBreaks);
	  console.log(seat.number);
	  if (section.aisleBreaks.includes(seat.number)) {
		console.log("yo");

		const aisleBreak = document.createElement('span');
		aisleBreak.textContent = '|  | ';
		rowDiv.appendChild(aisleBreak);
	  }
	});

	sectionDiv.appendChild(rowDiv);
  });

  seatingPlanDiv.appendChild(sectionDiv);
});
});*/

// Your JSON seating plan
var seatingPlan = {
    "venueName": "Example Theater",
    "stage": {
        "rows": 10,
        "seatsPerRow": 12,
    },
	"sections": [
		{
		  "name": "Front",
		  "position": "front",
		  "rows": 10,
		  "seatsPerRow": 10,
		  "aisleBreaks": []
		},
		{
		  "name": "Side Left",
		  "position": "left",
		  "rows": 5,
		  "seatsPerRow": 5,
		  "aisleBreaks": [3]
		},
		{
		  "name": "Side Right",
		  "position": "right",
		  "rows": 5,
		  "seatsPerRow": 5,
		  "aisleBreaks": [3]
		},
		{
		  "name": "Rear",
		  "position": "rear",
		  "rows": 8,
		  "seatsPerRow": 12,
		  "aisleBreaks": []
		}
	  ]
};
 
// Generate the seating plan HTML
function generateSeatingPlan() {
	seatingPlan.sections.forEach(function(section) {
	  var sectionElement = document.createElement('div');
	  sectionElement.classList.add('section');
	  sectionElement.classList.add(section.position);
  
	  // Set section name
	  var sectionNameElement = document.createElement('h3');
	  sectionNameElement.textContent = section.name;
	  sectionElement.appendChild(sectionNameElement);
  
	  // Generate seats for the section
	  for (var row = 1; row <= section.rows; row++) {
		var rowElement = document.createElement('div');
		rowElement.classList.add('row');
  
		for (var seat = 1; seat <= section.seatsPerRow; seat++) {
		  var seatElement = document.createElement('div');
		  seatElement.classList.add('seat');
		  seatElement.dataset.status = 'available';
		  seatElement.dataset.section = section.name;
		  seatElement.dataset.row = row;
		  seatElement.dataset.seat = seat;
		  seatElement.addEventListener('click', reserveSeat);
  
		  // Check if the seat is booked
		  var isBooked = isSeatBooked(section.name, row, seat);
		  if (isBooked) {
			seatElement.classList.add('reserved');
			seatElement.dataset.status = 'booked';
		  }
  
		  // Apply aisle breaks
		  if (section.aisleBreaks.includes(seat)) {
			seatElement.style.marginRight = '30px';
		  }
  
		  rowElement.appendChild(seatElement);
		}
  
		sectionElement.appendChild(rowElement);
	  }
  
	  document.body.appendChild(sectionElement);
	});
  }
  
  // Check if a seat is booked
  function isSeatBooked(section, row, seat) {
	// Simulating the booked seats data from the server
	var bookedSeats = [
	  { section: 'Front', row: 1, seat: 5 },
	  { section: 'Side Left', row: 3, seat: 2 },
	  { section: 'Rear', row: 2, seat: 9 }
	  // Add more booked seats as needed
	];
  
	for (var i = 0; i < bookedSeats.length; i++) {
	  var bookedSeat = bookedSeats[i];
	  if (
		bookedSeat.section === section &&
		bookedSeat.row === row &&
		bookedSeat.seat === seat
	  ) {
		return true;
	  }
	}
  
	return false;
  }
  
  // Reserve a seat
  function reserveSeat() {
	if (this.dataset.status !== 'available') {
	  return;
	}
  
	this.classList.add('selected');
	this.dataset.status = 'reserved';
  
	// Update the JSON data or send a request to the server to mark the seat as reserved
	var section = this.dataset.section;
	var row = parseInt(this.dataset.row);
	var seat = parseInt(this.dataset.seat);
  
	// Update the seating plan display
	generateSeatingPlan();
  }
  
  // Add seat to shopping cart
  function addToCart(section, row, seat) {
	var cartItemsElement = document.getElementById('cart-items');
  
	// Create cart item element
	var cartItemElement = document.createElement('li');
	cartItemElement.textContent = section + ' - Row ' + row + ', Seat ' + seat;
  
	cartItemsElement.appendChild(cartItemElement);
  }
  
  // Purchase seats in the shopping cart
  function purchase() {
	var cartItemsElement = document.getElementById('cart-items');
	var cartItems = cartItemsElement.getElementsByTagName('li');
  
	// Perform the purchase logic here, e.g., send a request to the server with the selected seats
  
	// Clear the shopping cart
	while (cartItems.length > 0) {
	  cartItems[0].remove();
	}
  }
  
  
	  // Generate the seating plan on page load
window.onload = function () {
    generateSeatingPlan();
};
