var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/fashionablyscraperdb", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes

app.get("/", function (req, res) {
  res.render("index")
})

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.highsnobiety.com/style/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var results = []
    // Now, we grab every h2 within an article tag, and do the following:
    $("article.teaser").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children(".teaser__link-wrap")
        .children(".teaser__info-wrap")
        .children("a")
        .children("span")
        .text().trim();
      result.link = $(this)
        .attr("data-url");
      result.image = $(this)
        .find("img")
        .attr("src");
      results.push(result)
    });
    // Create a new Article using the `result` object built from scraping
    db.Article.create(results)
      .then(function (results) {
        // View the added result in the console
        var allArticles = {
          articles: results
        };
        res.send(allArticles)
      })
      .catch(function (err) {
        // If an error occurred, log it
        console.log(err);
      }); 
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .sort({ '_id': -1 }).limit(20)
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      var allArticles = {
        articles: dbArticle
      };
      res.render("index", allArticles)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for getting all Articles from the db
app.get("/articles/saved", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({saved: true})
    // .sort({ '_id': -1 }).limit(12)
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      console.log(dbArticle)
      var allArticles = {
        articles: dbArticle
      };
      res.render("saved", allArticles)
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.post("/articles/saved/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOneAndUpdate({ _id: req.params.id }, {saved: true },{new: true})
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/note/:id", function (req, res) {
  var note = req.body
  console.log(note)
  
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for deleting the note
app.put("/articles/note/:id", function (req, res) {
  // Grab every document in the Articles collection
  db.Note.remove({_id: req.params.id})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});