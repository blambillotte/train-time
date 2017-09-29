

//  Initialize Firebase
var config = {
  apiKey: "AIzaSyAKIdZ9FSYBWUlTc8xBATorqoXyguUgRBI",
  authDomain: "bootcamp-train-time.firebaseapp.com",
  databaseURL: "https://bootcamp-train-time.firebaseio.com",
  projectId: "bootcamp-train-time",
  storageBucket: "",
  messagingSenderId: "4008228177"
};
firebase.initializeApp(config);

var database = firebase.database();

//DOM Elements
//Inputs

var submitBtn = $('#submit-btn');
var trainTable = $('#train-table');

var trainName = $('#train-name');
var trainDestination = $('#destination');
var trainStartTime = $('#first-start-time');
var trainFrequency = $('#frequency');

//On Click Function for our button

submitBtn.on('click', function(event) {

  event.preventDefault();
  // debugger
  console.log('clicked');
  console.log(trainName.val().trim());
  console.log(trainDestination.val().trim());
  console.log(trainStartTime.val().trim());
  console.log(trainFrequency.val().trim());

  //Check for empty fields
  checkform(event);

});


function saveToDB() {

  database.ref().push({
    trainName: trainName.val().trim(),
    trainDestination: trainDestination.val().trim(),
    trainStartTime: trainStartTime.val().trim(),
    trainFrequency: trainFrequency.val().trim(),
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

}


function clearEntries() {
  trainName.val('');
  trainDestination.val('');
  trainStartTime.val('');
  trainFrequency.val('');
}

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref().on("child_added", function(childSnapshot) {


  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val().trainName);
  console.log(childSnapshot.val().trainDestination);
  console.log(childSnapshot.val().trainStartTime);
  console.log(childSnapshot.val().trainFrequency);

  //Get the value for Months Worked
  //Start date into a Moment Object
  //How many months from Today

  var newRow = $('<tr>');

  var nameTd = $('<td>').html(childSnapshot.val().trainName);
  var destinationTd = $('<td>').html(childSnapshot.val().trainDestination);
  var frequencyTd = $('<td>').html(childSnapshot.val().trainFrequency);

  var startTime = childSnapshot.val().trainStartTime;

  var timeCalc = getNextTrainTime(childSnapshot.val().trainFrequency, startTime);
  var nextArrivalTd = $('<td>').html(timeCalc.nextArrivalTime);
  var minutesAwayTd = $('<td>').html(timeCalc.tMinutesTillTrain);

  console.log(timeCalc);
  //full list of items to the well
  console.log(nameTd);
  newRow.append(nameTd, destinationTd, frequencyTd, nextArrivalTd, minutesAwayTd);
  //  "<td>" + 'placeholder' + "</td>" + "<td>" + 'placeholder' + "</td>"
  console.log(newRow);
  trainTable.append(newRow);

// Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


function getNextTrainTime(frequencyVal, startTimeVal) {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(startTimeVal, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequencyVal;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequencyVal - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextArrivalTime = moment(nextTrain).format("hh:mm A");

    return {
      nextArrivalTime: nextArrivalTime,
      tMinutesTillTrain: tMinutesTillTrain
    };

  }


function checkform(form) {
    var formInvalid = false;
    $('#form input').each(function() {
      if ($(this).val() === '') {
        formInvalid = true;
      }
    });

    if (formInvalid) {
      alert('All Fields Must Be Completed');
    } else {
      saveToDB();
      clearEntries();
    }
}
