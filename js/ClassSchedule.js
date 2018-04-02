var chosenSchool;
var chosenDepartment;
var cy;

var courseDragged;

var coursesAddedToSchedule = [];
var coursesToBeStored = [];

var user_semesters = [];
var user_courses = [];

var schools = [];
var selectedSchool = "";
var departments = [];
var selectedDepartment = "";
var coursesForSchoolDepartment = {};

var defaultStartSemester = "";
var defaultEndSemester = "";
var defaultSemesterCount = 0;
var defaultIncludeSummer = true;

var divisor = 75;

var database;

// Modal Window for Create Account
init = function() {

	// Initialize Firebase
	var config = {
	    apiKey: "AIzaSyBJ1LF8ns8WLgNp_qOAby0FwrSGCYvU_iQ",
	    authDomain: "washuplan.firebaseapp.com",
	    databaseURL: "https://washuplan.firebaseio.com",
	    projectId: "washuplan",
	    storageBucket: "washuplan.appspot.com",
		messagingSenderId: "198489680934"
	};
	firebase.initializeApp(config);

	database = firebase.database();

	//Initialize Cytoscape
	initializeCytoscape();

	//Fill modal with html
	// var htmlPage = "http://ec2-18-218-250-72.us-east-2.compute.amazonaws.com/GettingStartedModal.html";
	// fetch_text(htmlPage).then((html) => {
 //        document.getElementById("surround_modal_content").innerHTML = html;
 //    }).catch((error) => {
 //        console.warn(error);
 //    });

    // Get the modal
	var modal = document.getElementById('gettingStartedModal');

	// Get the button that opens the modal
	var btn = document.getElementById("modal_test");

	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
	    modal.style.display = "block";
	    populateModalSemesterDropdowns();
	}

	// When the user clicks anywhere outside of the modal, close it
	// This will eventually be unwanted
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
	
	var schoolDropdown = document.getElementById("SchoolDropdown");
	var departmentDropdown = document.getElementById("DepartmentDropdown");
	var searchTextInput = document.getElementById("SearchText");
	var courseTable = document.getElementById("course_listing");

	populateSchoolDropdown(schoolDropdown);

	schoolDropdown.addEventListener("change", function() {
		emptyTable();
		populateDepartmentDropdown(departmentDropdown, schoolDropdown.value);
		departmentDropdown.style.display = "block";
	});

	departmentDropdown.addEventListener("change", function() {
		chosenDepartment = departmentDropdown.value;
		emptyTable();
		if (departmentDropdown.value != "Select Department") {
			populateCourseTable();
		}
	});

	var cyDiv = document.getElementById("cy");
	cyDiv.addEventListener("dragover", function(event) {
		event.preventDefault();
	});
	cyDiv.addEventListener("drop", function(event) {
		event.preventDefault();
		handleDrop(event);
	});

	cy.on("tap", "node", function(event) {
		console.log(event.target._private.data.id);
		//Here's where we will open up the modal with more information on the class
	});

	// This will need a huge update to check what semesters the course is available
	cy.on("free", "node", function(event) {
		var nodeId = event.target._private.data.id;
		if (event.target._private.position.x < 50 && event.target._private.position.y < 50) {
			cy.remove(cy.getElementById(nodeId));
			coursesAddedToSchedule.splice(coursesAddedToSchedule.indexOf(nodeId), 1);
			coursesToBeStored.splice(coursesToBeStored.indexOf(nodeId), 1);
		}
		else {
			var newXVal = computeXVal(event.target._private.position.x);
	        var newYVal = computeYVal(event.target._private.position.y);
	        cy.$('#'+nodeId).position('x', newXVal);
	        cy.$('#'+nodeId).position('y', newYVal);

	        for (var storedCourses in coursesToBeStored) {
	        	if (coursesToBeStored[storedCourses].id == courseDragged.getAttribute("id")) {
	        		coursesToBeStored[storedCourses].xPos = newXVal;
	        		coursesToBeStored[storedCourses].yPos = newYVal;
	        		writeUserData(courseDragged.getAttribute("id"), newXVal, newYVal);
	        	}
	        }
		}
    });
}

function fetch_text (url) {
    return fetch(url).then((response) => (response.text()));
}

