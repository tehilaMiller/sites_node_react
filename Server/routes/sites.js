const express = require("express");
const { SiteModel, validateSite } = require("../models/siteModel");

const router = express.Router();


router.get("/",async(req,res)=>{
    let perPage = Math.min(req.query.perPage,20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";

    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try{
        let data = await SiteModel
        .find({})
        .limit(perPage)
        .skip((page-1)*perPage)
        .sort({[sort]:reverse})
        .res.json(date)
    }
    catch(err){
        res.status(500).json;
    }

})
router.get("/:id", async (req, res) => {
    let data = await SiteModel.findById(req.params.id);
    res.json(data);
    console.log("get success");
})

router.post("/", async (req, res) => {
    // במידה ויש בעיה בשליחה לדאטה בייס יש לבדוק את גרסת מונגוס שלכן ואם היא חדשה להתקין 
    // bodyParser()
    let validBody = validateSite(req.body);
    // בודק אם הבאדי מהצד לקוח תקין לפי הג'וי
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let site = new SiteModel(req.body);
        await site.save();
        // 201 -> הצלחה כולל רשומה חדשה נוצרה
        res.status(201).json(site);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

//   בקשת מחיקה לפי האיידי של הרשומה שנרצה למחוק
// האיידי נאסף על ידי פאראמס
router.delete("/:idDel", async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data = await SiteModel.deleteOne({ _id: idDel });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).join({ msg: "err", err })
    }
})

// עריכה של רשומה לפי האיידי
router.put("/:idEdit", async (req, res) => {
    let validBody = validateSite(req.body);
    // בודק אם הבאדי מהצד לקוח תקין לפי הג'וי
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let idEdit = req.params.idEdit;
        // תמיד בבאדי נשלח את כל המאפיינים כולל את המאפיין שנרצה לערוך
        // let data = req.body;
        let data = await SiteModel.updateOne({ _id: idEdit }, res.body);
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
});

module.exports = router;