import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const USERS= [];

app.use(express.json());

const existsCpf = (req, res, next) => {
  const { cpf } = req.params;
  const CPF_FOUND = USERS.find((user) => user.cpf === cpf);
  if (!CPF_FOUND) {
    return res.status(404).json({ error: "invalid cpf - user is not registered" });
  }
  next();
};


app.get("/users", (req, res) => {
  res.json(USERS);
});

app.post("/users", (req, res) => {
  const data = req.body;
  data.id = uuidv4();
  data.notes = [];
  USERS.push(data);
  res.status(201).json(data);
});

app.patch("/users/:cpf", existsCpf, (req, res) => {
  const { cpf } = req.params;
  const data = req.body;
  const user = USERS.find((item) => item.cpf === cpf);
  const userIndex = USERS.findIndex((user) => user.cpf === cpf);
  const updatedUser = { ...user, ...req.body };
  USERS[userIndex] = updatedUser;

  res.status(200).json({ message: "User is updated", users: [USERS[userIndex]] });


});

app.delete("/users/:cpf", existsCpf, (req, res) => {
  const { cpf } = req.params;
  const user = USERS.find((item) => item.cpf === cpf);
  const index = USERS.indexOf(user);
  USERS.splice(index, 1);
  res.status(200).json({
    message: "User is deleted",
    updated_list: USERS.splice(index, 1),
  });


});

app.get("/users/:cpf/notes", existsCpf, (req, res) => {
  const { cpf } = req.params;
  const user = USERS.find((item) => item.cpf === cpf);
  res.json(user.notes);
});


app.post("/users/:cpf/notes", existsCpf, (req, res) => {
  const { cpf } = req.params;
  const data = req.body;  
  data.id = uuidv4();
  data.created_at = new Date();
  const user = USERS.find((item) => item.cpf === cpf);
  user.notes.push(data);
  res.status(201).json({
    message: `${data.title} was added into ${user.name}'s notes`,
  });
});


app.patch("/users/:cpf/notes/:id", existsCpf, (req, res) => {
  const { cpf, id } = req.params;
  const updatedAt = new Date(); 
  const data = req.body;
  const user = USERS.find((user) => user.cpf === cpf);
  const note = user.notes.find((note) => note.id === id);
  const updatedNote = {...note, ...data, updatedAt: new Date()};
  user.notes[note] = updatedNote;

  res.status(200).json(user.notes[note]);
});




app.delete("/users/:cpf/notes/:id", existsCpf,  (req, res) => {
  const { cpf, id } = req.params;
  const user = USERS.find((item) => item.cpf === cpf);
  const note = user.notes.find((item) => item.id === id);
  const index = user.notes.indexOf(note);
  user.notes.splice(index, 1);
  res.status(200).json(user.notes);
});


app.listen(3000);