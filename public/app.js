// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Scrapes articles on click
$(".scrape_articles").on("click", function () {
  console.log("button clicked")
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data)
    });
});

// Will update database to mark article as saved
$(".saved_article").on("click", function () {
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/saved/"
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data)
    });
});

// Will update database to mark article as saved
$(".save_article").on("click", function () {
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/articles/saved/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data)
    });
});


// When you click the save note button
$(".save_note").on("click", function () {
  // Grab the id associated with the article from the submit button
  console.log("button clicked")
  var id = $(this).attr("data-modalID");
  var note = $("#bodyinput").val()
  console.log("Before the ajax call" + note + id)
  
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    type: "POST",
    url: "/articles/note/" + id,
    id: id,
    data: {
      body: note
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log("This is the data:")
      console.log(data);
      // Empty the notes section
      // $("#bodyinput").empty();
      $("#bodyinput").val("");
      $("#createFormId").modal('hide');
    });

  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  
});

$(".add_note").on("click", function () {
  var id = $(this).attr("data-id");
  console.log(id)
// Click to only happen on announce links
  $('#myId').attr("data-modalID", id);
  // $('#createFormId').modal('show');
});