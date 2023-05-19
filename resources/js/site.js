    // Function to create a grid of seats
    function createSeatingGrid(x, y) {
		const seatingPlan = document.getElementById('seatingPlan');
		seatingPlan.innerHTML = '';
  
		for (let i = 0; i < y; i++) {
		  const row = document.createElement('div');
		  row.classList.add('flex');
		  
		  for (let j = 0; j < x; j++) {
			const seat = document.createElement('div');
			seat.classList.add('w-10', 'h-10', 'border', 'text-center');
			seat.innerText = `Row ${i + 1}, Seat ${j + 1}`;
  
			// Add event listener to seat
			seat.addEventListener('click', function () {
			  console.log(`Section: ${this.dataset.section}, Row: ${this.dataset.row}, Seat: ${this.dataset.seat}`);
			});
  
			row.appendChild(seat);
		  }
  
		  seatingPlan.appendChild(row);
		}
	  }
  
	  // Add event listener to the "Add Section" button
	  document.getElementById('addSectionBtn').addEventListener('click', function () {
		const sectionName = document.getElementById('sectionName').value;
		const sectionRows = parseInt(document.getElementById('sectionRows').value);
		const sectionSeats = parseInt(document.getElementById('sectionSeats').value);
		const aisleBreaks = document.getElementById('aisleBreaks').value.split(',');
  
		const seatingPlan = document.getElementById('seatingPlan');
		const section = document.createElement('div');
		section.classList.add('mt-8');
		section.innerHTML = `<h2 class="text-xl font-bold">${sectionName}</h2>`;
  
		createSeatingGrid(sectionSeats, sectionRows);
  
		// Add rotation and draggability using Interact.js
		interact(section)
		  .draggable({
			onmove: function (event) {
			  const target = event.target;
			  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  
			  target.style.transform = `translate(${x}px, ${y}px)`;
			  target.setAttribute('data-x', x);
			  target.setAttribute('data-y', y);
			}
		  })
		  .resizable({
			edges: { left: true, right: true, bottom: true, top: true },
			onmove: function (event) {
			  const target = event.target;
			  const x = (parseFloat(target.getAttribute('data-x')) || 0);
			  const y = (parseFloat(target.getAttribute('data-y')) || 0);
  
			  target.style.width = event.rect.width + 'px';
			  target.style.height = event.rect.height + 'px';
  
			  target.setAttribute('data-x', x);
			  target.setAttribute('data-y', y);
			}
		  })
		  .gesturable({
			onmove: function (event) {
			  const target = event.target;
			  const x = (parseFloat(target.getAttribute('data-x')) || 0);
			  const y = (parseFloat(target.getAttribute('data-y')) || 0);
			  const angle = (parseFloat(target.getAttribute('data-angle')) || 0) + event.da;
  
			  target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
			  target.setAttribute('data-x', x);
			  target.setAttribute('data-y', y);
			  target.setAttribute('data-angle', angle);
			}
		  });
  
		seatingPlan.appendChild(section);
	  });
  
	  // Initial grid creation
	  const inputX = document.getElementById('inputX');
	  const inputY = document.getElementById('inputY');
	  const gridCreateHandler = function () {
		const x = parseInt(inputX.value);
		const y = parseInt(inputY.value);
		createSeatingGrid(x, y);
	  };
	  inputX.addEventListener('input', gridCreateHandler);
	  inputY.addEventListener('input', gridCreateHandler);


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
});

// Your JSON seating plan
var seatingPlanx = {
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
};*/
