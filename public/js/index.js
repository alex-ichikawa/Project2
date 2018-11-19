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
$(document).ready(function() {
  apiSearch();
});

// Search's Chicago's Health Inspection API
function apiSearch() {
  $.ajax({
    url: "https://data.cityofchicago.org/resource/cwig-ma7x.json?$order=inspection_date DESC ",
    type: "GET",
    data: {
      "$limit" : 15,
      "$$app_token" : "6XVFBPKanuSOC8yVkH3wyE77f"
    }
}).done(function(data) {
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