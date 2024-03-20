import __dirname from "./utils.js";
import path from "path";
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { router as vistasRouter } from "./routes/vistas.router.js";

const PORT = 3000;

const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));

app.use("/", vistasRouter);

const server = app.listen(PORT, () => {
  console.log(`Server escuchando en puerto ${PORT}`);
});


let mensajes = [];
let usuarios = [];

const io = new Server(server);



io.on("connection", (socket) => {
  // connection : Conecta, disconnection : Desconecta
  console.log(`Se ha conectado un cliente con id ${socket.id}`);

  socket.on("nuevoUsuarioConnect", (nombre) => {
    usuarios.push({id: socket.id, nombre})
    socket.emit("historial", mensajes)
    // NOMBRE es el parametro enviado en el emit en chat.js
    console.log(nombre);
    socket.broadcast.emit("nuevoUsuarioNombre" , nombre)
  }); // Escucha el emit realizado en chat.js

  socket.on("mensajeEnviado", (nombre, mensaje)=>{
    mensajes.push({nombre, mensaje})
    io.emit("nuevoMensaje", nombre, mensaje)
  })

  socket.on("disconnect", ()=>{
    let nombre = usuarios.find((u)=> u.id === socket.id);
    console.log(nombre)
    if(nombre){
        socket.broadcast.emit("saleUsuario", nombre.nombre)
    }

  })
});
