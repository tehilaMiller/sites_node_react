const {config} = require("../config/secret")
const jwt = require("jsonwebtoken")

exports.auth = async(req,res,next)=>{
    let token = req.header("x-api-key")
    if(!token){
        return res.status(401).json({msg:"You need to send token to this endpoint url 66666"})
    }
    try{
        // מנסה לפענח את הטוקן ויכיל את כל המטען/מידע שבתוכו
        // ובמיוחד את האיידי
        let tokenData = jwt.verify(token,config.tokenSecret);
        // דואג להעביר את המאפיין של הטוקן דאטא לפונקציה הבאה בשרשור
        // שאנחנו מזמנים בנקסט ככה שתהיה חשופה למידע
        // במקרה הזה האיידי שפענחנו מהטוקן
        req.tokenData = tokenData
        // next() -> אם הכל בסדר לעבור לפונקציה הבאה בשרשור
        next()
    }
    catch(err){
        return res.status(401).json({msg:"Token not valid or expired 7777777"})
    }
}
exports.authAdmin = async(req,res,next)=>{
    let token = req.header("x-api-key")
    if(!token){
        return res.status(401).json({msg:"You need to send token to this endpoint url 66666"})
    }
    try{

        let decodeToken = jwt.verify(token,config.tokenSecret);
        if (decodeToken.role!="admin") {
            return res.status(403).json({msg:"Token invalid or expired, code:6A"})
        }
        req.tokenData = decodeToken
        next()
    }
    catch(err){
        console.log(err);
        return res.status(401).json({msg:"Token not valid or expired 7777777"})
    }
}