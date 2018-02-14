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
	var htmlPage = "http://ec2-18-218-250-72.us-east-2.compute.amazonaws.com/CreateAccountSignIn.html";
	fetch_text(htmlPage).then((html) => {
        document.getElementById("surround_modal_content").innerHTML = html;
    }).catch((error) => {
        console.warn(error);
    });

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

function fetch_text (url) {
    return fetch(url).then((response) => (response.text()));
}

function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}



