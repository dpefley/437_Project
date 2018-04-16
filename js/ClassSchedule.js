var cy;
var database;
var currentUserId;

var schools = [];
var selectedSchool = "";
var departments = [];
var selectedDepartment = "";
var coursesForSchoolDepartment = {};

var semesterAndYearObj = {};
var semestersToKeep = [];

var numOfSemesters;
var divisor = 75;

var courseDragged;
var dragSelectedSchool;
var dragSelectedDepartment;

var courseSemester;
var toRemove;

//User Data
// var start;
// var end;
// var include_summer;
// var isNewUser = false;

// Modal Window for Create Account
init = function() {

	//Initialize Firebase
	var config = {
	    apiKey: "AIzaSyBJ1LF8ns8WLgNp_qOAby0FwrSGCYvU_iQ",
	    authDomain: "washuplan.firebaseapp.com",
	    databaseURL: "https://washuplan.firebaseio.com",
	    projectId: "washuplan",
	    storageBucket: "washuplan.appspot.com",
		messagingSenderId: "198489680934"
	};
	firebase.initializeApp(config);

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			database = firebase.database();
			currentUserId = firebase.auth().currentUser.uid;

			database.ref('/Users/' + currentUserId).once("value").then(function(snapshot) {
				var first = true;
				snapshot.forEach(function(childSnapshot) {
					if (childSnapshot.key == "isNewUser") {
						if (childSnapshot.val() == true) {
							var htmlPage = "http://ec2-18-218-250-72.us-east-2.compute.amazonaws.com/GettingStartedModal.html";
							fetch_text(htmlPage).then((html) => {
								document.getElementById("surround_modal_content").innerHTML = html;
							}).then(function() {
						    	var modal = document.getElementById('gettingStartedModal');
								modal.style.display = "block";
				    			populateModalSemesterDropdowns();

				    			document.getElementById('submit_semester_data').addEventListener('click', function() {
							    	var selectedStart = document.getElementById('starting_semesters').value;
							    	var selectedEnd = document.getElementById('ending_semesters').value;
							    	var includeSummerSemestersCheck = document.getElementById('include_summer').checked;
							    	
							    	writeUserInformationOnly(selectedStart, selectedEnd, includeSummerSemestersCheck);

							    });
						    }).catch((error) => {
								console.warn(error);
							});
						}
						else {
							//Initialize Cytoscape
							initializeCytoscape();

							var schoolDropdown = document.getElementById("SchoolDropdown");
							var departmentDropdown = document.getElementById("DepartmentDropdown");
							var searchTextInput = document.getElementById("SearchText");
							var courseTable = document.getElementById("course_listing");

							populateSchoolDropdown(schoolDropdown);

							schoolDropdown.addEventListener("change", function() {
								selectedSchool = schoolDropdown.value;
								emptyTable();
								populateDepartmentDropdown(departmentDropdown);
							});

							departmentDropdown.addEventListener("change", function() {
								selectedDepartment = departmentDropdown.value;
								emptyTable();
								populateCourseTable();
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


							cy.on("free", "node", function(event) {
								resetToDefaultColoring();
								var nodeId = event.target._private.data.id;
								if (event.target._private.position.x < 50 && event.target._private.position.y < 50) {
									cy.remove(cy.getElementById(nodeId));
								}
								else {
									database.ref('Users/' + currentUserId + '/courses').once('value').then(function(userCoursesSnapshot) {
										userCoursesSnapshot.forEach(function(snapshotForSemester) {
											snapshotForSemester.forEach(function(snapshotCourseList) {
												var schoolString = "";
												var departmentString = "";
												if (snapshotCourseList.key == nodeId) {
													snapshotCourseList.forEach(function(propertySnapshot) {
														if (propertySnapshot.key == "school") {
															schoolString = propertySnapshot.val();
														}
														else if (propertySnapshot.key == "department") {
															departmentString = propertySnapshot.val();
														}
													});

													//checkValidSemesters(nodeId, schoolString, departmentString, false);
												}
											});
										});
									}).then(function() {
										var newXVal = computeXVal(event.target._private.position.x);
										var newYVal = computeYVal(event.target._private.position.y);
										cy.$('#'+nodeId).position('x', newXVal);
										cy.$('#'+nodeId).position('y', newYVal);
										
										for (var semesters = 0; semesters < numOfSemesters; semesters++) {
											if (newYVal == cy.getElementById('semester_' + semesters)._private.position.y) {
												courseSemester = cy.getElementById('semester_' + semesters)._private.style.label.value;
											}
										}
										writeUserData(courseSemester, courseDragged, newXVal, false);	
									});
								}
							});

							cy.on("grab", "node", function(event) {
								database.ref('Users/' + currentUserId + '/courses').once('value').then(function(userCoursesSnapshot) {
									userCoursesSnapshot.forEach(function(snapshotForSemester) {
										snapshotForSemester.forEach(function(snapshotCourseList) {
											var schoolString = "";
											var departmentString = "";
											if (snapshotCourseList.key == event.target[0]._private.data.id) {
												snapshotCourseList.forEach(function(propertySnapshot) {
													if (propertySnapshot.key == "school") {
														schoolString = propertySnapshot.val();
													}
													else if (propertySnapshot.key == "department") {
														departmentString = propertySnapshot.val();
													}
												});

												checkValidSemesters(event.target[0]._private.data.id, schoolString, departmentString, true);
											}
										});
									});
								}).then(function() {
									var newXVal = computeXVal(event.target._private.position.x);
									var newYVal = computeYVal(event.target._private.position.y);

									courseDragged = event.target[0]._private.data.id;
									cy.$('#'+courseDragged).position('x', newXVal);
									//cy.$('#'+courseDragged).position('y', newYVal);

									for (var semesters = 0; semesters < numOfSemesters; semesters++) {
										if (newYVal == cy.getElementById('semester_' + semesters)._private.position.y) {
											courseSemester = cy.getElementById('semester_' + semesters)._private.style.label.value;
										}
									}
									toRemove = courseDragged.replace(' ', '_');
								})
								.then(function() {
									database.ref('/Users/' + currentUserId + '/courses/' + courseSemester + '/' + toRemove).once("value").then(function(snapshot) {
										console.log('/Users/' + currentUserId + '/courses/' + courseSemester + '/' + toRemove);
										snapshot.forEach(function(childSnapshot) {
											switch (childSnapshot.key) {
												case "school":
													dragSelectedSchool = childSnapshot.val();
													break;
												case "department":
													dragSelectedDepartment = childSnapshot.val();
													break;
											}
										});
									}).then(function() {
										deleteUserData(courseSemester, toRemove);
									});
								});
							});
						}
					}
				});
			});
		}
		else {
			window.location = "WashUPlan.html";
		}
	});
}

