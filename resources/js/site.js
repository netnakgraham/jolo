let gridX = 0;
let gridY = 0;
const seatingPlanData = [];

// Function to create a new section
function createSection(sectionName, numRows, seatsPerRow, aisleBreaks) {
  const section = document.createElement("div");
  section.classList.add("section");
  section.innerHTML = `
    <h3>${sectionName}</h3>
    <button class="btn-delete" data-section="${sectionName}">Delete</button>
    <button class="btn-rotate" data-section="${sectionName}">Rotate</button>
  `;

  const rows = [];
  
  for (let i = 1; i <= numRows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    
    const rowLabel = document.createElement("input");
    rowLabel.type = "text";
    rowLabel.placeholder = "Row Label";
    rowLabel.classList.add("row-label");
    row.appendChild(rowLabel);
    
    const seats = [];
    for (let j = 1; j <= seatsPerRow; j++) {
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.innerHTML = `<span class="seat-label">Seat ${j}</span>`;
      
      if (aisleBreaks.includes(j)) {
        seat.classList.add("aisle");
      }
      
      row.appendChild(seat);
      seats.push(`Seat ${j}`);
    }
    
    section.appendChild(row);
    rows.push({ label: "", seats });
  }
  
  seatingPlanData.push({ section: sectionName, rows });
  
  return section;
}

// Function to initialize the draggable and rotatable behavior
function initializeInteract(element) {
  interact(element)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        }
      }
    })
    .gesturable({
      listeners: {
        move(event) {
          const target = event.target;
          const rotation = (parseFloat(target.getAttribute("data-rotation")) || 0) + event.da;

          target.style.transform = `rotate(${rotation}deg)`;
          target.setAttribute("data-rotation", rotation);
        }
      }
    });
}

// Function to handle seat clicks
function handleSeatClick(event) {
  const seat = event.currentTarget;
  const sectionName = seat.closest(".section").dataset.section;
  const rowLabel = seat.closest(".row").querySelector(".row-label").value;
  const seatNumber = seat.querySelector(".seat-label").textContent;

  console.log(`Section: ${sectionName}, Row: ${rowLabel}, Seat: ${seatNumber}`);
}

// Function to delete a section
function deleteSection(event) {
  const sectionName = event.target.dataset.section;
  const sectionIndex = seatingPlanData.findIndex((data) => data.section === sectionName);
  
  if (sectionIndex !== -1) {
    seatingPlanData.splice(sectionIndex, 1);
    event.target.closest(".section").remove();
    updateJsonOutput();
  }
}

// Function to rotate a section
function rotateSection(event) {
  const sectionName = event.target.dataset.section;
  const section = event.target.closest(".section");
  const rotation = (parseFloat(section.getAttribute("data-rotation")) || 0) + 45;
  section.style.transform = `rotate(${rotation}deg)`;
  section.setAttribute("data-rotation", rotation);
}

// Function to update the JSON output
function updateJsonOutput() {
  document.getElementById("jsonOutput").value = JSON.stringify(seatingPlanData, null, 2);
}

// Get the grid inputs and seating plan container
const gridXInput = document.getElementById("gridX");
const gridYInput = document.getElementById("gridY");
const seatingPlan = document.getElementById("seatingPlan");

// Event listener for grid inputs
gridXInput.addEventListener("change", () => {
  gridX = parseInt(gridXInput.value);
  createGrid();
});
gridYInput.addEventListener("change", () => {
  gridY = parseInt(gridYInput.value);
  createGrid();
});

// Function to create the grid based on inputs
function createGrid() {
  seatingPlanData.length = 0; // Clear existing seating plan data
  seatingPlan.innerHTML = ""; // Clear existing seating plan
  
  for (let i = 0; i < gridY; i++) {
    for (let j = 0; j < gridX; j++) {
      const sectionName = `Section ${i + 1}-${j + 1}`;
      const section = createSection(sectionName, 5, 10, [4, 7]); // Customize section properties here
      
      initializeInteract(section); // Initialize draggable and rotatable behavior
      
      // Add event listeners to seats
      const seats = section.querySelectorAll(".seat");
      seats.forEach((seat) => {
        seat.addEventListener("click", handleSeatClick);
      });
      
      // Add event listeners to delete and rotate buttons
      const btnDelete = section.querySelector(".btn-delete");
      btnDelete.addEventListener("click", deleteSection);
      
      const btnRotate = section.querySelector(".btn-rotate");
      btnRotate.addEventListener("click", rotateSection);
      
      section.dataset.section = sectionName;
      seatingPlan.appendChild(section);
    }
  }
  
  updateJsonOutput();
}

// Initial grid creation
createGrid();

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
