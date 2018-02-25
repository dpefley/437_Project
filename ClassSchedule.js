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
}

// User Sign Out
function sign_out () {
	firebase.auth().signOut().then(function() {
		//Push back to welcome page
	}).catch(function(error) {
		//An error occurred... (Not signed in?)
	});
	window.location = "http://ec2-18-218-250-72.us-east-2.compute.amazonaws.com/WashUPlan.html";
}