const express = require("express");
const app = express();
require("dotenv").config();

const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token("body", (request, response) => JSON.stringify(request.body));

app.get("/api/persons", morgan("tiny"), (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", morgan("tiny"), (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", morgan("tiny"), (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.post(
  "/api/persons",
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
  (request, response) => {
    const body = request.body;

    if (!body.name) {
      return response.status(400).json({
        error: "name missing",
      });
    }

    if (!body.number) {
      return response.status(400).json({
        error: "number missing",
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
);

app.delete("/api/persons/:id", morgan("tiny"), (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((result) => {
    response.status(204).end();
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// time spent: 15 hrs
