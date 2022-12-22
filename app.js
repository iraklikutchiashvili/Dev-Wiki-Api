const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


mongoose.set("strictQuery", true);

mongoose.connect('mongodb+srv://irakli9823:lqdzVA6ZOUped0HA@cluster0.4t0yk3w.mongodb.net/wikiDB', {useNewUrlParser: true, 
useUnifiedTopology: true })

// mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser: true, 
// useUnifiedTopology: true })
.then(() => {
    console.log("Connected to Mongo");
})
.catch((err) => {
    console.log("Mongo Connection Error");
    console.log(err);
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.route("/articles")
    .get((req, res) => {
        Article.find(function(err, articles){
            if(!err){
                res.send(articles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save(function(err){
            if(!err){
                res.send("Succesfully added article");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany(function(err){
            if(!err){
                res.send("Succesfully deleted articles");
            } else {
                res.send(err);
            }
        });
    });
// End of chain


app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, article) => {
            if(!err){
                res.send(article);
            } else {
                res.send(err);
            }
        });
    })
    .put((req, res) => {
        Article.replaceOne({title: req.params.articleTitle},
         req.body, (err, newArticle) => {
            if(!err){
                res.send("Succesfully replaced article");
            } else {
                res.send(err);
            }
         });
    })
    .patch((req, res) => {
        Article.updateOne({title: req.params.articleTitle},
         req.body, (err, updatedArticle) => {
            if(!err){
                res.send("Succesfully updated article");
            } else {
                res.send(err);
            }
         });
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, (err, removedArticle) => {
            if(!err){
                res.send("Succesfully deleted article");
            } else {
                res.send(err);
            }
        });
    });




app.listen(process.env.PORT || 3000, () => {
    console.log("The server started on port 3000");
});