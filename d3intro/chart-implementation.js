// Code for visualization of temperature data
// Also published on Github.com, see
// https://github.com/DavidvanErkelens/Information-Visualization

// Code by David van Erkelens, 10264019
// me@davidvanerkelens.nl // david.vanerkelens@student.uva.nl

// Initial parameters for visualization
var imageWidth = 750;
var imageHeight = 450;
var scaleFactor = 1;
var padding = 50;
var topMargin = 50;

// Store keycodes used for keybindings
var leftKeyCode = '37';
var rightKeyCode = '39';

// Create scale for x axis
var xScale = d3.scaleBand()
    .range([0, imageWidth])
    .padding(0.1);

// Create scale for y axis
var yScale = d3.scaleLinear()
    .range([0, imageHeight]);

// Set width and height of canvas
var canvas = d3.select(".chart")
    .attr("width", imageWidth + 2 * padding)
    .attr("height", imageHeight + 2 * padding + topMargin);

// Create padded container in canvas for visualization
var chart = canvas.append("g")
    .attr("transform", "translate(" + padding + ", " + (padding + topMargin) + ")")
    .attr("width", imageWidth)
    .attr("height", imageHeight);

// Add text with year of visualization
var headerText = canvas.append("text")
    .attr("class", "header")
    .attr("transform", "translate(" + (imageWidth + 2 * padding) / 2 + ", 50)")
    .text("Loading data...");

// Add text to show detailed average temperature
var subText = canvas.append("text")
    .attr("class", "subText")
    .attr("class", "hidden")
    .attr("transform", "translate(" + (imageWidth + 2 * padding) / 2 + ", 70)")
    .text("Average...");

// Create y Axis so it can be updated to create animation effect
var yAxis = d3.axisLeft(yScale).tickPadding(15);

// Load data
d3.csv("meteo.csv", function(loadedData) 
{
    // format the data
    loadedData.forEach(function(d) {
        d.temperature = +d.temperature;
        d.day = +d.day;
        d.month = +d.month;
        d.year = +d.year;
    });
    
    // Get minimum and maximum year and range of years
    [minYear, maxYear] = d3.extent(loadedData, function(d) { return d.year; });
    var years = d3.range(minYear, maxYear + 1);
    
    // Calculate averages of every year
    var averages = {};
    years.forEach(function(year)
    {
        // Create array for this year
        averages[year] = []
        for (i = 0; i < 12; i++) 
            averages[year].push({'average' : averageForMonth(loadedData, i + 1, year), 'month' : i, 'year' : year});
    });

    // Add containers for the axes
    chart.append("g").attr("class", "yAxis");
    chart.append("g").attr("class", "xAxis");

    // Start off with the first year
    var year = minYear;

    // Insert first year data
    updateData(year, averages[year]);

    // Respond to a pressed key
    document.onkeydown = function (e) {

        // Get the event
        e = e || window.event;

        // Try to go back in time one year
        if (e.keyCode == leftKeyCode && year > minYear) 
        {
            year -= 1; updateData(year, averages[year]);
        }

        // Try to add one year
        else if (e.keyCode == rightKeyCode && year < maxYear) 
        {
            year += 1; updateData(year, averages[year]);
        }

    }

});

// Helper function to update data for a year
function updateData(year, data)
{
    // Set header text
    headerText.text("Temperature averages for " + year);

    // Scale axes
    xScale.domain(data.map(function(d) { return d.month; }))
    yScale.domain([d3.max(data, function(d) { return d.average; }), 0]);

    // Get the group elements for the bar items
    var dataJoin = chart.selectAll("g.barChart").data(data);

    // Remove unnecessary items
    dataJoin.exit().remove();

    // Add new items if required
    var bar = dataJoin.enter().append("g")
        .attr("class", "barChart")
        .attr("transform", function(data, index) { return "translate(" + (xScale(data.month)) + ", " + (yScale(data.average)) + ")"; })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return imageHeight - yScale(d.average); } );

    // Add rectangle to new group
    bar.append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return imageHeight - yScale(d.average); } )
        .attr("x", function(d) { return 0; })
        .attr("class", "barItem")
        .on("mouseover", function(d) {
            var element = d3.select(this);
            element.style("fill", "orange");
            element.style("border", "steelblue");

            subText.text(intToMonthString(d.month) + " " + d.year + " average: " + d.average.toFixed(3));
            subText.classed("hidden", false);
        })
        .on("mouseout", function (d) {
            var element = d3.select(this);
            element.style("fill", "steelblue");
            element.style("border", "black");
            subText.classed("hidden", true);
        });

    // Add text to new group
    bar.append("text")
        .attr("class", "white")
        .attr("x", function(d) { return xScale.bandwidth() / 2; })
        .attr("y", function(d) { return 20; })
        .text(function(d) { return d.average.toFixed(1); });
    
    // Update existing items
    var container = dataJoin
        .transition().duration(700)
        .attr("transform", function(data, index) { return "translate(" + (xScale(data.month)) + ", " + (yScale(data.average)) + ")"; })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return imageHeight - yScale(d.average); } );
        
    // Update text
    container.select("text")
        .text(function(d) { return d.average.toFixed(1); });

    // Update rectangles
    container.select("rect.barItem")
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return imageHeight - yScale(d.average); } )
        .attr("x", function(d) { return 0; });
    
    // Show detailed average on mouseover...
    bar.on("mouseover", function(d) {
        var element = d3.select(this);
        element.style("fill", "orange");
        element.style("border", "steelblue");

        subText.text(intToMonthString(d.month) + " " + d.year + " average: " + d.average.toFixed(3));
        subText.classed("hidden", false);
    })

    // .. and remove on mouseout
    .on("mouseout", function (d) {
        var element = d3.select(this);
        element.style("fill", "steelblue");
        element.style("border", "black");
        subText.classed("hidden", true);
    });

    // Update x Axis
    chart.select(".xAxis")
        .attr("transform", "translate(0, " + imageHeight + ")")
        .attr("class", "xScale")
        .call(d3.axisBottom(xScale).tickPadding(8).tickFormat(function(d) {
            // Format date
            return intToMonthString(d)
    }));

    // Update y axis
    chart.select(".yAxis")
        .transition() 
        .duration(750)   
        .call(yAxis);
}

// Helper function to calculate the average temperature per month
function averageForMonth(data, month, year)
{
    // Return the average of values for this month and year divided by 10
    return d3.mean(
        data.filter(function(d) { return d.month == month && d.year == year}), 
        function(d) { return d.temperature; }
    ) / 10.0;
}

// Helper function to convert [0-11] to [Jan-Dec]
function intToMonthString(number)
{
    // Create date format
    var monthFormat = d3.timeFormat("%B");

    // Create date with the provided month
    var date = new Date("2018-" + (number+1) + "-01");

    // Format the date as month string
    return monthFormat(date);
}
