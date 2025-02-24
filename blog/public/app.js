const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Function to read posts.json
const getPosts = () => {
    try {
        const data = fs.readFileSync("posts.json");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Function to write to posts.json
const savePosts = (posts) => {
    fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));
};

// Route: Home (View all posts)
app.get("/", (req, res) => {
    const posts = getPosts();
    res.render("home", { posts });
});

// Route: View a single post
app.get("/post", (req, res) => {
    const posts = getPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (post) {
        res.render("post", { post });
    } else {
        res.status(404).send("Post not found");
    }
});

// Route: Add a new post (Form Page)
app.get("/add-post", (req, res) => {
    res.render("addPost");
});

// Route: Add a new post (Processing Form)
app.post("/add-post", (req, res) => {
    const posts = getPosts();
    const newPost = {
        id: posts.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    savePosts(posts);
    res.redirect("/");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