function populateModalSemesterDropdowns() {
	var startingSemesters = [];
	var endingSemesters = [];

	var fallText = "Fall ";
	var springText = "Spring ";
	var summerText = "Summer ";

	var todaysDate = new Date();
	var thisYear = todaysDate.getFullYear();

	for(var i = 0; i < 8; i++) {
		var year = thisYear - i;
		var fallSemesterText = fallText + year;
		startingSemesters.push(fallSemesterText);

		var summerSemesterText = summerText + year;
		startingSemesters.push(summerSemesterText);

		var springSemesterText = springText + year;
		startingSemesters.push(springSemesterText);
	}
	createOptionsForStartingEndingSemesterDropdowns(startingSemesters, "starting_semesters");

	for(var i = 0; i < 12; i++) {
		var year = thisYear - i + 8;
		var fallSemesterText = fallText + year;
		endingSemesters.push(fallSemesterText);

		var summerSemesterText = summerText + year;
		endingSemesters.push(summerSemesterText);

		var springSemesterText = springText + year;
		endingSemesters.push(springSemesterText);
	}
	createOptionsForStartingEndingSemesterDropdowns(endingSemesters, "ending_semesters");
}

function createOptionsForStartingEndingSemesterDropdowns(semesterArray, dropdownId) {
	var dropdown = document.getElementById(dropdownId);

	for (var index in semesterArray) {
		var option = document.createElement("option");
		option.text = semesterArray[index];
		dropdown.add(option);
	}
}

function handleDrop(e) {
	var hasClass = false;
	if (coursesAddedToSchedule.length > 0) {
		for (var course in coursesAddedToSchedule) {
			if (coursesAddedToSchedule[course] == courseDragged.getAttribute("id")) {
				hasClass = true;
			}
		}
	}
	
	if (hasClass) {
		alert("Course has already been added!");
	}
	else {
		if (e.layerX >= 50 && e.layerY >= 50) {
			var xVal = computeXVal(e.layerX);
			var yVal = computeYVal(e.layerY);
			cy.add({
		        group: "nodes",
		        data: {
		            id: courseDragged.getAttribute("id")
		        },
		        position: { x: xVal, y: yVal }
		    });

		    cy.style()
		        .selector(cy.getElementById(courseDragged.getAttribute("id")))
		            .css({
		                'label': courseDragged.childNodes[0].childNodes[1].childNodes[0].data.trim(),
		                'shape': "roundrectangle",
		                'background-color': "#AAA",
		                'width': 'label',
		                'padding-left': '8px',
		                'padding-right': '8px',
		                'height': 'label',
		                'padding-top': '8px',
		                'padding-bottom': '8px',
		                'text-valign': "center"
		            })
		        .update()
		    ;

		    coursesAddedToSchedule.push(courseDragged.getAttribute("id"));

		    var courseToAdd = {
		    	"id":courseDragged.getAttribute("id"),
		    	"xPos":xVal,
		    	"yPos":yVal
		    };
		    coursesToBeAdded.push(courseToAdd);
		    writeUserData(courseDragged.getAttribute("id"), xVal, yVal);
		}
	}
}

function writeUserData(courseID, testXPos, testYPos) {
	database = firebase.database();
	database.ref('Users/Default/courses/' + courseID).set({
		x_pos: testXPos,
		y_pos: testYPos
	});
}

function computeYVal(yVal) {
	//use divisor starting at 75
	var numOfSemesters = Math.round(575.0 / divisor);

	var newYVal = 0;
	for (i = 1; i <= numOfSemesters; i++) {
		if (yVal <= (650 + (divisor / 2)) - (divisor * i)) {
			newYVal = 75 + (divisor * (numOfSemesters - i));
		}
		if (yVal > (650 - (divisor / 2))) {
			newYVal = (650 - divisor);
		}
		if (yVal < 75) {
			newYVal = 75;
		}
	}

	return newYVal;
}

function computeXVal(xVal) {
	var cyCell = document.getElementById("cy_cell");
	var newXVal = 0;
	if (xVal <= 200) {
		newXVal = 200;
	}
	else if (xVal <= (cyCell.offsetHeight + 100)) {
		newXVal = xVal;
	}
	else {
		newXVal = (cyCell.offsetHeight + 100);
	}

	return newXVal;
}

function drag(ev) {
	courseDragged = ev.path[0];
	//console.log(courseDragged.childNodes[0].childNodes[1].childNodes[0].data.trim());
}

