const express = require('express');
const app = express();
//const cors = require('cors');
const server = require('http').Server(app);
const bodyParser = require('body-parser'); 
//same as http.createServer()
// app.listen also does the same thing as server.listen with the server created above.
// the advantage of setting a variable as const Server is that you
// can reuse the server for listening to other requests.
const {v4: uuidV4} = require('uuid');
const io = require('socket.io')(server);
const cors = require('cors');
//Allows different clients to interact with one another
// so they can send requests to each other without a server.
const {ExpressPeerServer} = require('peer');
const mysql = require('mysql');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./controllers/authentification');

//SETUP
const peerServer = ExpressPeerServer(server, {
    debug: true
})
app.use(express.static('public'));
app.use(cors())
app.use('/peerjs', peerServer);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieParser());
//PASSPORT SETUP
app.use(passport.initialize());
// SQL SETUP
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Beautiful#3",
    database: 'users'
  });
  db.connect(function(err) {
    if (err) throw err;
    console.log("Connected to SQL database!");
  });

app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.redirect(`/${uuidV4()}`)
});

app.get('/:room', (req, res)=>{
    res.render('room', {roomID: req.params.room})
});
//SOCKETS SETUP
io.on('connection', socket => {
    socket.on('join-room', (roomID, userID) => {
        //this functions works only once room.ejs ROOM_ID variable is created
        socket.join(roomID)
        socket.to(roomID).broadcast.emit('user-connected', userID);
        socket.on('message', message => {
            //send message to the same room
            io.to(roomID).emit('createMessage', message)
        })
    })
})

//LOGIN FORM HANDLING
// this is actualy the create user form data and not the find user
app.post('/createuser', function(req,res,next){
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim().toLowerCase();
    const sql = `INSERT INTO userdata (username, password)
    VALUES ('${username}', '${password}')
    `
    db.query(sql, function(err, data){
        if(err){
            throw err;
        }
        console.log('record inserted')
    })
})
app.post('/userlogin', function(req,res,next){
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim().toLowerCase();
    const sql = `SELECT * FROM userdata WHERE username = '${username}' AND password = '${password}'
    `
    db.query(sql, function(err, data){
        if(err){
            throw err;
        }
        if(!data[0]){
            console.log('Please enter a valid username and password')
            //next({message: 'Please enter a valid username and password'})
        }
        if(data.length > 0){
            console.log('grater than 0')
            console.log(data[0].username)
            console.log(typeof data)
            console.log(data.length)
            res.redirect('/dashboard.html')
            authRoutes(data[0].id)
        }
    })
    
})

//app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3030;

server.listen(PORT, ()=>{
    console.log('Server is listening on port:', PORT)
});