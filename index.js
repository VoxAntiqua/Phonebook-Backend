require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

/* let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]; */

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

/* const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};
 */
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

    /*     if (persons.some((p) => p.name === body.name)) {
      return response.status(400).json({
        error: `${body.name} already exists in phonebook`,
      });
    } */

    /*     const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }; */
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
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// time spent: 14 hrs
