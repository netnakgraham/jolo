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
};
 
const seatingPlan = [];

document.getElementById('add-section-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const sectionName = document.getElementById('section-name-input').value;
  const rows = parseInt(document.getElementById('rows-input').value);
  const seatsPerRow = parseInt(document.getElementById('seats-per-row-input').value);
  const aisleBreaksInput = document.getElementById('aisle-breaks-input').value;
  const aisleBreaks = aisleBreaksInput.split(',').map(str => parseInt(str.trim())).filter(Boolean);

  const section = {
	name: sectionName,
	rows: rows,
	seatsPerRow: seatsPerRow,
	aisleBreaks: aisleBreaks,
	position: { x: 0, y: 0 },
	rotated: false
  };

  seatingPlan.push(section);

  const sectionElement = createSectionElement(section);
  document.getElementById('seating-plan').appendChild(sectionElement);
  updateJSONOutput();
});

function createSectionElement(section) {
  const sectionElement = document.createElement('div');
  sectionElement.classList.add('section');
  sectionElement.style.transform = `translate(${section.position.x}px, ${section.position.y}px)`;

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header');
  sectionElement.appendChild(sectionHeader);

  const sectionName = document.createElement('div');
  sectionName.classList.add('section-name');
  sectionName.textContent = section.name;
  sectionHeader.appendChild(sectionName);

  const sectionButtons = document.createElement('div');
  sectionButtons.classList.add('section-buttons');
  sectionHeader.appendChild(sectionButtons);

  const rotateButton = document.createElement('button');
  rotateButton.classList.add('btn', 'btn-secondary');
  rotateButton.textContent = 'Rotate';
  sectionButtons.appendChild(rotateButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Delete';
  sectionButtons.appendChild(deleteButton);

  rotateButton.addEventListener('click', function() {
	sectionElement.classList.toggle('rotated');
	section.rotated = !section.rotated;
	updateJSONOutput();
  });

  deleteButton.addEventListener('click', function() {
	const index = seatingPlan.findIndex(s => s === section);
	if (index !== -1) {
	  seatingPlan.splice(index, 1);
	  sectionElement.remove();
	  updateJSONOutput();
	}
  });

  interact(sectionElement)
	.draggable({
	  modifiers: [
		interact.modifiers.restrictRect({
		  restriction: 'parent',
		  endOnly: true
		})
	  ],
	  listeners: {
		move(event) {
		  const target = event.target;
		  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
		  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		  target.style.transform = `translate(${x}px, ${y}px)`;
		  target.setAttribute('data-x', x);
		  target.setAttribute('data-y', y);
		},
		end(event) {
		  const target = event.target;
		  const rect = target.getBoundingClientRect();
		  section.position = {
			x: rect.left,
			y: rect.top
		  };
		  updateJSONOutput();
		}
	  }
	})
	.on('doubletap', function(event) {
	  event.currentTarget.classList.toggle('rotated');
	  section.rotated = !section.rotated;
	  updateJSONOutput();
	});

  const seatContainer = document.createElement('div');
  seatContainer.classList.add('mt-4');
  sectionElement.appendChild(seatContainer);

  for (let row = 1; row <= section.rows; row++) {
	const seatRow = document.createElement('div');
	seatRow.classList.add('flex');

	for (let seat = 1; seat <= section.seatsPerRow; seat++) {
	  const seatElement = document.createElement('div');
	  seatElement.classList.add('seat');
	  seatElement.textContent = `${row}-${seat}`;

	  if (section.aisleBreaks.includes(seat)) {
		seatElement.classList.add('aisle');
	  }

	  seatRow.appendChild(seatElement);
	}

	seatContainer.appendChild(seatRow);
  }

  return sectionElement;
}

function updateJSONOutput() {
  document.getElementById('json-output').value = JSON.stringify(seatingPlan, null, 2);
}