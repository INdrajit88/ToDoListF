const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { getDate } = require("./date");
const date = require(__dirname+"/date.js");
const mongoose = require("mongoose");

//console.log(date());

const app = express();
const port= 3000;
const workItems=[];
// const items=[];
// const item="";

app.use(bodyParser.urlencoded({extended: true }));
app.set("view engine","ejs");
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-indrajit:NandinI%402453@atlascluster.xtor3q3.mongodb.net/toDoListDB');

const itemsSchema = new mongoose.Schema({
        name: String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Welcome to your to do list"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "< -- Hit this to delete an item "
});
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);


const defaultItems = [item1,item2,item3];
const n_date = date.getDate();
app.get("/",function(req,res){
    Item.find({})
    .then(function(items){
     if(items.length === 0){
        Item.insertMany(defaultItems)
            .then(function(){
            console.log("Successfully saved default items to DB");
        })
        .catch(function(err){
            console.log(err);
        });
        res.redirect("/");
     }
     else{
        
        res.render("list",{
          listTitle: n_date,
         newListItems:items,
        });
        //  const day = date.getDay();
     }
    });
});

app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName;
    List.findOne({name: customListName})
    .then(function(foundList){
        if(!foundList){
            //create a new list
            const list = new List({
            name: customListName,
            items: defaultItems
             });
            list.save();
            res.redirect("/"+customListName);
        }
        else{
            //show an existing list
            res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
        }
    });


});


app.post("/",function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });
    if (listName== n_date) {
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName})
        .then(function(foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
            
    }
    
});
app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === n_date){
        Item.findByIdAndRemove(checkedItemId)
            .then(function(){
            console.log("Successfully deleted checked item");
            res.redirect("/");
        });
    }
    else{
         List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}})
          .then(function(foundList){
            res.redirect("/"+listName);
        });      
         
    }
});



//without Database
// app.post("/",function(req,res){
//     console.log(req.body);
//     const item = req.body.newItem;
//     if(req.body.list === "Work List"){
//         workItems.push(item);
//         res.redirect("/work");
//     }else{
//         items.push(item);
//         res.redirect("/");
//     }
// });

app.get("/work",function(req,res){

    res.render("list",{ 
        listTitle:"Work List",
        newListItems: workItems 
    });
});   

app.post("/work",function(req,res){
    const item =req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});
app.get("/about",function(req,res){
    res.render("about");
});
app.listen(port,function(){
    console.log("server is running on port"+ port);
});

