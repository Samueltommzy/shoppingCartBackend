let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
let config = require("./config/config");
let productRoute = require("./routes/productRoute");
let mongoose = require("mongoose");
let passport = require("passport");
let cors = require("cors");
let session = require("express-session");
let flash = require("connect-flash");
let mongoStore =require("connect-mongo")(session);
let cookieParser = require("cookie-parser");
let methodOverride = require("method-override");
let Products = require("./randomProducts/products");
let app = express();
let http = require("http").createServer(app)
let port = process.env.PORT || 3000;
let userRoute = require("./routes/userRoute")(express);

mongoose.Promise = global.Promise;
mongoose.connect(config.database).then((err)=>{
    if(err) console.log(err);
    console.log("successfully connected to " + config.databaseName);
});

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(session({
    secret: "sammy",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 180*60*1000}
 }));

app.use("/npm",express.static(__dirname + "/node_modules"));
app.use('/user', userRoute);
app.use('/generate' , Products);
app.use('/home' , productRoute);
app.get("*", (request, response)=> {
    response.sendFile(__dirname + "/public/src/index.html");
});

http.listen(port,(err)=>{
    if(err) console.log(err);
    console.log("app listening on " + port);
});

app.use((req,res)=>{
   // console.log(err)
    res.status(500).send({
        status: 500,
        success: false,
        message: `could not start app`
    });
    return false;
});
