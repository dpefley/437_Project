var chosenSemester;
var chosenSchool;
var chosedDepartment;

var testSemesters = {
	0: "Fall 2018",
	1: "Spring 2019",
	2: "Fall 2019",
	3: "Spring 2020",
	4: "Fall 2020",
	5: "Spring 2021",
	6: "Fall 2021",
	7: "Spring 2022"
};

var testSchools = {
	"Architecture": {
		"Departments": [
			"ARCHITECTURE(A46)",
			"LANDSCAPE ARCHITECTURE(A48)",
			"URBAN DESIGN(A49)"
		]
	},
	"Art": {
		"Departments": [
			"ART(F00)",
			"ART (CORE AND MAJOR STUDIES COURSES)(F10)",
			"ART (ELECTIVE STUDIO COURSES)(F20)"
		]
	},
	"Arts & Sciences": {
		"Departments": [
			"AFRICAN AND AFRICAN-AMERICAN STUDIES(L90)",
			"AMERICAN CULTURE STUDIES(L98)",
			"ANTHROPOLOGY(L48)",
			"ARABIC(L49)",
			"ARCHAEOLOGY(L52)",
			"ART HISTORY AND ARCHAEOLOGY(L01)",
			"ASIAN AMERICAN STUDIES(L46)",
			"BIOLOGY AND BIOMEDICAL SCIENCES(L41)",
			"CENTER FOR THE HUMANITIES(L56)",
			"CHEMISTRY(L07)",
			"CHILDREN'S STUDIES(L66)",
			"CHINESE(L04)",
			"CLASSICS(L08)",
			"COLLEGE WRITING PROGRAM(L59)",
			"COMPARITIVE LITERATURE(L16)",
			"DANCE(L29)",
			"DRAMA(L15)",
			"EARTH AND PLANETARY SCIENCES(L19)",
			"EAST ASIAN STUDIES(L03)",
			"ECONOMICS(L11)",
			"EDUCATION(L12)",
			"ENGLISH LITERATURE(L14)",
			"ENVIRONMENTAL STUDIES(L82)",
			"EUROPEAN STUDIES(L79)",
			"FILM AND MEDIA STUDIES(L53)",
			"FIRST-YEAR PROGRAMS(L61)",
			"FRENCH(L34)",
			"GENERAL STUDIES(L43)",
			"GERMANIC LANGUAGES AND LITERATURES(L21)",
			"GREEK(L09)",
			"HEBREW(L74)",
			"HINDI(L73)",
			"HISTORY(L22)",
			"INTERDISCIPLINARY PROJECT IN THE HUMANITIES(L93)",
			"INTERNATIONAL AND AREA STUDIES(L97)",
			"ITALIAN(L36)",
			"JAPANESE(L05)",
			"JEWISH, ISLAMIC AND NEAR EASTERN STUDIES(L75)",
			"KOREAN(L51)",
			"LATIN(L10)",
			"LATIN AMERICAN STUDIES(L45)",
			"LEGAL STUDIES(L84)",
			"LINGUISTICS(L44)",
			"MATHEMATICS(L24)",
			"Medical Humanities(L85)",
			"MIND, BRAIN, AND BEHAVIOR(L96)",
			"MOVEMENT SCIENCES(L63)",
			"MUSIC(L27)",
			"OVERSEAS PROGRAMS(L99)",
			"PATHFINDER PROGRAM(L54)",
			"PERSIAN(L47)",
			"PHILOSOPHY(L30)",
			"PHILOSOPHY-NEUROSCIENCE-PSYCHOLOGY(L64)",
			"PHYSICAL EDUCATION(L28)",
			"PHYSICS(L31)",
			"POLITICAL ECONOMY(L50)",
			"POLITICAL SCIENCE(L32)",
			"PORTUGUESE(L37)",
			"PRAXIS(L62)",
			"PSYCHOLOGICAL & BRAIN SCIENCES(L33)",
			"RELIGION AND POLITICS(L57)",
			"RELIGIOUS STUDIES(L23)",
			"ROMANTIC LANGUAGES AND LITERATURES(L78)",
			"RUSSIAN(L39)",
			"RUSSIAN STUDIES(L83)",
			"SOCIOLOGY(L40)",
			"SPANISH(L38)",
			"SPEECH AND HEARING(L89)",
			"THE GRADUATE SCHOOL(LGS)",
			"URBAN STUDIES(L18)",
			"WOMEN, GENDER, AND SEXUALITY STUDIES(L77)",
			"WRITING(L13)"
		]
	},
	"Business": {
		"Departments": [
			"ACCOUNTING(B50)",
			"ACCOUNTING(B60)",
			"ADMINISTRATION(B51)",
			"FINANCE(B62)",
			"FINANCE(B52)",
			"HUMAN RESOURCE MANAGEMENT(B56)",
			"INTERNATIONAL STUDIES(B99)",
			"MANAGEMENT(B63)",
			"MANAGEMENT(B53)",
			"MANAGERIAL ECONOMICS(B54)",
			"MANAGERIAL ECONOMICS(B64)",
			"MARKETING(B65)",
			"MARKETING(B55)",
			"OPER & MANUFACTURING MGMT(B67)",
			"Oper & Manufacturing Mgmt(B57)",
			"OPERATIONS AND SUPPLY CHAIN MANAGEMENT(B58)",
			"ORGANIZATIONAL BEHAVIOR(B66)",
			"QUANTITATIVE BUS ANALYSIS(B59)"
		]
	},
	"Design & Visual Arts": {
		"Departments": [
			"DESIGN & VISUAL ARTS - CORE(X10)",
			"DESIGN & VISUAL ARTS - ELECTIVE(X20)",
			"DESIGN & VISUAL ARTS - STUDY ABROAD(X99)"
		]
	},
	"Engineering and Applied Science": {
		"Departments": [
			"BIOMEDICAL ENGINEERING(E62)",
			"COMPUTER SCIENCE AND ENGINEERING(E81)",
			"ELECTRICAL AND SYSTEMS ENGINEERING(E35)",
			"ENERGY, ENVIRONMENTAL, AND CHEMICAL ENGR(E44)",
			"GENERAL ENGINEERING(E60)",
			"MECHANICAL ENGINEERING & MATERIALS SCIENCE(E37)"
		]
	},
	"Engineering Continuing Studies": {
		"Departments": [
			"CONSTRUCTION MANAGEMENT(T64)",
			"ENGINEERING MANAGEMENT(T55)",
			"GENERAL PROFESSIONAL EDUCATION(T60)",
			"HEALTH CARE OPERATIONS(T71)",
			"INFORMATION MANAGEMENT(T81)",
			"SYSTEMS INTEGRATION(T40)"
		]
	},
	"Interdisciplinary Programs": {
		"Departments": [
			"INST OF MATERIAL SCI & ENGINEERING(I52)",
			"INTERDISCIPLINARY STUDIES(I50)",
			"MILITARY AEROSPACE SCIENCES(I02)",
			"MILITARY SCIENCES(I25)"
		]
	},
	"Law": {
		"Departments": [
			"LAW(W75)",
			"LAW(W76)",
			"LAW(W77)",
			"LAW(W78)",
			"LAW(W79)",
			"LAW ONLINE(W80)",
			"LAW SCHOOL(W74)"
		]
	},
	"Medicine": {
		"Departments": [
			"Anatomy and Neurobiology(M05)",
			"Anesthesiology(M10)",
			"Applied Health Behavior Research(M88)",
			"Audiology and Communication Sciences(M89)",
			"Biochemistry and Molecular Biophysics(M15)",
			"Biostatistics and Genetic Epidemiology(M21)",
			"Cell Biology and Physiology(M75)",
			"Clinical Investigation(M17)",
			"Elective Program-WUMS I(M04)",
			"Genetics(M20)",
			"Internal Medicine(M25)",
			"Molecular Biology and Pharmacology(M70)",
			"Molecular Microbiology(M30)",
			"Neurological Surgery(M40)",
			"Neurology(M35)",
			"Obstetrics and Gynecology(M45)",
			"Occupational Therapy Program(M01)",
			"Ophthalmology and Visual Sciences(M50)",
			"Otolaryngology(M55)",
			"Pathology(M60)",
			"Pediatrics(M65)",
			"Physical Therapy Program-Grad(M02)",
			"Population Health Sciences(M19)",
			"Psychiatry(M85)",
			"Radiology(M90)",
			"Research(M99)",
			"Surgery(M95)"
		]
	},
	"Social Work & Public Health": {
		"Departments": [
			"COMMUNITY DEVELOPMENT(S60)",
			"COMMUNITY DEVELOPMENT(S65)",
			"CORE(S15)",
			"DIRECT PRACTICE(S30)",
			"DIRECT PRACTICE(S31)",
			"DOCTORAL(S90)",
			"FAMILY THERAPY(S85)",
			"HIST & PROFESSIONAL THEME(S20)",
			"INDEPENDENT STUDY(S81)",
			"INDEPENDENT STUDY(S82)",
			"PRACTICUM(S70)",
			"PUBLIC HEALTH(S55)",
			"SOCIAL ADMINISTRATION(S50)",
			"SOCIAL POLICY(S40)",
			"SOCIAL POLICY(S48)",
			"SOCIAL WORK(S80)"
		]
	},
	"University College": {
		"Departments": [
			"AFRICAN AND AFRICAN AMERICAN STUDIES(U84)",
			"AMERICAN CULTURE STUDIES(U89)",
			"ANTHROPOLOGY(U69)",
			"ARABIC(U35)",
			"ART(U79)",
			"ART HISTORY AND ARCHAEOLOGY(U10)",
			"BIOLOGY(U29)",
			"BUSINESS(U44)",
			"CHEMISTRY(U05)",
			"CHINESE(U38)",
			"CLASSICS(U02)",
			"CLINICAL RESEARCH MANAGEMENT(U80)",
			"COMMUNICATIONS(U48)",
			"COMPARATIVE LITERATURE(U32)",
			"COMPUTERS AND INFO MGMT(U82)",
			"DANCE(U31)",
			"DLA SEMINARS(U96)",
			"DRAMA(U21)",
			"EARTH AND PLANETARY SCIENCES(U13)",
			"EAST ASIAN STUDIES(U78)",
			"ECONOMICS(U07)",
			"EDUCATION(U08)",
			"ENGLISH AND AMERICAN LITERATURE(U65)",
			"ENGLISH COMPOSITION(U11)",
			"ENGLISH LANGUAGE PROGRAMS(U15)",
			"FILM AND MEDIA STUDIES(U18)",
			"FRENCH(U12)",
			"GENERAL STUDIES(U03)",
			"GEOGRAPHIC INFORMATION SYSTEMS(U90)",
			"GERMANIC LANGUAGES AND LITERATURES(U14)",
			"HEALTH CARE(U86)",
			"HEBREW(U37)",
			"HINDI(U73)",
			"HISTORY(U16)",
			"HUMAN RESOURCES MANAGEMENT(U87)",
			"INTERNATIONAL AFFAIRS(U85)",
			"INTERNATIONAL STUDIES(U43)",
			"IRISH LANGUAGE AND LITERATURE(U47)",
			"ITALIAN(U40)",
			"JAPANESE(U36)",
			"JEWISH, ISLAMIC, AND NEAR EASTERN STUDIES(U94)",
			"JOURNALISM(U49)",
			"KOREAN(U51)",
			"LATIN AMERICAN STUDIES(U67)",
			"LINGUISTICS(U91)",
			"MATHEMATICS(U20)",
			"MLASEMINARS(U98)",
			"MUSIC(U24)",
			"NONPROFIT MANAGEMENT(U76)",
			"PHILOSOPHY(U22)",
			"PHYSICS(U23)",
			"POLITICAL SCIENCE(U25)",
			"PORTUGUESE(U26)",
			"PSYCHOLOGY(U09)",
			"RELIGIOUS STUDIES(U66)",
			"RUSSIAN(U39)",
			"SCANDINAVIAN(U93)",
			"SCIENCE(U74)",
			"SOCIOLOGY(U68)",
			"SPANISH(U27)",
			"SPEECH(U30)",
			"SUSTAINABILITY(U19)",
			"WOMEN, GENDER, AND SEXUALITY STUDIES(U92)"
		]
	}
};

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

	var semesterDropdown = document.getElementById("SemesterDropdown");
	var schoolDropdown = document.getElementById("SchoolDropdown");
	var departmentDropdown = document.getElementById("DepartmentDropdown");
	var courseTable = document.getElementById("course_listing");

	semesterDropdown.addEventListener("change", function() {
		if (semesterDropdown.value() != "Select Semester") {
			schoolDropdown.style.display = "block";
		}
		else {
			schoolDropdown.style.display = "none";
			schoolDropdown.value("Select School");
			departmentDropdown.style.display = "none";
			departmentDropdown.value("Select Department");
			courseTable.empty();
		}
	});

	schoolDropdown.addEventListener("change", function() {
		if (schoolDropdown.value() != "Select School") {
			departmentDropdown.style.display = "block";
		}
		else {
			departmentDropdown.style.display = "none";
			departmentDropdown.value("Select Department");
			courseTable.empty();
		}
	});

	departmentDropdown.addEventListener("change", function() {
		if (departmentDropdown.value() != "Select Department") {
			populateCourseTable();
		}
		else {
			courseTable.empty();
		}
	});

	}
}

function populateCourseTable() {

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