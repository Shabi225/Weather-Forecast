import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app=express();
const port=3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",async (req, res)=>{
    res.render("index.ejs",{content:null});
})
    
app.post("/submit",async(req,res)=>{
    const usrresponse=req.body.loc;
    const days=req.body.day;
    console.log("FORM:", { usrresponse, days });
    try{
        const response=await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${usrresponse}&count=1`);
        console.log("GEOCODING STATUS:", response.status);
        console.log("GEOCODING DATA:", response.data);
        const firstResult = response.data.results[0];
        const latitude = firstResult.latitude;
        const longitude = firstResult.longitude;
        const result= await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,sunshine_duration&timezone=auto&forecast_days=${days}&current=relative_humidity_2m`);
        res.render("index.ejs",{content: result.data, noOfDays:days});
        console.log("FORECAST STATUS:", result.status);
        console.log("FORECAST DATA:", result.data);
    }
    catch(error){
        res.render("index.ejs",{content:error.message});
    }
    
})


app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})