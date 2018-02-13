// (function() {
// 	var config = {
// 		apiKey: "AIzaSyBJ1LF8ns8WLgNp_qOAby0FwrSGCYvU_iQ",
// 		authDomain: "washuplan.firebaseapp.com",
// 		databaseURL: "https://washuplan.firebaseio.com",
// 		projectId: "washuplan",
// 		storageBucket: "washuplan.appspot.com",
// 		messagingSenderId: "198489680934"
// 	};
// 	firebase.initializeApp(config);

// 	// Get the modal
// 	var modal = document.getElementById('myModal');

// 	// Get the button that opens the modal
// 	var btn = document.getElementById("myBtn");

// 	// Get the <span> element that closes the modal
// 	var span = document.getElementsByClassName("close")[0];

// 	// When the user clicks on the button, open the modal 
// 	btn.onclick = function() {
// 	    modal.style.display = "block";
// 	}

// 	// When the user clicks on <span> (x), close the modal
// 	span.onclick = function() {
// 	    modal.style.display = "none";
// 	}

// 	// When the user clicks anywhere outside of the modal, close it
// 	window.onclick = function(event) {
// 	    if (event.target == modal) {
// 	        modal.style.display = "none";
// 	    }
// 	}
// })();

init = function() {
	// Get the modal
	var modal = document.getElementById('myModal');

	// Get the button that opens the modal
	var btn = document.getElementById("myBtn");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
	    modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}
}



