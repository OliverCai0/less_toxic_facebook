const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const cors = require('cors');
// const port = 3001;
var bodyParser = require('body-parser');
var courseLookup = require('./courseLookup.js');
var userLookup = require('./userLookup.js');

const p1 = 109;
const p2 = 198733;

function hash(s){
    hash_val = 0;
    for(var i = 0; i < s.length; i++){
        hash_val += s.charCodeAt(i);
        hash_val *= p1;
        hash_val %= p2;
    }
    return hash_val
} 

//database path
db_name = './courses.db';

const db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'courses.db'");
});

app.use(cors());
app.use(bodyParser.json())

app.use(express.static('client/build'));

// Express serve up index.html file if it doesn't recognize route
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.use('/login', (req, res) => {
  userLookup.getUsers(db).then((result) => {

      user = result.filter(x => (x.email === req.body.email))[0];
      console.log("Express receives: " + JSON.stringify(user) );
        if (user){
          res.send({
            'token': hash(user.email)
          })
        }
        else{
            res.send({
            'token': null
          })
        }
      })
});

app.use('/class_display', (req, res) => {
  userLookup.getUsers(db).then((result) => {
      users = result;
      console.log("Request Information: " + req.body.id);
      courseLookup.getClassDetails(db, req.body.id)
      .then((result) => {
        console.log("Express receives: " + JSON.stringify(result) );
          res.send({
          class_info: result,
          users: users
        })
      })
  });
  // let target = classes.filter(x => (x.id == req.body.id))[0];
  // console.log(target);
  // let target_users = users.filter(x => (target.users.includes(x.id)));
  // res.send({
  //   class_info: target,
  //   users: target_users
  // })
});

/*course lookup route from home page and parses through array with 
following class info:
{
  id: row.index,
  class_title: row.title,
  class_num: row.num,
  instructors: row.fullNameInstructors,
  cross_listings: row.crossListings
}
*/
app.use('/class_search',(req, res) => {
  console.log(req.body.search_input);
  courseLookup.getSearchQuery(db, req.body.search_input)
  .then((result) =>{
    console.log(result);
    res.send({
    classes: result
    //classes.filter(x => (x.name == req.body.search_input))
    })
  });
});

app.use('/profile', (req, res) => {
  console.log("Trying to get profile:" + req.body.id);
  userLookup.getUsers(db).then((result) => {
    users = result;
    user = users.filter(x => (x.id == parseInt(req.body.id)))[0];
    userLookup.getClasses(db, user).then((result) => {
        classes = result;
        console.log(classes)
        if(user){
          res.send({
            id: user.id,
            name: user.name,
            graduation_year: user.graduation_year,
            major: user.major,
            email: user.email,
            classes: classes
          })
        }
        else{
          res.send({
            id: null,
            name: null,
            graduation_year: null,
            major: null,
            email: null,
            classes: null
          })
        }
    });
  });
})

app.use('/add_user', (req, res) => {
   userLookup.addUser(db,req.body.inputs)
   userLookup.getUsers(db).then((result) => {
       console.log(result)
       hash_code = result.filter(user => user.email == req.body.inputs.email)[0].id;
       res.send({'token': hash_code});
   });
})

app.use('/add_classes', (req, res) => {
   const payload = {"id": req.body.info.id, "classes": req.body.info.class_info.sectionID +','}
   console.log("req:" + JSON.stringify(req.body.info) );
   console.log("Payload: " + payload);
   userLookup.addClasses(db,payload);
})

const port = process.env.PORT || 5000;


// app.listen(port);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
