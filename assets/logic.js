//initialize Firebase
  var config = {
    apiKey: "AIzaSyDhdR50VKazNbfHT9oAvBqvTqMRdETHL50",
    authDomain: "trainscheduler-684b4.firebaseapp.com",
    databaseURL: "https://trainscheduler-684b4.firebaseio.com",
    projectId: "trainscheduler-684b4",
    storageBucket: "trainscheduler-684b4.appspot.com",
    messagingSenderId: "554982510084"
  };
  firebase.initializeApp(config);

//variable to reference firebase database
var database = firebase.database();

//set inital variables
var trainName = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = "";

function reset() {
  $("#name-input").val("");
  $('#dest-input').val("");
  $('#time-input').val("");
  $('#frequency-input').val("");
}

//click event for submit button
$('#submit-btn').on("click", function(event) {

	//prevent default action
	event.preventDefault();

	//get input values, store
	trainName = $('#name-input').val().trim();
	trainDestination = $('#dest-input').val().trim()
	firstTrainTime = moment($('#time-input').val().trim(), "HH:mm").format("HH:mm");
	trainFrequency = $('#frequency-input').val();

	//push the data to firebase
	database.ref().push({
		name : trainName,
		destination : trainDestination,
		firstTrain : firstTrainTime,
		frequency : trainFrequency
	});

	//clear the text boxes once clicked
	reset();

});

//create firebase event listener, adds train data to database and new row to html
database.ref().on("child_added", function(snapshot){

	//set variable to reference the data returned
	//trainId
	var data = snapshot.val();

	//store the data from the child into variables
	trainName = data.name;
	trainDestination = data.destination;
	firstTrainTime = data.firstTrain;
	trainFrequency = data.frequency;

	//convert first train time
	var firstTimeConverted = moment(firstTrainTime, "HH:mm");

	//find difference between current time and the first train time, store
	var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");

	//calculate minutes until next train, store
	var minutesAway = trainFrequency - (timeDiff % trainFrequency);

	//calculate next arrival time, store
	var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");

	//append new row to display panel
	var newRow = "<tr> \
	   <td>" + trainName + "</td> \
	   <td>" + trainDestination + "</td> \
	   <td>" + trainFrequency + "</td> \
	   <td>" + nextArrival + "</td> \
	   <td>" + minutesAway + "</td> \
	   </tr>";
	$("#train-schedule-display").append(newRow);

}, 
	//catch errors and log
	function(errorObject) {
		console.log("Error: " + errorObject.code);
});

//refresh data, 2 minutes
//not a fan of this, but don't have another solution in mind
setInterval(function(){
	location.reload();
}, 120000)

