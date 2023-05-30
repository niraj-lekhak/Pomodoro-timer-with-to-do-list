const firebase = require('firebase/compat/app')
const  fire= require('firebase/auth')
const fireDatabase = require('firebase/database')
const express = require('express');
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')
const expressapp = express();
expressapp.use(cookieparser())
const port = 8080;
expressapp.use(bodyparser.urlencoded({ extended: true }))
const firebaseConfig = {
    apiKey: "AIzaSyCZXVeP7fpzRbTUy-wSiGoA0_Uy4OcZv6o",
    authDomain: "timer-c7bca.firebaseapp.com",
    databaseURL: "https://timer-c7bca-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "timer-c7bca",
    storageBucket: "timer-c7bca.appspot.com",
    messagingSenderId: "94369936347",
    appId: "1:94369936347:web:15abb6302b1bd6c8daedfe",
    measurementId: "G-WMKSY4GGZL"
  };
  expressapp.set('view engine','hbs')
  const app =  firebase.initializeApp(firebaseConfig);
  const auth=fire.getAuth(app);
  expressapp.use(bodyparser.json())

  expressapp.post('/userRegistration',(req,res)=>{
 
    const database = fireDatabase.getDatabase();
    fireDatabase.set(fireDatabase.ref(database,'users/'+req.body.Username),{
      UserName:req.body.Username,
      password:req.body.pswd,
      email: req.body.email,
    })
      fire.createUserWithEmailAndPassword(auth,req.body.email,req.body.pswd)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
       
        res.cookie('UserName',req.body.Username,{maxAge:10000*60*24*24,secure:true})
        res.cookie('isLoggedIn',"true",{maxAge:10000*60*24*24,secure:true})
       
        res.sendFile(__dirname+'/login.html')
      
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  })


  expressapp.post('/userLogin',(req,res)=>{
    let cookies = req.cookies
    const dbRef =fireDatabase.ref(fireDatabase.getDatabase());
    fireDatabase.get(fireDatabase.child(dbRef, `users/`+req.body.name)).then((snapshot) => {
     if (snapshot.exists()) {
     data= snapshot.val()
      res.render("index",{
   
        Username:data.UserName
     
     })
     } 
     else{
       console.log("No data available");
     }
   }).catch((error) => {
     console.error(error);
   });
   
     
  })


  expressapp.get('/',(req,res)=>{
    let cookies = req.cookies
    
    if(cookies.isLoggedIn=="true"){
      res.render("index",{
        Username:cookies.name
        })
    }else{
      res.sendFile(__dirname+`/login.html`)
    }
   
  })

  expressapp.get('/:id',(req,res)=>{
    res.sendFile(__dirname+`/${req.params.id}`)
  })


expressapp.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
