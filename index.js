const express = require("express");
const app = express();
require("dotenv").config();

const Person = require("./models/person");

app.use(express.static("dist"));

const morgan = require("morgan");

morgan.token("body", (request, response) => JSON.stringify(request.body));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const cors = require("cors");
app.use(cors());
app.use(express.json());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", morgan("tiny"), (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", morgan("tiny"), (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", morgan("tiny"), (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
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

app.delete("/api/persons/:id", morgan("tiny"), (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put(
  "/api/persons/:id",
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
  (request, response, next) => {
    const body = request.body;
    const person = {
      name: body.name,
      number: body.number,
    };
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
  }
);

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// time spent: 16 hrs
