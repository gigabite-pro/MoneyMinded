const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Users = require('./models/Users');
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.set('views', (__dirname + '/views'))
app.set('view engine', 'ejs');
app.use(
    session({
        secret : 'yoyohoneysingh',
        cookie : {
            maxAge : 60000 * 60 * 24
        },
        saveUninitialized : true,
        resave : false
    })
)
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//db connection
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

//routes
app.get('/', (req, res) => { res.render('index'); });
app.get('/leaderboard', (req,res) => {
    Users.find({}).sort({coins: 'desc'}).limit(50)
    .then(users => {
        console.log(users)
        res.render('leaderboard', {users: users})
    })
    .catch(err => console.log(err))
})
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/courses', require('./routes/courses'));
app.use('/market', require('./routes/market'));

const PORT = process.env.PORT || 3000; // || = OR, && = AND

app.listen(PORT, ()=>{
    console.log(`Server is running on the port ${PORT}`);
})