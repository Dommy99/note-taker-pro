const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


  
// funtions to handle data requests
function filterQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
      filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if (query.text) {
      filteredResults = filteredResults.filter(note => note.text === query.text);
    }
    
    return filteredResults;
  }
  
  function findId(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
  }

  function newNote(body, notesArray) {
    const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
    return note;
  }

  function validate(note) {
    if (!note.title || typeof note.title !== 'string') {
      return false;
    }
    if (!note.text || typeof note.text !== 'string') {
      return false;
    }
    return true;
  }


// gets api 
app.get('/api/notes', (req, res) => {
    let results = notes;
  if (req.query) {
    results = filterQuery(req.query, results);
  }
  res.json(results);

  });
  
  app.get('/api/notes/:id', (req, res) => {
    const result = findId(req.params.id, notes);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
//   allows user to add notes
  app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    if (!validate(req.body)) {
        res.status(400).send('Format err.');
      } else {const note = newNote(req.body, notes);
    res.json(note);}    
  });

 app.delete('/api/notes/:id', (req, res) => {
    const result = findId(req.params.id, notes);

 });

// gets the html,css files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });