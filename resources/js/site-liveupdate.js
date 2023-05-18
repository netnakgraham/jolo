const seatingPlan = [];

const form = document.getElementById('section-form');
const saveButton = document.getElementById('save-btn');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const sectionName = document.getElementById('section-name').value;
  const rows = parseInt(document.getElementById('rows').value);
  const seatsPerRow = parseInt(document.getElementById('seats-per-row').value);
  const aisleBreaksInput = document.getElementById('aisle-breaks').value;
  const aisleBreaks = aisleBreaksInput.split(',').map(Number);

  const section = {
	name: sectionName,
	rows: rows,
	seatsPerRow: seatsPerRow,
	aisleBreaks: aisleBreaks,
	x: 0,
	y: 0,
	rotation: 0,
	width: seatsPerRow * 25,
	height: rows * 25
  };

  seatingPlan.push(section);
  addSectionToSeatingPlan(section);
  updateJSONOutput();

  form.reset();
});

function addSectionToSeatingPlan(section) {
  const seatingPlanElement = document.querySelector('.seating-plan');

  const sectionElement = document.createElement('div');
  sectionElement.classList.add('section');
  sectionElement.setAttribute('data-section-name', section.name);
  sectionElement.style.width = section.width + 'px';
  sectionElement.style.height = section.height + 'px';
  sectionElement.style.transform = `translate(${section.x}px, ${section.y}px) rotate(${section.rotation}deg)`;

  const seatGrid = document.createElement('div');
  seatGrid.classList.add('seat-grid');

  for (let row = 1; row <= section.rows; row++) {
	const seatRow = document.createElement('div');
	seatRow.classList.add('seat-row');

	for (let seat = 1; seat <= section.seatsPerRow; seat++) {
	  const seatNumber = getSeatNumber(row, seat, section.aisleBreaks);

	  const seatElement = document.createElement('div');
	  seatElement.classList.add('seat');
	  seatElement.innerText = seatNumber;
	  seatElement.addEventListener('click', function() {
		console.log(`Section: ${section.name}, Row: ${row}, Seat: ${seatNumber}`);
	  });

	  seatRow.appendChild(seatElement);
	}

	seatGrid.appendChild(seatRow);
  }

  sectionElement.appendChild(seatGrid);
  seatingPlanElement.appendChild(sectionElement);

  interact('.section')
	.draggable({
	  inertia: true,
	  modifiers: [
		interact.modifiers.restrictRect({
		  restriction: '.boundary-box',
		  endOnly: true
		})
	  ],
	  listeners: {
		move: dragMoveListener
	  }
	})
	.resizable({
	  edges: {
		left: true,
		right: true,
		bottom: true,
		top: true
	  },
	  modifiers: [
		interact.modifiers.restrictSize({
		  min: { width: 50, height: 50 }
		})
	  ],
	  listeners: {
		move: resizeMoveListener
	  }
	})
	.on('move', updateSectionPosition);

  interact('.stage')
	.draggable({
	  inertia: true,
	  modifiers: [
		interact.modifiers.restrictRect({
		  restriction: '.boundary-box',
		  endOnly: true
		})
	  ],
	  listeners: {
		move: dragMoveListener
	  }
	})
	.resizable({
	  edges: {
		left: false,
		right: true,
		bottom: false,
		top: false
	  },
	  modifiers: [
		interact.modifiers.restrictSize({
		  min: { width: 50, height: 20 }
		})
	  ],
	  listeners: {
		move: resizeMoveListener
	  }
	})
	.on('move', updateStagePosition);
}

function dragMoveListener(event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function resizeMoveListener(event) {
  const target = event.target;
  const { x, y } = target.getBoundingClientRect();

  target.style.width = event.rect.width + 'px';
  target.style.height = event.rect.height + 'px';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

function updateSectionPosition(event) {
  const target = event.target;
  const { x, y } = target.getBoundingClientRect();
  const rotation = getRotation(target);

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);

  seatingPlan.forEach(section => {
	if (section.name === target.getAttribute('data-section-name')) {
	  section.x = x;
	  section.y = y;
	  section.rotation = rotation;
	}
  });

  updateJSONOutput();
}

function updateStagePosition(event) {
  const target = event.target;
  const { x, y } = target.getBoundingClientRect();

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);

  seatingPlan.forEach(section => {
	if (section.name === 'stage') {
	  section.x = x;
	  section.y = y;
	}
  });

  updateJSONOutput();
}

function getRotation(element) {
  const transformStyle = window.getComputedStyle(element).getPropertyValue('transform');
  const matrix = transformStyle.match(/^matrix\((.+)\)$/);
  if (matrix) {
	const values = matrix[1].split(',');
	const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
	return angle >= 0 ? angle : 360 + angle;
  }
  return 0;
}

function getSeatNumber(row, seat, aisleBreaks) {
  const seatNumber = (row - 1) * 2 + seat;
  const aisleOffset = aisleBreaks.reduce((count, aisle) => {
	return seatNumber > aisle ? count + 1 : count;
  }, 0);
  return seatNumber + aisleOffset;
}

function updateJSONOutput() {
  const jsonOutputElement = document.getElementById('json-output');
  const json = JSON.stringify(seatingPlan, null, 2);
  jsonOutputElement.textContent = json;
}

saveButton.addEventListener('click', function() {
  updateJSONOutput();
});

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
 
