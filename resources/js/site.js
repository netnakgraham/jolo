const seatingPlan = [


];

interact(".section")
	.allowFrom(".drag-handle")
    
	.draggable({
        onmove: dragMoveListener,
		origin: "parent",
        snap: {
        	// snap targets pay attention to the action's origin option
            targets: [
                interact.createSnapGrid({
                    x: 30,
                    y: 30,
                })
            ],
            relativePoints: [
            	{ x: 0, y: 0 }
            ]
        },
        restrict: {
        	// restrictions *don't* pay attention to the action's origin option
            // so using 'parent' for both origin and restrict.restriction works
            restriction: "parent",
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
    })
	.on("move", updateSectionPosition);

const savePlanButton = document.getElementById("save-plan");
savePlanButton.addEventListener("click", function () {
    updateJSON();
});


document.getElementById("add-section-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const sectionName = document.getElementById("section-name").value;
        const rows = parseInt(document.getElementById("section-rows").value);
        const seatsPerRow = parseInt(document.getElementById("seats-per-row").value);
        const aisleBreaks = document
            .getElementById("aisle-breaks")
            .value.split(",")
            .map(Number);

		
		const section = {
			name: sectionName,
			rows: rows,
			seatsPerRow: seatsPerRow,
			aisleBreaks: aisleBreaks > 0 ? aisleBreaks : [],
			x: 0,
			y: 0,
			rotation: 0
		};

        seatingPlan.push(section);

        renderSeatingPlan();

        updateJSON();

        this.reset();

    });

interact(".stage")
.allowFrom(".drag-handle")

    .draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: ".seating-plan",
                endOnly: true,
            }),
        ],
        listeners: {
            move: dragMoveListener,
        },
    })
    .resizable({
        edges: { left: true, right: true },
        modifiers: [
            interact.modifiers.restrictSize({
                min: { width: 50 },
            }),
        ],
        listeners: {
            move: resizeListener,
        },
    });

function dragMoveListener(event) {
	
    const target = event.target.closest(".section");

    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
}


function updateSectionPosition(event) {
	const target = event.target.closest(".section");

	var rect = target.getBoundingClientRect();

	//Recalculate mouse offsets to relative offsets
	var x = rect.x;
	var y = rect.y;

	const rotation = getRotation(target);
  

	x = target.getAttribute("data-x");
    y = target.getAttribute("data-y");

	//target.setAttribute('data-x', x);
	//target.setAttribute('data-y', y);
  
	seatingPlan.forEach((section, index) => {

		//console.log(index +  ' ' + target.getAttribute('data-index'));
		if (index == target.getAttribute('data-index')) {
			section.x = x;
			section.y = y;
			section.rotation = rotation;
		}
	});
  
	updateJSON();
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

  
function resizeListener(event) {
    const target = event.target;
    let { width, height } = event.rect;

    width = Math.round(width);
    height = Math.round(height);

    target.style.width = `${width}px`;
    target.style.height = `${height}px`;
}



function renderSeatingPlan() {

    const seatingPlanContainer = document.querySelector(".seating-plan");
    seatingPlanContainer.innerHTML = "";

    seatingPlan.forEach((section, index) => {
        const sectionElement = document.createElement("div");
        sectionElement.className = "section";
        sectionElement.setAttribute("data-index", index);

		sectionElement.setAttribute('data-section-name', section.name);

        const rows = section.rows;
        var seatsPerRow = section.seatsPerRow;
        const aisleBreaks = section.aisleBreaks;


        if (aisleBreaks) {
            seatsPerRow = seatsPerRow + aisleBreaks.length;
        } 

        const seatGrid = document.createElement("div");
        seatGrid.className = "seat-grid";

		const rowLabel = document.createElement("input");
		rowLabel.setAttribute("type", "text");
		rowLabel.className = "row-label";


        for (let row = 1; row <= rows; row++) {
            const rowElement = document.createElement("div");
            rowElement.className = "seat-row";

			

            for (let seat = 1; seat <= seatsPerRow; seat++) {
                const seatElement = document.createElement("div");
                seatElement.className = "seat";

                if (aisleBreaks.includes(seat - 1)) {
                    seatElement.className = "aisle";
                    seatElement.innerHTML = "|";
                } else {
                    seatElement.textContent = `${row}-${getSeatNumber(
                        row,
                        seat,
                        aisleBreaks
                    )}`;
                }

                seatElement.addEventListener("click", function () {
                    const sectionIndex = parseInt(
                        this.closest(".section").getAttribute("data-index")
                    );
                    console.log(
                        `Section: ${
                            seatingPlan[sectionIndex].name
                        }, Row: ${row}, Seat: ${getSeatNumber(
                            row,
                            seat,
                            aisleBreaks
                        )}`
                    );
                });

                rowElement.appendChild(seatElement);
            }

            seatGrid.appendChild(rowElement);
        }

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            const sectionIndex = parseInt(
                this.closest(".section").getAttribute("data-index")
            );
            seatingPlan.splice(sectionIndex, 1);
            renderSeatingPlan();
            updateJSON();
        });

        const rotateButton = document.createElement("button");
        rotateButton.textContent = "Rotate";
        rotateButton.addEventListener("click", function () {
            rotateSection(this.closest(".section"));
        });

		const dragHandle = document.createElement("div");
        dragHandle.innerHTML = "&circlearrowright;";
		dragHandle.classList.add('drag-handle')
        

		
		sectionElement.appendChild(dragHandle);
        sectionElement.appendChild(seatGrid);
        sectionElement.appendChild(deleteButton);
        sectionElement.appendChild(rotateButton);

        sectionElement.style.transform = `translate(${section.x}px, ${section.y}px) rotate(${section.rotation}deg)`;
        sectionElement.setAttribute("data-x", section.x);
        sectionElement.setAttribute("data-y", section.y);
        sectionElement.setAttribute("data-rotation", section.rotation);

        seatingPlanContainer.appendChild(sectionElement);
    });

    const stageElement = document.createElement("div");
    stageElement.className = "stage";
    seatingPlanContainer.appendChild(stageElement);
}