function initializeCytoscape() {
	cy = cytoscape({
		container: document.getElementById('cy'),

		elements: [
			// {
			// 	data: {
			// 		id: 's'
			// 	}
			// },
			// {
			// 	data: {
			// 		id: 't'
			// 	}
			// }
		],

		style: [
			{
				selector: 'node',
				style: {
					'background-color': '#FFF',
					'width': '15px',
					'height': '15px'
				}
			}
		],

		layout: {
			name: 'grid',
			idealEdgeLength: 100,
	        nodeOverlap: 0,
	        refresh: 20,
	        fit: true,
	        padding: 30,
	        randomize: false,
	        componentSpacing: 100,
	        nodeRepulsion: 400000,
	        edgeElasticity: 100,
	        nestingFactor: 5,
	        gravity: 80,
	        numIter: 1000,
	        initialTemp: 200,
	        coolingFactor: 0.95,
	        minTemp: 1.0
		},

		// initial viewport state:
		zoom: 1,
		pan: { x: 0, y: 0 },

		// interaction options:
		minZoom: 1e-50,
		maxZoom: 1e50,
		zoomingEnabled: true,
		userZoomingEnabled: false,
		panningEnabled: true,
		userPanningEnabled: false,
		boxSelectionEnabled: false,
		selectionType: 'single',
		touchTapThreshold: 8,
		desktopTapThreshold: 4,
		autolock: false,
		autoungrabify: false,
		autounselectify: false,

		// rendering options:
		headless: false,
		styleEnabled: true,
		hideEdgesOnViewport: false,
		hideLabelsOnViewport: false,
		textureOnViewport: false,
		motionBlur: false,
		motionBlurOpacity: 0.2,
		wheelSensitivity: 1,
		pixelRatio: 'auto'
	});

	addSemesterRows();
}

function first_time_user() {
	console.log("it works");
}

function addSemesterRows() {
	var includeSummerSemesters = true;
	var startYear = 0;
	var endYear = 0;
	var startSemester = "";
	var endSemester = "";
	var userCourses = {};

	var userData = database.ref('/Users').child("Default").once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			switch (childSnapshot.key) {
				case "courses":
					userCourses = childSnapshot.val();
					break;
				case "end_semester":
					var end = childSnapshot.val().split(' ');
					endSemester = end[0];
					endYear = parseInt(end[1]);
					break;
				case "include_summer_semesters":
					includeSummerSemesters = childSnapshot.val();
					break;
				case "start_semester":
					var start = childSnapshot.val().split(' ');
					startSemester = start[0];
					startYear = parseInt(start[1]);
					break;
			}
		});

		var numOfSemesters = (endYear - startYear + 1) * (includeSummerSemesters ? 3 : 2);
		var semesterIndex = 0;
		switch (startSemester) {
			case "Fall":
				numOfSemesters -= includeSummerSemesters ? 2 : 1;
				semesterIndex = includeSummerSemesters ? 2 : 1;
				break;
			case "Spring":
				semesterIndex = 0;
				break;
			case "Summer":
				numOfSemesters -= 1;
				semesterIndex = 1;
				break;
		}
		switch (endSemester) {
			case "Fall":
				break;
			case "Spring":
				numOfSemesters -= includeSummerSemesters ? 2 : 1;
				break;
			case "Summer":
				numOfSemesters -= 1;
				break;
		}

		divisor = 575.0 / numOfSemesters;
		var semestersToLoopOver = includeSummerSemesters ? ["Spring", "Summer", "Fall"] : ["Spring", "Fall"];
		var currentYear = startYear;
		for (i = 0; i < numOfSemesters; i++) {
			var theId = "semester_" + i;
			cy.add({
		        group: "nodes",
		        data: {
		            id: theId
		        },
		        position: { x: 75, y: ((divisor * i) + 75) }
		    });
		    cy.$('#'+theId).ungrabify();
		    cy.add({
		    	group: "nodes",
		    	data: {
		    		id: i.toString()
		    	},
		    	position: { x: 2000, y: ((divisor * i) + 75) }
		    });
		    cy.$('#'+i).ungrabify();

		    cy.style()
		        .selector(cy.getElementById(theId))
		            .css({
		                'label': (semestersToLoopOver[semesterIndex] + " " + currentYear)
		            })
		        .update()
		    ;

		    var theEdgeId = "semester_edge_" + i;
		    cy.add({
		    	group: "edges",
		    	data: {
		    		id: theEdgeId,
	        		source: theId,
	        		target: i.toString()
		    	}
		    });

		    semesterIndex = (semesterIndex + 1) % (includeSummerSemesters ? 3 : 2);
		    if (semesterIndex == 0) {
		    	currentYear++;
		    }
		}

		//Add courses
		console.log(userCourses);
		for (course in userCourses) {
			console.log(userCourses[course].x_pos);

			cy.add({
		        group: "nodes",
		        data: {
		            id: course
		        },
		        position: { x: userCourses[course].x_pos, y: userCourses[course].y_pos }
		    });

		    cy.style()
		        .selector(cy.getElementById(course))
		            .css({
		                'label': course.replace('_', ' '),
		                'shape': "roundrectangle",
		                'background-color': "#AAA",
		                'width': 'label',
		                'padding-left': '8px',
		                'padding-right': '8px',
		                'height': 'label',
		                'padding-top': '8px',
		                'padding-bottom': '8px',
		                'text-valign': "center"
		            })
		        .update()
		    ;
		}
	});
}

