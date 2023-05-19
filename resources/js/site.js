let gridX = 0;
let gridY = 0;
const gridSize = 20; // Square size in pixels
const seatingPlanData = [];

// Function to create a new section
function createSection(sectionName, numRows, seatsPerRow, aisleBreaks) {
    const section = document.createElement("div");
    section.classList.add("section");
    section.innerHTML = `
    <h3>${sectionName}</h3>
    <button class="btn-delete" data-section="${sectionName}">x</button>
    <button class="btn-rotate" data-section="${sectionName}">></button>
  `;

    const rows = [];

    for (let i = 1; i <= numRows; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        const rowLabel = document.createElement("input");
        rowLabel.type = "text";
        rowLabel.value = i;
        rowLabel.classList.add("row-label");
        row.appendChild(rowLabel);

        const seats = [];
        for (let j = 1; j <= seatsPerRow; j++) {
            const seat = document.createElement("div");

			seat.addEventListener("click", handleSeatClick);

            seat.classList.add("seat");
            seat.innerHTML = `<span class="seat-label">${j}</span>`;

            if (aisleBreaks.includes(j)) {
                seat.classList.add("aisle");
            }

            row.appendChild(seat);
            seats.push(`${j}`);
        }

        section.appendChild(row);
        rows.push({ label: "", seats });
    }

    seatingPlanData.push({
        section: sectionName,
        rows,
    });

    return section;
}
// Function to handle resize move events
function resizeMoveListener(event) {
    const target = event.target;
    const x =
        (parseFloat(target.getAttribute("data-x")) || 0) + event.deltaRect.left;
    const y =
        (parseFloat(target.getAttribute("data-y")) || 0) + event.deltaRect.top;

    target.style.width = event.rect.width + "px";
    target.style.height = event.rect.height + "px";
    target.style.transform = `translate(${x}px, ${y}px)`;

    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
}

// Function to handle drag move events
function dragMoveListener(event) {
    const target = event.target;
    const transform = target.style.transform;
    const x = parseFloat(target.getAttribute("data-x")) || 0;
    const y = parseFloat(target.getAttribute("data-y")) || 0;

    if (transform) {
        const transformValues = transform.match(
            /translate\((-?\d+)px, (-?\d+)px\)/
        );
        if (transformValues && transformValues.length === 3) {
            const [, transformX, transformY] = transformValues;
            target.style.transform = `translate(${
                parseFloat(transformX) + event.dx
            }px, ${parseFloat(transformY) + event.dy}px)`;
        } else {
            target.style.transform = `translate(${x + event.dx}px, ${
                y + event.dy
            }px)`;
        }
    } else {
        target.style.transform = `translate(${x + event.dx}px, ${
            y + event.dy
        }px)`;
    }

    target.setAttribute("data-x", x + event.dx);
    target.setAttribute("data-y", y + event.dy);
}

// Function to initialize interact.js for draggable and resizable behavior
function initializeInteract(element) {
    interact(element)
        .draggable({
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: "parent",
                    endOnly: true,
                }),
            ],
            listeners: {
                move: dragMoveListener,
            },
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            modifiers: [
                interact.modifiers.aspectRatio({
                    ratio: "preserve",
                }),
                interact.modifiers.restrictSize({
                    min: { width: 10, height: 10 },
                }),
            ],
            listeners: {
                move: resizeMoveListener,
            },
        })
        .on("dragend", (event) => {
            const target = event.target;
            const { x, y } = target.dataset;

            target.style.width = event.rect.width + "px";
            target.style.height = event.rect.height + "px";
            target.style.transform = `translate(${x}px, ${y}px)`;
        })
        .on("dragmove", (event) => {
            const target = event.target;
            const transform = target.style.transform;

            let x = 0;
            let y = 0;

            if (transform) {
                const transformValues = transform.match(
                    /translate\((-?\d+)px, (-?\d+)px\)/
                );
                if (transformValues && transformValues.length === 3) {
                    [, x, y] = transformValues;
                }
            }

            target.setAttribute("data-x", parseFloat(x));
            target.setAttribute("data-y", parseFloat(y));
        })

        .on("resizemove", (event) => {
            const target = event.target;
            const x = parseFloat(
                target.style.transform.split("(")[1].split("px")[0]
            );
            const y = parseFloat(
                target.style.transform.split(",")[1].split("px")[0]
            );

            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
        });
}