function updateJSON() {
    const jsonOutput = document.getElementById("json-output");
    jsonOutput.textContent = JSON.stringify(seatingPlan, null, 2);
}

interact(".rotation-handle").draggable({
    onstart: function (event) {
        var box = event.target.parentElement;
        var rect = box.getBoundingClientRect();

        // store the center as the element has css `transform-origin: center center`
        box.setAttribute("data-center-x", rect.left + rect.width / 2);
        box.setAttribute("data-center-y", rect.top + rect.height / 2);
        // get the angle of the element when the drag starts
        box.setAttribute("data-angle", getDragAngle(event));
    },
    onmove: function (event) {
        var box = event.target.parentElement;

        var pos = {
            x: parseFloat(box.getAttribute("data-x")) || 0,
            y: parseFloat(box.getAttribute("data-y")) || 0,
        };

        var angle = getDragAngle(event);

        // update transform style on dragmove
        box.style.transform =
            "translate(" +
            pos.x +
            "px, " +
            pos.y +
            "px) rotate(" +
            angle +
            "rad" +
            ")";
    },
    onend: function (event) {
        var box = event.target.parentElement;

        // save the angle on dragend
        box.setAttribute("data-angle", getDragAngle(event));
    },
});

function getDragAngle(event) {
    var box = event.target.parentElement;
    var startAngle = parseFloat(box.getAttribute("data-angle")) || 0;
    var center = {
        x: parseFloat(box.getAttribute("data-center-x")) || 0,
        y: parseFloat(box.getAttribute("data-center-y")) || 0,
    };
    var angle = Math.atan2(center.y - event.clientY, center.x - event.clientX);

    return angle - startAngle;
}

function rotateSection(sectionElement) {
    const rotation =
        parseFloat(sectionElement.getAttribute("data-rotation")) || 0;
    const newRotation = rotation + 90;
    sectionElement.style.transform = `translate(${sectionElement.getAttribute(
        "data-x"
    )}px, ${sectionElement.getAttribute(
        "data-y"
    )}px) rotate(${newRotation}deg)`;
    sectionElement.setAttribute("data-rotation", newRotation);
}

function getSeatNumber(row, seat, aisleBreaks) {
    let seatNumber = seat;
    aisleBreaks.forEach((aisle) => {
        if (seat > aisle) {
            seatNumber--;
        }
    });
    return seatNumber;
}

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