function fetch_text (url) {
    return fetch(url).then((response) => (response.text()));
}

function populateModalSemesterDropdowns() {
	var startingSemesters = ["Fall 2018"];
	var endingSemesters = ["Spring 2022"];

	// var fallText = "Fall ";
	// var springText = "Spring ";
	// var summerText = "Summer ";

	// var todaysDate = new Date();
	// var thisYear = todaysDate.getFullYear();

	// for(var i = 0; i < 8; i++) {
	// 	var year = thisYear - i;
	// 	var fallSemesterText = fallText + year;
	// 	startingSemesters.push(fallSemesterText);

	// 	var summerSemesterText = summerText + year;
	// 	startingSemesters.push(summerSemesterText);

	// 	var springSemesterText = springText + year;
	// 	startingSemesters.push(springSemesterText);
	// }
	createOptionsForStartingEndingSemesterDropdowns(startingSemesters, "starting_semesters");

	// for(var i = 0; i < 12; i++) {
	// 	var year = thisYear - i + 8;
	// 	var fallSemesterText = fallText + year;
	// 	endingSemesters.push(fallSemesterText);

	// 	var summerSemesterText = summerText + year;
	// 	endingSemesters.push(summerSemesterText);

	// 	var springSemesterText = springText + year;
	// 	endingSemesters.push(springSemesterText);
	// }
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
	resetToDefaultColoring();
	
	var hasClass = false;
	database.ref('Users/' + currentUserId + '/courses').once('value').then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			childSnapshot.forEach(function(courseSnapshot) {
				if (courseSnapshot.key == courseDragged) {
					hasClass = true;
				}
			});
		});
	})
	.then(function() {
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
			            id: courseDragged
			        },
			        position: { x: xVal, y: yVal }
			    });

			    cy.style()
			        .selector(cy.getElementById(courseDragged))
			            .css({
			                'label': courseDragged.replace('_', ' '),
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
		        
	    		for (var semesters = 0; semesters < numOfSemesters; semesters++) {
	    			if (yVal == cy.getElementById('semester_' + semesters)._private.position.y) {
	    				courseSemester = cy.getElementById('semester_' + semesters)._private.style.label.value;
	    			}
	    		}
	    		writeUserData(courseSemester, courseDragged, xVal, true);
			}
		}
		
	})
	.then(function() {
		checkForPrerequisites(courseDragged);
	});
}

