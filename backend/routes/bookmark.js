const express = require('express');
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const  bookmarks  = require('../models/bookmarks');
const router = express.Router();
require("dotenv").config();

const env=process.env;
 
router.post("/bookmark",async (req,res)=>{
    try{
        const {userid,title,url,description,tags}=req.body;
        
        if(!userid || !title || !url || !description || !tags){
            return res.json({message:"send all reqiured fields"});
        }

        const bookmark = await bookmarks.create({userid,title, url, description, tags});

        if(!bookmark){
            return res.json({message:"Error in adding bookmark"});
        }
        return res.json({message:"success"})
    }catch(e){
        console.log("Error on posting bookmark :"+e.message);
        return res.json({message:e.message});
    }
})

const verify = (req,res,next) => {
    const token = req.cookies.accessToken;
    if(!token) {
        return res.json({message:"token is not avail"});
    }else{
        jwt.verify(token,env.SECRET,(err,decode)=>{
            if(err) return res.json({message:"token is not valid"});
            next();
        })
    }
}
// need to create by using user id
router.get("/bookmark/:id",verify,async (req,res)=>{
    try{
        const {id} = req.params;
        const bookmark = await bookmarks.find({userid:id})

        return res.json({success:"success", message:bookmark});
    }catch(e){
        console.log("Error on getting bookmarks :"+e.message);
        return res.json({message:e.message});
    }
})

router.put("/bookmark/:id",async(req,res)=>{
    try{
        const {title,url,description,tags}=req.body;
        const {id} = req.params;
        
        if(!title || !url || !description || !tags){
            return res.json({message:"send all reqiured fields"});
        }

        const bookmark = await bookmarks.updateOne({_id:id},{$set:{title:title,url:url,description:description,tags:tags}});

        if(!bookmark){
            return res.json({message:"bookmark not found"});
        }

        return res.json({message:"bookmark updated successfully"});
    }catch(e){
        console.log("Error on putting bookmark :"+e.message);
        return res.json({message:e.message});
    }
})

router.delete("/bookmark/:id",async(req,res)=>{
    try{
        const {id} = req.params;

        const bookmark  = await bookmarks.findByIdAndDelete(id);

        if(!bookmark){
            return res.json({message:"bookmark not found"});
        }

        return res.json({message:"bookmark deleted successfully"});
    }catch(e){
        console.log("Erorr on deleting bookmark :"+e.message);
        return res.json({message:e.message});
    }
})

module.exports = router;