//Bringing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
//Шаблонизатор
const ejs = require('ejs');
//SMS API
const Nexmo = require('nexmo');

const socketio = require('socket.io');



// Init Nexmo
const nexmo = new Nexmo({
  apiKey: '9d02c237',
  apiSecret: 'JKADVMTtbjDkMAf5'
}, {debug: true});






//init app
const app = express();
// Define port
const port = 3000;


// Start server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));
//Experiment - socket.io doesn't work
//const server1 = app.listen(port);

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup - folder is static
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





// Index route
//We define a route handler / that gets called when we hit our website home.
app.get('/', (req, res) => {
    res.render('index');
  });

  // nexmo.message.sendSms(
  //   '79123295460', '7912435643', 'Text', {type: 'Unicode'},
  //   (err, responseData) => {
  //     if(err){
  //       console.log(err);
  //     } else {
  //       console.dir(err);
  //     }
  //   }
  // );

//catch form submit
  app.post('/',  (req, res) => {
    // res.send(req.body);
    // console.log(req.body);
    const number = req.body.number;
    const text = req.body.text;


    nexmo.message.sendSms(
      '79123295460', number, text, {type: 'unicode'},
      (err, responseData) => {
        if(err){
          console.log(err);
        } else {
          console.dir(responseData);
          // Get data from response
        const data = {
          id: responseData.messages[0]['message-id'],
          number: responseData.messages[0]['to']
        }

        // Emit to the client
        //Отправить отправителю обратно дата и тег smsStatus
        io.emit('smsStatus', data);
        }
      }
    );
  });


  // Connect to socket.
  
const io = socketio(server);
/*That’s all it takes to load the socket.io-client, which exposes a io global, and then connect.
Notice that I’m not specifying any URL when I call io(),
 since it defaults to trying to connect to the host that serves the page.*/
 //listen to the event
io.on('connection', (socketio) => {
//Выводится в терминале при отправке сообщения
  console.log('Connected');
  //Каждый сокет при отсоединении также вызывает команду что он отсоидинилсы
  io.on('disconnect', () => {
    console.log('Disconnected');
  })
})