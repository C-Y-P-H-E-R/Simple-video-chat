const app = require('express')();
const cors = require('cors');
// const { emit } = require('process');
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        method: ["GET","POST"]
    }
})

app.use(cors());

const port = process.env.PORT || 5000

app.get("/", (req,res) => {
    res.send('server is running');
})

io.on('connection',(socket) => {
    socket.emit('me',socket.id);
    socket.on('disconnect',() => {
        socket.broadcast.emit("callended")
    }) 
    socket.on("calluser",({userToCall,signalData, from, name}) => {
        io.to(userToCall).emit("calluser",{signal: signalData, from, name})
    })
    socket.on("answercall",(data)=> {
        io.to(data.to).emit("callaccepted",data.signal)
    })
})

server.listen(port,() => console.log(`server listening on port ${port}`))
