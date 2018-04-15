
init = function() {
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

function forgotPassword() {
	var user = firebase.auth().currentUser;
	var emailAddress;
	if (user != null) {
		emailAddress = user.email;
		firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
			alert("An email has been sent to: " + emailAddress);
		}).catch(function(error) {
		  // An error happened.
		});
	}
	else {}
}