function handleSeatClick(event) {

	
	const seatSection = event.currentTarget.closest(".section").getAttribute("data-section");
	const seatRow = event.currentTarget.closest(".row").getAttribute("data-row");
	const seatNumber = event.currentTarget.getAttribute("data-number");
  
	console.log(`Section: ${seatSection}, Row: ${seatRow}, Seat: ${seatNumber}`);
  }
  
  // Function to add seats to a row
  function addSeatsToRow(row, numSeats) {
	for (let i = 1; i <= numSeats; i++) {
	  const seat = document.createElement("div");
	  seat.classList.add("seat");
	  seat.setAttribute("data-number", i);
	  seat.addEventListener("click", handleSeatClick);
	  row.appendChild(seat);
	}
  }
  
  // Function to add rows to a section
  function addRowsToSection(section, numRows, seatsPerRow, aisleBreaks) {
	for (let i = 1; i <= numRows; i++) {
	  const row = document.createElement("div");
	  row.classList.add("row");
	  row.setAttribute("data-row", i);
  
	  // Add seats to the row
	  addSeatsToRow(row, seatsPerRow);
  
	  // Add aisle breaks
	  if (aisleBreaks.includes(i)) {
		row.classList.add("aisle");
	  }
  
	  section.appendChild(row);
	}
  }


// Function to delete a section
function deleteSection(event) {
    const sectionName = event.target.dataset.section;
    const sectionIndex = seatingPlanData.findIndex(
        (data) => data.section === sectionName
    );

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
    const rotation =
        (parseFloat(section.getAttribute("data-rotation")) || 0) + 45;
    section.style.transform = `rotate(${rotation}deg)`;
    section.setAttribute("data-rotation", rotation);
}

// Function to update the JSON output
function updateJsonOutput() {
    document.getElementById("jsonOutput").value = JSON.stringify(
        seatingPlanData,
        null,
        2
    );
}

// Get the grid inputs and seating plan container
const gridXInput = document.getElementById("gridX");
const gridYInput = document.getElementById("gridY");
const sectionNameInput = document.getElementById("sectionName");
const numRowsInput = document.getElementById("numRows");
const seatsPerRowInput = document.getElementById("seatsPerRow");
const aisleBreaksInput = document.getElementById("aisleBreaks");
const addSectionButton = document.getElementById("addSectionButton");
const seatingPlan = document.getElementById("seatingPlan");

// Event listener for adding a new section
addSectionButton.addEventListener("click", () => {
    const sectionName = sectionNameInput.value;
    const numRows = parseInt(numRowsInput.value);
    const seatsPerRow = parseInt(seatsPerRowInput.value);
    const aisleBreaks = aisleBreaksInput.value.split(",").map(Number);

    if (
        !sectionName ||
        isNaN(numRows) ||
        isNaN(seatsPerRow) ||
        aisleBreaks.some(isNaN)
    ) {
        alert("Please enter valid section details.");
        return;
    }

    const section = createSection(
        sectionName,
        numRows,
        seatsPerRow,
        aisleBreaks
    );
    seatingPlan.appendChild(section);
    initializeInteract(section);
    updateJsonOutput();

    sectionNameInput.value = "";
    numRowsInput.value = "";
    seatsPerRowInput.value = "";
    aisleBreaksInput.value = "";
});

// Update the grid size based on user input
gridXInput.addEventListener("input", () => {
    gridX = parseInt(gridXInput.value) * gridSize;
    seatingPlan.style.width = `${gridX}px`;
});
gridYInput.addEventListener("input", () => {
    gridY = parseInt(gridYInput.value) * gridSize;
    seatingPlan.style.height = `${gridY}px`;
});

// Update the grid size variables based on user input
function updateGridSize() {
    const gridSizeXInput = document.getElementById("gridSizeXInput");
    const gridSizeYInput = document.getElementById("gridSizeYInput");

    gridSizeX = parseInt(gridSizeXInput.value);
    gridSizeY = parseInt(gridSizeYInput.value);

    updateSeatingPlanJSON();
}

// Function to update JSON with seating plan data
function updateSeatingPlanJSON() {
    const seatingPlan = {
        grid: {
            x: gridX,
            y: gridY,
        },
        sections: [],
    };

    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        const sectionData = {
            x: parseFloat(section.getAttribute("data-x")),
            y: parseFloat(section.getAttribute("data-y")),
            rotation: parseFloat(section.getAttribute("data-rotation")),
            rows: [],
        };

        const rows = section.querySelectorAll(".row");
        rows.forEach((row) => {
            const rowData = {
                label: row.querySelector(".row-label").value,
                seats: [],
            };

            const seats = row.querySelectorAll(".seat");
            seats.forEach((seat) => {
                rowData.seats.push(seat.getAttribute("data-number"));
            });

            sectionData.rows.push(rowData);
        });

        seatingPlan.sections.push(sectionData);
    });

    const seatingPlanJSON = JSON.stringify(seatingPlan);
    console.log(seatingPlanJSON);

    // Update the JSON in the textarea
    const textarea = document.getElementById("jsonTextarea");
    textarea.value = seatingPlanJSON;
}

// Event listener for deleting a section
seatingPlan.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-delete")) {
        deleteSection(event);
    }
});

// Event listener for rotating a section
seatingPlan.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-rotate")) {
        rotateSection(event);
    }
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
