const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));   //to use body-parser

app.set("view engine", "ejs");  //to use EJS as view engine

app.use(express.static("public"));  //set up folder to access static files

/**  MongoDB & Mongoose related code  **/
/***************************************/ 
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true},{ useUnifiedTopology: true });

const itemSchema = { name:String}; //create Schema

const Item = mongoose.model("Item",itemSchema); //create Model

//some default list items
const item1= new Item({name:"Hey there"});
const item2= new Item({name:"Click + to add new items"});
const item3= new Item({name:"<--Click to delete item"});

const defaultItems = [item1,item2,item3]; //an array of the default items


// let items = [];  //array to save User inputs
// let workItems = [];

app.get("/", (req, res) => {  //response to GET request to HOME route
  
  Item.find({},function(err,results){  //function to access db documents using the Model 
    if(err){
      console.log(err);
    }
    
    else{     
      if(results.length === 0){
        Item.insertMany(defaultItems,function(err){   //insert multiple items into db
          if(err){
            console.log(err);
          }
          else{
            console.log("Items added succesfully!");
          }
        })
        res.redirect("/");  
      }
      else{
        res.render("List", {  //pass collections docs to List.ejs file to render
          headingText: "Today",
          listItems: results,
        });
      }
    }
  })
});

app.post("/", (req, res) => {  //response to POST request to HOME route
  const itemName = req.body.itemInput;
  const item = new Item({name:itemName}); //create new doc with "itemName"
  
  item.save();
  res.redirect("/");

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("List", {
    headingText: "Work List",
    listItems: workItems,
  });
});

app.listen(3000, () => console.log("Port started at port 3000!"));
