// // Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// // The API object contains methods for each kind of request we'll make
// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

// // refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);

// Run apiSearch function on page load
$(document).ready(function () {
  apiSearch();
});

// Offset for seach
let offset = 0;
let searchZip = 0;
let searchName = '';

// Search's Chicago's Health Inspection API
function apiSearch() {
  // If a 5 digit zip is used do this
  if (searchZip.toString().length == 5) {
    console.log("search by zip " + searchZip);
    $.ajax({
      url: "https://data.cityofchicago.org/resource/cwig-ma7x.json?",
      type: "GET",
      data: {
        "$limit": 15,
        "$order": "inspection_date DESC",
        "$offset": offset,
        "zip": searchZip,
        "$$app_token": "6XVFBPKanuSOC8yVkH3wyE77f"
      }
    }).done(function (data) {
      console.log(data);
      // For the lenth of the data array append results to the table
      for (let i = 0; i < data.length; i++) {
        let newRow = $("<tr>");
        let nameTag = $("<td>").html(data[i].dba_name);
        newRow.append(nameTag);

        let addressTag = $("<td>").html(data[i].address);
        newRow.append(addressTag);

        let zipTag = $("<td>").html(data[i].zip);
        newRow.append(zipTag);

        let riskTag = $("<td>").html(data[i].risk);
        newRow.append(riskTag);

        let resultsTag = $("<td>").html(data[i].results);
        newRow.append(resultsTag);

        let dateTag = $("<td>").html((data[i].inspection_date).substring(0, 10));
        newRow.append(dateTag);
        $("#tableSearch").append(newRow);
      }
    });
  }
  // else if a serach name is input
  else if (searchName.length > 1) {
    console.log("search by name " + searchName);
    $.ajax({
      url: "https://data.cityofchicago.org/resource/cwig-ma7x.json?",
      type: "GET",
      data: {
        "$limit": 15,
        "$$app_token": "6XVFBPKanuSOC8yVkH3wyE77f",
        "$order": "inspection_date DESC",
        "$offset": offset,
        // change dba_name column to lower case then search for a string containing the search name
        "$where": `lower(dba_name) like '%${searchName}%'`
      }
    }).done(function (data) {
      console.log(data);
      // For the lenth of the data array append results to the table
      for (let i = 0; i < data.length; i++) {
        let newRow = $("<tr>");
        let nameTag = $("<td>").html(data[i].dba_name);
        newRow.append(nameTag);

        let addressTag = $("<td>").html(data[i].address);
        newRow.append(addressTag);

        let zipTag = $("<td>").html(data[i].zip);
        newRow.append(zipTag);

        let riskTag = $("<td>").html(data[i].risk);
        newRow.append(riskTag);

        let resultsTag = $("<td>").html(data[i].results);
        newRow.append(resultsTag);

        let dateTag = $("<td>").html((data[i].inspection_date).substring(0, 10));
        newRow.append(dateTag);
        $("#tableSearch").append(newRow);
      }
    });
  }
  // Basic search
  else {
    console.log("default search");
    $.ajax({
      url: "https://data.cityofchicago.org/resource/cwig-ma7x.json?",
      type: "GET",
      data: {
        "$limit": 15,
        "$$app_token": "6XVFBPKanuSOC8yVkH3wyE77f",
        "$order": "inspection_date DESC",
        "$offset": offset
      }
    }).done(function (data) {
      console.log(data);
      // For the lenth of the data array append results to the table
      for (let i = 0; i < data.length; i++) {
        let newRow = $("<tr>");
        let nameTag = $("<td>").html(data[i].dba_name);
        newRow.append(nameTag);

        let addressTag = $("<td>").html(data[i].address);
        newRow.append(addressTag);

        let zipTag = $("<td>").html(data[i].zip);
        newRow.append(zipTag);

        let riskTag = $("<td>").html(data[i].risk);
        newRow.append(riskTag);

        let resultsTag = $("<td>").html(data[i].results);
        newRow.append(resultsTag);

        let dateTag = $("<td>").html((data[i].inspection_date).substring(0, 10));
        newRow.append(dateTag);
        $("#tableSearch").append(newRow);
      }
    });
  }
}

// Changes the offset +15 for the apiSearch function
$("#next").on("click", function () {
  offset = offset + 15;
  // empty table
  $("#tableSearch").empty();
  // run offset search
  apiSearch();
});

// If the offset is >0 subracts 15 from the offset for the apiSearch function
$("#prev").on("click", function () {
  if (offset > 0) {
    offset = offset - 15
    // empty table
    $("#tableSearch").empty();
    // run offset search
    apiSearch();
  }
});

// Set input for event listener
let input = document.getElementById("search");

// Listens for keyup
input.addEventListener("keyup", function (event) {
  event.preventDefault();
  // If the key is the "enter key" and there is a value, continue
  if (event.keyCode === 13 && $("#search").val().length > 0) {
    // If the value enter is numeric go here
    if ($.isNumeric($("#search").val()) === true) {
      searchZip = $("#search").val().trim();
      // empty table
      $("#tableSearch").empty();
      // run search
      apiSearch();
      // reset search zip
      searchZip = 0;
    }
    // else go here
    else {
      // converts to lower case 
      searchName = $("#search").val().trim().toLowerCase();
      // empty table
      $("#tableSearch").empty();
      // run search
      apiSearch();
      // reset search name
      searchName = "";
    }
  }
});