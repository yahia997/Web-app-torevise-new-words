const express = require('express');
const mongoose = require('mongoose');
const { Word } = require('./db');
const path = require('path');


const port = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/', express.static('./client'));

app.post("/add", (req, res) => {
    const { word, translation } = req.body;

    const newWord = new Word({
        word,
        translation
    });
    newWord.save()
    .then(() => res.send("new word added !"))
    .catch(err => res.status(400).json(err));
});

app.get("/words", (req, res) => {
    Word.find()
        .sort({ "word": 1 })
        .then(words => res.json(words))
        .catch(err => res.status(400).json(`error: ${err}`));    
});

app.get("/single-word/:id", (req, res) => {
    const { id } = req.params;
    Word.findById(id)
        .then(words => res.json(words))
        .catch(err => res.status(400).json(`error: ${err}`));        
});

app.put("/edit/:id", (req, res) => {
    const { id, word, translation } = req.body;

    Word.findById(req.params.id)
        .then(w => {
            w.word = word;
            w.translation = translation;

            w.save()
                .then(() => res.json("Word updated!"))
                .catch(err => res.status(400).json("Error:" + err));
        })
        .catch(err => res.status(400).json("Error:" + err));
});

app.delete("/delete/:id", (req, res) => {
    Word.findByIdAndDelete(req.params.id)
        .then(() => res.json("Word deleted!"))
        .catch(err => res.status(400).json("Error:" + err));
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('database connected successfully');
});

const uri = "mongodb+srv://words:gtav5532759@cluster0.c1uv8.mongodb.net/words?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });


app.listen(port, () => {
    console.log("app is listening on post 3000");
})