function checkValidSemesters(courseID, school, department, highlightRows) {
	database.ref('Schools/' + school + '/Departments/' + department + '/Courses/' + courseID).once('value').then(function(snapshot) {
		snapshot.forEach(function(yearSnapshot) {
			if (yearSnapshot.key == "years") {
				var semesters = [];
				yearSnapshot.forEach(function(semesterSnapshot) {
					var semestersAvailableForYear = semesterSnapshot.val();
					for (var i = 0; i < semestersAvailableForYear.length; i++) {
						var semesterString = semestersAvailableForYear[i] + " " + semesterSnapshot.key;
						semesters.push(semesterString);
					}
				});
				semestersToKeep = semesters;
			}
		});
	}).then(function() {
		if (highlightRows) {
			highlightValidSemestersToPlaceCourse(semestersToKeep);
		}
	})
}

function highlightValidSemestersToPlaceCourse() {
	var indexesToHighlight = [];

	var count = 0;
	for (semester in semesterAndYearObj) {
		if (semestersToKeep.indexOf(semester) != -1) {
			indexesToHighlight.push(count);
		}
		count++;
	}

	for (i = 0; i < indexesToHighlight.length; i++) {
		var semesterString = "semester_edge_" + indexesToHighlight[i];

		cy.style()
	        .selector(cy.getElementById(semesterString))
	            .css({
	                'line-color': 'blue'
	            })
	        .update()
	    ;
	}
}

function resetToDefaultColoring() {
	var count = 0;
	for (semester in semesterAndYearObj) {
		count++;
	}

	for (i = 0; i < count; i++) {
		var semesterString = "semester_edge_" + i;

		cy.style()
	        .selector(cy.getElementById(semesterString))
	            .css({
	                'line-color': '#989898'
	            })
	        .update()
	    ;
	}
}

function checkForPrerequisites(courseID) {
	
}

function writeUserData(courseSemester, courseID, x_pos, new_course) {
	if (new_course) {
		database.ref('Users/' + currentUserId + '/courses/' + courseSemester + '/' + courseID).set({
			x_pos: x_pos == undefined ? null : x_pos,
			department: selectedDepartment == undefined ? null : selectedDepartment,
			school: selectedSchool == undefined ? null : selectedSchool
		});
	}
	else {
		database.ref('Users/' + currentUserId + '/courses/' + courseSemester + '/' + courseID).update({
			x_pos: x_pos == undefined ? null : x_pos,
			department: dragSelectedDepartment == undefined ? null : dragSelectedDepartment,
			school: dragSelectedSchool == undefined ? null : dragSelectedSchool
		});
	}
}

function writeUserInformationOnly(start, end, include_summer) {
	database.ref('Users/' + currentUserId).update({
		start_semester: start == undefined ? null : start,
		end_semester: end == undefined ? null : end,
		include_summer_semesters: include_summer == undefined ? null : include_summer,
		isNewUser: false 
	}).then(function() {
		location.reload();
	});
}

function deleteUserData(courseSemester, courseID) {
		database.ref('Users/' + currentUserId + '/courses/').once("value").then(function(outerSnapshot) {
			outerSnapshot.forEach(function(innerSnapshot) {
				innerSnapshot.forEach(function(childSnapshot) {
					if (childSnapshot.key == courseID) {
						console.log(outerSnapshot.key);
						console.log(innerSnapshot.key);
						database.ref('Users/' + currentUserId + '/courses/' + innerSnapshot.key + '/').child(courseID).remove();
					}
				});
			});
		});
		//database.ref('Users/' + currentUserId + '/courses/' + courseSemester + '/').child(courseID).remove();
}

