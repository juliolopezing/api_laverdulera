var cfg = require('./config.js');
//console.log(cfg)
var //logger          = require('./controllers/logger.controller.js')
    express         = require('express'),
    bodyParser      = require('body-parser'),
    routes	        = require('./routes/routes.js'),
    mongoose        = require('mongoose'),
    helmet          = require('helmet'),
    jwt             = require('./controllers/auth.jwt.controller')

mongoose.Promise = global.Promise;

mongoose.connect(cfg.urlMongo + cfg.bd_Mongo, {
    useNewUrlParser:true, 
    useFindAndModify: false,
    user:cfg.userMongo,
    pass:cfg.passMongo
});

mongoose.connection.on('error', function(err) {
    console.log(err)
    console.log('Could not connect to the database. Exiting now...');
    //process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

var app = express()

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(helmet())

app.use(jwt());

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(403).send({msg:"Sesión caducada, vuelva a iniciar sesión.", valid:false, status:403});
  }
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*'/*'http://104.248.233.86:8090'*/);   
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-filename, Content-disposition, system");
    res.setHeader('Access-Control-Expose-Headers', "x-filename, Content-disposition")
    next();
});

//app.use(requestIp.mw())

//app.use(logger.requestLog);

app.use(routes)

app.listen(cfg.puerto, function() {
	console.log(cfg.puerto + '::' + cfg.messageTerminal );
});