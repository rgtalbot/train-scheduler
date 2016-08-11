// Initialize Firebase
var config = {
    apiKey: "AIzaSyBqIZE5m4KZXpqaBIOvW2h9cDK7xLKDPhM",
    authDomain: "train-scheduler-0621.firebaseapp.com",
    databaseURL: "https://train-scheduler-0621.firebaseio.com",
    storageBucket: "train-scheduler-0621.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

$("#addTrain").on("click", function(event) {
    event.preventDefault();

    console.log('working');

    //grabs user input
    var trainName = $('#trainName').val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();

    //Creates local "temporary" object for train data
    var newTrain = {
        name: trainName,
        dest: destination,
        first: firstTrain,
        freq: frequency,
    }

    //push new train object to firebase
    database.ref().push(newTrain);

    $('#trainName').val('');
    $('#destination').val('');
    $('#firstTrain').val('');
    $('#frequency').val('');

    return false;
});


database.ref().on('child_added', function(snapshot, value) {

    var trainName = snapshot.val().name;
    var destination = snapshot.val().dest;
    var firstTrain = snapshot.val().first;
    var frequency = snapshot.val().freq;

    //First time (pushed back 1 year to make sure it comes before current time)
    var startTime = moment(firstTrain, 'hh:mm');
    console.log(moment(startTime).format('hh:mm'));

    //current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    //difference between times
    var diffTime = moment().diff(moment(startTime), "minutes");
    console.log("Difference in time: " + diffTime);

    //Time Apart (remainder)
    var remainder = diffTime % frequency;
    console.log(remainder);

    //Minutes until train
    var minutesAway = frequency - remainder;
    console.log("minutes till train: " + minutesAway);

    //Next train
    var nextTrain = moment().add(minutesAway, "minutes");
    console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

    $('.tableTrain').append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + minutesAway + "</td></tr>");
});