function computeYVal(yVal) {
	//use divisor starting at 75
	//numOfSemesters = Math.round(575.0 / divisor);

	//var newYVal = 0;
	// for (i = 1; i <= numOfSemesters; i++) {
	// 	if (yVal <= (650 + (divisor / 2)) - (divisor * i)) {
	// 		newYVal = 75 + (divisor * (numOfSemesters - i));
	// 	}
	// 	if (yVal > (650 - (divisor / 2))) {
	// 		newYVal = (650 - divisor);
	// 	}
	// 	if (yVal < 75) {
	// 		newYVal = 75;
	// 	}
	// }

	var newYVal = 75;
	var distance = 1000;

	//semesterAndYearObj... NEW WAY
	for (semesterObject in semesterAndYearObj) {
		if (semestersToKeep.indexOf(semesterObject) != -1) {
			if (Math.abs(yVal - semesterAndYearObj[semesterObject].y_pos) <= distance) {
				newYVal = semesterAndYearObj[semesterObject].y_pos;
				distance = Math.abs(yVal - semesterAndYearObj[semesterObject].y_pos);
			}
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
	courseDragged = ev.path[0].childNodes[0].childNodes[1].childNodes[0].data.trim().replace(' ', '_');
	checkValidSemesters(courseDragged, selectedSchool, selectedDepartment, true);
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

function addSemesterRows() {
	var includeSummerSemesters = true;
	var startYear = 0;
	var endYear = 0;
	var startSemester = "";
	var endSemester = "";
	var userCourses = {};

	database.ref('/Users/' + currentUserId).once("value").then(function(snapshot) {
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

		numOfSemesters = (endYear - startYear + 1) * (includeSummerSemesters ? 3 : 2);
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
			var semesterAndYearString = semestersToLoopOver[semesterIndex] + " " + currentYear;

			var obj = {};
			obj["y_pos"] = ((divisor * i) + 75);

			semesterAndYearObj[semesterAndYearString] = obj;

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
		                'label': semesterAndYearString
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
		resetToDefaultColoring();

		//Add courses
		//console.log(userCourses);
		//console.log(semesterAndYearObj);
		for (semester in userCourses) {
			for (course in userCourses[semester]) {
				if (semester in semesterAndYearObj) {
					var yPosition = semesterAndYearObj[semester].y_pos;
					var xPosition = userCourses[semester][course].x_pos;

					cy.add({
				        group: "nodes",
				        data: {
				            id: course
				        },
				        position: { x: xPosition, y: yPosition }
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
			}
		}
	});
}

function populateSchoolDropdown(schoolDropdown) {
	emptyDropdown(schoolDropdown);
	database.ref('/Schools').once("value").then(function(snapshot) {
		var first = true;
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.key == "Engineering and Applied Science") {
				//schools.push(childSnapshot.key);
				if (first) {
					first = false;
					selectedSchool = childSnapshot.key;
				}
				var option = document.createElement("option");
				option.text = childSnapshot.key;
				schoolDropdown.add(option);
			}
		});
	})
	.then(function() {
		var departmentDropdown = document.getElementById("DepartmentDropdown");
		populateDepartmentDropdown(departmentDropdown);
	});
}

function populateDepartmentDropdown(departmentDropdown) {
	emptyDropdown(departmentDropdown);
	var departmentData = database.ref('/Schools').child(selectedSchool).child("Departments").once("value").then(function(snapshot) {
		var first = true;
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.key == "COMPUTER SCIENCE AND ENGINEERING(E81)") {
				//departments.push(childSnapshot.key);
				if (first) {
					first = false;
					selectedDepartment = childSnapshot.key;
				}
				var option = document.createElement("option");
				option.text = childSnapshot.key;
				departmentDropdown.add(option);
			}
		});
	})
	.then(function() {
		populateCourseTable();
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

function populateCourseTable() {
	var coursesData = database.ref('/Schools').child(selectedSchool).child("Departments").child(selectedDepartment).child("Courses").once("value").then(function(snapshot) {
		coursesForSchoolDepartment = snapshot.val();

		var courseTable = document.getElementById("course_listing");
		var idCount = 0;
		snapshot.forEach(function(childSnapshot) {
			var tableRow = document.createElement("tr");
			tableRow.setAttribute("draggable", "true");
			tableRow.setAttribute("ondragstart", "drag(event)");
			tableRow.setAttribute("ondragend", "resetToDefaultColoring()");
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

function direct_to_settings() {
	window.location = "AccountSettings.html";
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