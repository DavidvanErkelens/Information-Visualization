// Code by David van Erkelens, 10264019
// me@davidvanerkelens.nl // david.vanerkelens@student.uva.nl

// Also published on Github.com, see
// https://github.com/DavidvanErkelens/Information-Visualization

// Function for assignment 1
var assignmentOne = function() {
    // We're ready!
    alert("Script successfully loaded!");
};


// Function for assingment 2
var assignmentTwo = function() {
    // create boolean
    var b = true;

    // create string
    var s = "String";

    // create integer
    var i = 15;

    // create array
    var a = ['this', 'makes', 'no', 'sense', 'for', 'a', 'computer', 'science', 'graduate'];

    // Loop over just created variables
    [b, s, i, a].forEach(function(element) {
        console.log(typeof(element) + " has value " + element);
    });
};

// Function for assignment 3
var assignmentThree = function() {

    // Create emtpy arrays
    var arrayOne = [], arrayTwo = [];

    // Create random arrays
    for (var i = 0; i < 10; i++) {
        // Two random values
        arrayOne[i] = Math.floor((Math.random() * 10) + 1);
        arrayTwo[i] = Math.floor((Math.random() * 10) + 1);        
    }

    // Print created arrays
    console.log("Array one: " + arrayOne);
    console.log("Array two: " + arrayTwo);

    // Create sum array
    var arraySum = arrayOne.map(function(value, index) {
        return value + arrayTwo[index];
    }).filter(function(value, index) { return index % 2 == 0; });

    // Print resulting array
    console.log("Sum array: " + arraySum);
};

// Function for assignment 4
var assignmentFour = function(start, end) {
    // Sanitize input
    start = +start;
    end = +end;

    // Loop over input
    for (var i = start; i < end; i++)
    {
        // If it's dividable by 3 and 5, print 'InfoViz'
        if (i % 3 == 0 && i % 5 == 0) console.log("InfoViz");

        // Only dividable by 3, print 'Info'
        else if (i % 3 == 0) console.log("Info");

        // Only dividable by 5? Print 'Viz'
        else if (i % 5 == 0) console.log("Viz");

        // Else just print the number
        else console.log(i);
    }
};

// Function for assignment 5
var assignmentFive = function() {

    // Add onKeyDown 
    document.onkeydown = function (e) {

        // Get the event
        e = e || window.event;

        // Pop up the pressed key, since that is apparently something
        // that we want. I don't know why.
        alert(e.keyCode + " (which has string value " + String.fromCharCode(e.keyCode) + ")");
    }
};

// Execute assignments
assignmentOne();
assignmentTwo();
assignmentThree();
assignmentFour(1, '17');
assignmentFive();