function populateSchoolDropdown(schoolDropdown) {
	emptyDropdown(schoolDropdown);
	var schoolData = database.ref('/Schools').once("value").then(function(snapshot) {
		var first = true;
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.key == "Engineering and Applied Science") {
				schools.push(childSnapshot.key);
				if (first) {
					first = false;
					selectedSchool = childSnapshot.key;
				}
				var option = document.createElement("option");
				option.text = childSnapshot.key;
				schoolDropdown.add(option);
				var departmentDropdown = document.getElementById("DepartmentDropdown");
				populateDepartmentDropdown(departmentDropdown, childSnapshot.key);

			}
		});
	});
}

function populateDepartmentDropdown(departmentDropdown, selectedSchool2) {
	emptyDropdown(departmentDropdown);
	var departmentData = database.ref('/Schools').child(selectedSchool2).child("Departments").once("value").then(function(snapshot) {
		var first = true;
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.key == "COMPUTER SCIENCE AND ENGINEERING(E81)") {
				departments.push(childSnapshot.key);
				if (first) {
					first = false;
					selectedDepartment = childSnapshot.key;
				}
				var option = document.createElement("option");
				option.text = childSnapshot.key;
				departmentDropdown.add(option);
				populateCourseTable(selectedSchool2, childSnapshot.key);
			}
		});
	});
}

function emptyDropdown(dropdown) {
	while(dropdown.hasChildNodes())
	{
	   dropdown.removeChild(dropdown.firstChild);
	}
}

function emptyTable() {
	var Parent = document.getElementById("course_listing");
	while(Parent.hasChildNodes())
	{
	   Parent.removeChild(Parent.firstChild);
	}
}

function populateCourseTable(selectedSchool2, selectedDepartment2) {
	var coursesData = database.ref('/Schools').child(selectedSchool2).child("Departments").child(selectedDepartment2).child("Courses").once("value").then(function(snapshot) {
		coursesForSchoolDepartment = snapshot.val();

		var courseTable = document.getElementById("course_listing");
		var idCount = 0;
		snapshot.forEach(function(childSnapshot) {
			var tableRow = document.createElement("tr");
			tableRow.setAttribute("draggable", "true");
			tableRow.setAttribute("ondragstart", "drag(event)");
			var courseCodeAsId = childSnapshot.key;
			tableRow.setAttribute("id", courseCodeAsId);
			var tableCol = document.createElement("td");
			var actionCol = document.createElement("td");
			tableCol.classList.add("course_column");
			if (idCount % 2 == 1) {
				tableCol.classList.add("odd_course_column");
			}

			var nameDiv = document.createElement("div");
			var codeDiv = document.createElement("div");
			var unitDiv = document.createElement("div");

			codeDiv.classList.add("code_div");
			unitDiv.classList.add("unit_div");

			nameDiv.append(childSnapshot.val().name);
			codeDiv.append(childSnapshot.val().code);

			if (childSnapshot.val().has_set_credits) {
				unitDiv.append(childSnapshot.val().units);
				if (childSnapshot.val().units == 1) {
					unitDiv.append(" Unit");
				}
				else {
					unitDiv.append(" Units");
				}
			}
			else {
				unitDiv.append("Var. Units");
			}

			tableCol.append(nameDiv);
			tableCol.append(codeDiv);
			tableCol.append(unitDiv);

			tableRow.append(tableCol);
			courseTable.append(tableRow);

			idCount++;
		});
	});
}

// User Sign Out
function sign_out () {
	firebase.auth().signOut().then(function() {
		//Push back to welcome page
		window.location = "http://ec2-18-218-250-72.us-east-2.compute.amazonaws.com/WashUPlan.html";
		alert("Successfully Signed Out");
	}).catch(function(error) {
		//An error occurred... (Not signed in?)
		var errorMessage = error.message;
		var errorCode = error.code;
		alert(errorMessage);
		//alert(errorCode);
	});
}