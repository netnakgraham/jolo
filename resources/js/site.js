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

interact('.section')
  .draggable({
	onmove: dragMoveListener
  })
  .resizable({
	edges: { left: true, right: true, bottom: true, top: true },
	modifiers: [
	  interact.modifiers.restrictSize({
		min: { width: 60, height: 60 }
	  })
	],
	listeners: {
	  move(event) {
		const { width, height } = event.rect;
		event.target.style.width = `${width}px`;
		event.target.style.height = `${height}px`;
	  }
	}
  })
  .on('doubletap', function(event) {
	rotateSection(event.currentTarget);
  });

document.getElementById('add-section-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const sectionName = document.getElementById('section-name').value;
  const rows = parseInt(document.getElementById('section-rows').value);
  const seatsPerRow = parseInt(document.getElementById('seats-per-row').value);
  const aisleBreaks = document.getElementById('aisle-breaks').value.split(',').map(Number);

  const section = {
	name: sectionName,
	rows: rows,
	seatsPerRow: seatsPerRow,
	aisleBreaks: aisleBreaks
  };

  seatingPlan.push(section);
  renderSeatingPlan();
  updateJSON();
  this.reset();
});

function renderSeatingPlan() {
  const seatingPlanContainer = document.querySelector('.seating-plan');
  seatingPlanContainer.innerHTML = '';

  seatingPlan.forEach((section, index) => {
	const sectionElement = document.createElement('div');
	sectionElement.className = 'section';
	sectionElement.setAttribute('data-index', index);

	const rows = section.rows;
	const seatsPerRow = section.seatsPerRow;
	const aisleBreaks = section.aisleBreaks;

	const seatGrid = document.createElement('div');
	seatGrid.className = 'seat-grid';

	for (let row = 1; row <= rows; row++) {
	  const rowElement = document.createElement('div');
	  rowElement.className = 'seat-row';

	  for (let seat = 1; seat <= seatsPerRow; seat++) {
		const seatElement = document.createElement('div');
		seatElement.className = 'seat';

		if (aisleBreaks.includes(seat)) {
		  seatElement.className = 'aisle';
		  seatElement.innerHTML = 'Aisle';
		} else {
		  seatElement.textContent = `Seat ${seat}`;
		}

		seatElement.addEventListener('click', function() {
		  const sectionIndex = parseInt(this.closest('.section').getAttribute('data-index'));
		  console.log(`Section: ${seatingPlan[sectionIndex].name}, Row: ${row}, Seat: ${seat}`);
		});

		rowElement.appendChild(seatElement);
	  }

	  seatGrid.appendChild(rowElement);
	}

	const deleteButton = document.createElement('button');
	deleteButton.textContent = 'Delete';
	deleteButton.addEventListener('click', function() {
	  const sectionIndex = parseInt(this.closest('.section').getAttribute('data-index'));
	  seatingPlan.splice(sectionIndex, 1);
	  renderSeatingPlan();
	  updateJSON();
	});

	const rotateButton = document.createElement('button');
	rotateButton.textContent = 'Rotate';
	rotateButton.addEventListener('click', function() {
	  rotateSection(this.closest('.section'));
	});

	sectionElement.appendChild(seatGrid);
	sectionElement.appendChild(deleteButton);
	sectionElement.appendChild(rotateButton);

	seatingPlanContainer.appendChild(sectionElement);
  });

  const stageElement = document.createElement('div');
  stageElement.className = 'stage';
  seatingPlanContainer.appendChild(stageElement);
}

function updateJSON() {
  const jsonOutput = document.getElementById('json-output');
  jsonOutput.textContent = JSON.stringify(seatingPlan, null, 2);
}

function dragMoveListener(event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function rotateSection(sectionElement) {
  const rotation = parseFloat(sectionElement.getAttribute('data-rotation')) || 0;
  const newRotation = rotation + 90;
  sectionElement.style.transform = `rotate(${newRotation}deg)`;
  sectionElement.setAttribute('data-rotation', newRotation);
}