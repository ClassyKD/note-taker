const fs = require("fs");
const util = require("util");
const app = require("express").Router();
const readNotes = util.promisify(fs.readFile);
const writeNotes = util.promisify(fs.writeFile);

//GET all notes
app.get("/notes", (req, res) =>  {
 readNotes("./db/notes.json", "utf8").then(function(data) {
    notes = [].concat(JSON.parse(data))
    res.json(notes);
 })
});

//POST new notes
app.post("/notes", (req, res) => {
  const note = req.body;
  readNotes("./db/notes.json", "utf8").then(function(data){
    const notes = [].concat(JSON.parse(data));
    note.id = notes.length + 1
    notes.push(note);
    return notes
  })
  .then(function(notes) {
    writeNotes("./db/notes.json", JSON.stringify(notes))
    res.json(note);
  });
});

//DELETE note by id
app.delete("/notes/:id", (req, res) => {
   const deleteId = parseInt(req.params.id);
   readNotes("./db/notes.json", "utf8").then(function(data) {
    const notes = [].concat(JSON.parse(data));
    const newNotes = []
    for (let i = 0; i<notes.length; i++) {
        if(deleteId !== notes[i].id) {
            newNotes.push(notes[i])
        }
    }
     return newNotes
   })
   .then(function(notes) {
      writeNotes("./db/notes.json", JSON.stringify(notes))
     res.send("success!");
   });
});

module.exports = app;