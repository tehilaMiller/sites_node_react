const express = require("express")
const bcrypt = require("bcrypt")
const {auth} =require("../middleWares/auth")
const jwt = require("jsonwebtoken")
const router = express.Router()
const { validateUser,UserModel,validLogin ,createToken } = require("../models/userModel"); // תלוי איפה הפונקציה מוגדרת

router.get("/",async(req,res)=>{
    res.json({msg:"Users work"})
})
router.get("/myEmail",auth,async(req,res)=>{
    try{
        let user = await UserModel.findOne({_id:req.tokenData._id},{email:1,_id:0})
        res.json(user)
    }
    catch(err){
        console.log(err );
        res.status(500).json({msg:"There error try again later",err})   
        

    }})
router.post("/",async(req,res)=>{
    let validBody= validateUser(req.body);
    //במידה ויש טעות בריק באדי שהגיע מצד לקוח
    //יוצר מאפיין בשם אירור ונחזיר את הפירוט של הטעות
    if(validBody.error){
        return res.status(400).json(validBody.error.details)
    }
    try{
        let user = new UserModel(req.body)  
        console.log(user)
        //נרצה להצפין את הסיסמא בצורה חד כיוונית
        //רמת ההצפנה שהיא מעולה לעסק - 10
        user.password = await bcrypt.hash(user.password,10)
        await user.save()
        user.password="*******"
        res.status(201).json(user)
    }
    catch(err){
        if(err.code==11000){
            return res.status(500).json({msg:"Email already in system, try log in",code:11000})
        }
        console.log(err)
        res.status(500).json({msg:"There error try again later",err})
    }
})
router.post("/login",async(req,res)=>{
    let validBody= validLogin(req.body);
    if(validBody.error){
        //מחזיר בפירוט מה הבעיה .detals -> צד לקוח
        return res.status(400).json(validBody.error.details)
    }
    try{
        //קודם כל לבדוק אם המייל שנשלח קיים במסד
        let user = await UserModel.findOne({email:req.body.email})
        if(!user){
            return res.status(401).json({msg:"User or password not match"})
        }
        //אם הסיסמא שנשלחה בבאדי מתאימה לסיסמא המוצפנת במסד של אותו משתמש
        let authPassword = await bcrypt.compare(req.body.password,user.password)
        if(!authPassword){
            return res.status(401).json({msg:"User or password not match"})
        }
        //מייצרים טוקן שמכיל את האיידי של המשתמש
        let newToken = createToken(user._id)
        //מחזירים לצד לקוח את הטוקן
        res.json({token:newToken})
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:"There error try again later",err})
    }
})
module.exports = router;
