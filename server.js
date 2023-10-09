const express = require('express');
const app = express();

const jsonwebtoken = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});


const PORT = 3001;
const secretKey = 'My secret key';
var jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'hkarnat1',
        password: '123456'
    },
    {
        id: 2,
        username: 'teddy',
        password: '12367'
    }
];

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    for (let user of users){
        if(username == user.username && password == user.password){
            let token = jsonwebtoken.sign({id: user.id, username: user.username}, secretKey, {expiresIn: '180s'});
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else{
            res.status(401).json({
                success: false,
                token: null,
                err: 'username or password is incorrect'
            });
        }
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        myContent: 'This is settings page'
    });
});

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function(err, req, res, next) {
    console.log(err.name == 'Unauthorized error');
    console.log(err);
    if (err.name === 'Unauthorized'){
        res.status(401).json({
            success: false,
            OfficialError: err,
            err: 'username or password is incorrect 2'
        });
    }
    else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port: ${PORT}`);
});