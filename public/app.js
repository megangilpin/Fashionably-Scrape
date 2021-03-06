
// Scrapes articles on click
$(".scrape_articles").on("click", function () {
  console.log("button clicked")
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done, add the note information to the page
    .then(function (data) {
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
  
  // Run a POST to save the note to the database
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
      location.reload()
    });
});

  // LIST-ITEM EVENT HANDLERS
$(".add_note").on("click", function () {
  var id = $(this).attr("data-id");
  console.log(id)
// Click to only happen on announce links
  $('#myId').attr("data-modalID", id);
  // $('#createFormId').modal('show');
});

$('.list-group-item').on('mouseenter', function (e) {
  $(this).addClass('mouseover');
}).on('mouseleave', function (e) {
  $(this).removeClass('mouseover');
});

$('.list-group-item').on('click', function () {
  console.log('clicked item');
});

// LIST-ITEM REMOVE BUTTON EVENT HANDLERS

$('.remove-item').on('mouseenter', function (e) {
  $(this).addClass('mouseover');
  $(this).parent().mouseleave();
}).on('mouseleave', function (e) {
  $(this).removeClass('mouseover');
  $(this).parent().mouseenter();
});

$('.remove-item').on('click', function (e) {
  console.log('clicked remove-item btn');
  e.stopPropagation();
  var id = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/articles/note/" + id
  })
    // With that done, add the note information to the page
    .then(function (data) {
      location.reload()
    });
  
});