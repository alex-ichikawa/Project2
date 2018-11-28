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
    regexStep1 = data[i].dba_name.replace(/'/g, '%27');
    regexStep2 = regexStep1.replace(/#/g, '%23');
    regexStep3 = regexStep2.replace(/&/g, '%26');
    regexStep4 = regexStep3.replace(/ /g, '%20');

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
    // newName = [];
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