import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const USERS= [];

app.use(express.json());

const existsCpf = (req, res, next) => {
  const { cpf } = req.params;
  const formattedCPF = cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );
  const user = USERS.find((item) => item.cpf === formattedCPF);
  if (user === undefined) {
    return res.status(404).json({ message: "CPF not registered!" });
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
  const formattedCPF = cpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const user = USERS.find((item) => item.cpf === formattedCPF);
  user.cpf = data.cpf;
  user.name = data.name;
  res.json({ message: "User is updated", user });

});


app.delete("/users/:cpf", existsCpf, (req, res) => {
  const { cpf } = req.params;
  const formattedCPF = cpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const user = USERS.find((item) => item.cpf === formattedCPF);
  const index = USERS.indexOf(user);
  USERS.splice(index, 1);
  res.status(200).json({
    message: "User is deleted",
    updated_list: USERS.splice(index, 1),
  });


});

app.get("/users/:cpf/notes", existsCpf, (req, res) => {
  const { cpf } = req.params;
  const formattedCPF = cpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const user = USERS.find((item) => item.cpf === formattedCPF);
  res.json(user.notes);
});


app.post("/users/:cpf/notes", existsCpf, (req, res) => {
  const { cpf } = req.params;
  const formattedCPF = cpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const data = req.body;
  data.id = uuidv4();
  data.created_at = new Date();
  const user = USERS.find((item) => item.cpf === formattedCPF);
  user.notes.push(data);
  res.status(201).json({
    message: `${data.title} was added into ${user.name}'s notes`,
  });
});


app.patch("/users/:cpf/notes/:id", existsCpf, (req, res) => {
  const { cpf, id } = req.params;
  const formattedCPF = cpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const data = req.body;
  const user = USERS.find((item) => item.cpf === formattedCPF);
  const note = user.notes.find((item) => item.id === id);
  note.title = data.title;
  note.content = data.content;
  note.updated_at = new Date();
  res.json(note);

});


app.delete("/users/:cpf/notes/:id", existsCpf,  (req, res) => {
  const { cpf, id } = req.params;
  const formattedCPF = cpf.replace( /(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const user = USERS.find((item) => item.cpf === formattedCPF);
  const note = user.notes.find((item) => item.id === id);
  const index = user.notes.indexOf(note);
  user.notes.splice(index, 1);
  res.status(200).json(user.notes);
});


app.listen(3000);