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
//=================================================================================================================================

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
    $.ajax(`/api/zip/${offset}/${searchZip}`, {
      type: "GET"
    }).done(function (data) {
      // Parse data in an array
      data = JSON.parse(data);
      makeTable(data);
    });
  }
  // else if a serach name is input
  else if (searchName.length > 1) {
    console.log("search by name " + searchName);
    $.ajax(`/api/name/${offset}/${searchName}`, {
      type: "GET"
    }).done(function (data) {
      // Parse data in an array
      data = JSON.parse(data);
      makeTable(data);
    });
  }
  // Basic search
  else {
    console.log("default search");
    $.ajax("/api/default/" + offset, {
      type: "GET"
    }).done(function (data) {
      // Parse data in an array
      data = JSON.parse(data);
      makeTable(data);
    });
  }
}

// For the lenth of the data array append results to the table
function makeTable(data) {
  for (let i = 0; i < data.length; i++) {
    //find apostraphes in name
    //if no appostraphes push value to array
    //if appostraphe replace wtih %27 then push to array

    // let name = data[i].dba_name;
    // let newName = [];
    // for (let i = 0; i < name.length; i++) {
    //   if (name[i] != "'"){
    //     newName.push(name[i]);
    //   } else if (name[i] === "'") {
    //     newName.push("%27");
    //   }
      
    // }
    regexStep1 = data[i].dba_name.replace(/'/g, '%27');
    regexStep2 = regexStep1.replace(/#/g, '%23');
    regexStep3 = regexStep2.replace(/&/g, '%26');
    regexStep4 = regexStep3.replace(/ /g, '%20');
    console.log("regex test " + regexStep4);
    // Join array with no seperator
    // let newestName = newName.join('')
    // Grab user id
    let id = document.getElementById("id").innerHTML;
    // Creates table rows
    let newRow = $("<tr>");
    let nameTag = $("<td>");
    let link = $(`<a class="linkLocation" href='/location/${id}/${regexStep4}/${data[i].address}'>`).html(data[i].dba_name);
    nameTag.append(link);
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

    // Adds button to favorite
    let favTag = $("<button>").html("Add to Favorites");
    favTag.attr("type", "button");
    favTag.attr("data-id", data[i].inspection_id);
    favTag.attr("data-name", data[i].dba_name);
    favTag.attr("data-address", data[i].address);
    favTag.attr("data-risk", data[i].risk);
    favTag.attr("data-result", data[i].results);
    favTag.attr("data-violations", data[i].violations);
    favTag.attr("data-date", (data[i].inspection_date).substring(0, 10));
    favTag.attr("id", "favorite");
    newRow.append(favTag);

    $("#tableSearch").append(newRow);
    newName = [];
  };
};

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

// Set input for event listener for search input
let input = document.getElementById("search");

// Listens for keyup for search input
input.addEventListener("keyup", function (event) {
  event.preventDefault();
  // If the key is the "enter key" and there is a value, continue
  if (event.keyCode === 13 && $("#search").val().length > 0) {
    // reset search name
    searchName = "";
    // reset search zip
    searchZip = 0;
    // If the value enter is numeric go here
    if ($.isNumeric($("#search").val()) === true) {
      searchZip = $("#search").val().trim();
      // empty table
      $("#tableSearch").empty();
      // run search
      apiSearch();
    }
    // else go here
    else {
      // reset search name
      searchName = "";
      // reset search zip
      searchZip = 0;
      // converts to lower case 
      searchName = $("#search").val().trim().toLowerCase();
      // empty table
      $("#tableSearch").empty();
      // run search
      apiSearch();
    }
  }
  else if (event.keyCode === 13 && $("#search").val().length == 0) {
    // reset search name
    searchName = "";
    // reset search zip
    searchZip = 0;
    // empty table
    $("#tableSearch").empty();
    // run search
    apiSearch();
  }
});

// Add to favorites
// need to add user id to this
$(document).on("click", "#favorite", function () {
  let favid = this.dataset.id;
  let name = this.dataset.name;
  let address = this.dataset.address;
  let risk = this.dataset.risk;
  let result = this.dataset.result;
  let violations = this.dataset.violations;
  let date = this.dataset.date;
  addtoFav({
    favId: favid,
    favName: name,
    favAddress: address,
    favRisk: risk,
    favResult: result,
    favViolations: violations,
    favDate: date,
  })

})

function addtoFav(favData) {
  let id = document.getElementById("id").innerHTML;
  $.post(`/api/${id}/favorite`, favData)
}