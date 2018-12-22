var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require("mongoose"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer");

//App config    
mongoose.connect("mongodb://localhost:27017/restfull_blog_app",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

//Mongoose/Model Config
var blogSchema=new mongoose.Schema({
    
    title:String,
    image:String,
    body:String,
    created:{type:Date, default: Date.now()}
});

var Blog=mongoose.model("Blog",blogSchema);

//RESTful ROUTE

app.get("/",function(req,res){
    res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs",function(req,res){
    Blog.find({},function(err,allBlogs){
        if(err){
            console.log("ERROR!!");
        }
        else{
            res.render("index",{blogs:allBlogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});


//CREATE Blog ROUTE
app.post("/blogs",function(req,res){
    var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    
    Blog.create({title:title,image:image,body:body},function(err,blog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id",function(req, res) {
    var id=req.params.id;
    Blog.findById(id,function(err,blog){
       if(err){
           res.redirect("/blogs");
       } 
       else{
           res.render("show",{blog:blog});
       }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id,function(err,blog){
       if(err){
          res.redirect("/blogs");
       } 
       else{
         res.render("edit",{blog:blog}); 
       }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    var id=req.params.id;
    var title=req.body.title;
    var image=req.body.image;
    var body=req.body.body;
    var newData=({title:title,image:image,body:body});
    Blog.findByIdAndUpdate(id,newData,function(err,blog){
      if(err){
          res.redirect("/blogs");
      } 
      else{
          res.redirect("/blogs/"+id);
      }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err,blog){
      if(err){
          console.log("ERROR!!");
           res.redirect("/blogs/"+req.params.id);
      }
      else{
          res.redirect("/blogs");
      }
   });  
});

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Blog app is Running!!"); 
});


