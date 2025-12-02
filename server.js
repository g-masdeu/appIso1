const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Ruta per servir l'index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta per obtenir les tasques des del fitxer JSON
app.get('/tasks', (req, res) => {
  fs.readFile('tasks.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error llegint el fitxer de tasques.');
    }
    res.json(JSON.parse(data));
  });
});

// Ruta per afegir una tasca
app.post('/tasks', express.json(), (req, res) => {
  const newTask = req.body;

  fs.readFile('tasks.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error llegint el fitxer de tasques.');
    }

    const tasks = JSON.parse(data);
    tasks.push(newTask);

    fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).send('Error escrivint al fitxer de tasques.');
      }
      res.status(201).send(newTask);
    });
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server iniciat a http://localhost:${PORT}`);
});