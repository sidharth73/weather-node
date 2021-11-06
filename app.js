import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()
import fetch from 'node-fetch'

app.set('view engine','ejs')
app.set('views', './views')
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.get('/',(req,res)=>{
    const sendData = { location: "Location", country:"Country", temp: "Temp", disc: "Description", feel:"Feel-like", humidity: "Humidity", speed: "Speed" };
    res.render('index', {sendData: sendData});
})

app.post('/',async(req,res) => {
    var location = await req.body.cityName
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.API_KEY}`
    const response = await fetch(url);
    const weatherData = await response.json();

    const temp = Math.floor(weatherData.main.temp);
    const desc = weatherData.weather[0].description;
    const sendData = {};
    sendData.temp = temp;
    sendData.desc = desc;
    sendData.location = location;
    sendData.feel = weatherData.main.feels_like;
    sendData.humidity = weatherData.main.humidity;
    sendData.speed = weatherData.wind.speed;
    sendData.country = weatherData.sys.country;
    res.render('index', {sendData: sendData});
})
app.listen(9002, () => {
    console.log("BE started at port 9002");
})