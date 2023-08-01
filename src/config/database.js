const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then( _ =>{console.log("successfully connected to database");})
.catch(err =>{console.log("failed to connect database: "+err);});




