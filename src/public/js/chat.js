
Swal.fire({
    title: "Hola. Identifiquese para continuar",
    text: "Ingrese su nickname",
    icon: "error",
    input: "text",
    inputValidator: (input)=>{
        return !input && "Debe ingresar un nombre"
    },
    allowOutsideClick: false,
    showCancelButton: true,
    showDenyButton: true,
    denyButtonText: "NO NO NO"
}).then((datos)=> {
    
   
    let nombre = datos.value
    console.log(nombre)

    let inputMensaje = document.querySelector("#mensaje")
    inputMensaje.className = "inputMensaje"
    let divMensajes = document.querySelector("#mensajes");
    divMensajes.className = "divMensajes"
    
    inputMensaje.focus()



    const socket = io();
    socket.emit("nuevoUsuarioConnect", nombre );

    socket.on("historial", (mensajes)=>{

        mensajes.forEach((m)=>{
            divMensajes.innerHTML += `<strong>${m.nombre}</strong> : <i>${m.mensaje}</i><hr>`
        })

    })

    document.title =  nombre

    socket.on("nuevoUsuarioNombre" , (nombre)=>{
       

        Swal.fire({
            text: `${nombre} se ha conectado`,
            toast: true,
            position: "top-right",
        })
    })

    inputMensaje.addEventListener("keyup", (e)=>{
        if(e.code === "Enter" && e.target.value.trim().length > 0){
            socket.emit("mensajeEnviado", nombre, e.target.value)
            e.target.value = ""
        }
    })

    socket.on("nuevoMensaje", (nombre,mensaje)=>{
        divMensajes.innerHTML += `<strong>${nombre}</strong> : <i>${mensaje}</i><hr>`
    })

    socket.on("saleUsuario", (nombre)=>{

        divMensajes.innerHTML += `<strong> ${nombre} ha salido del chat<hr>`

    })
})


    