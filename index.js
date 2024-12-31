
const http=require("http");
const fs=require("fs");
const requests=require("requests");
const homeFile=fs.readFileSync("home.html","utf8");
function replaceVal(prev,orgVal)
{
    let k=prev.replace("{%temval%}",(orgVal.main.temp-273.15).toFixed(2));
    k=k.replace("{%tempmin%}",(orgVal.main.temp_min-273.15).toFixed(2));
    k=k.replace("{%tempmax%}",(orgVal.main.temp_max-273.15).toFixed(2));
    k=k.replace("{%country%}",orgVal.sys.country);
    k=k.replace("{%location%}",orgVal.name);
    k=k.replace("{%tempstatus%}",orgVal.weather[0].main);
     return k;        
}   

const server=http.createServer((req,res)=>{
    if(req.url=='/')
    {
    requests('https://api.openweathermap.org/data/2.5/weather?lat=17.366&lon=78.476&appid=c75cac1dfcd73711ef5f189e75a34a70')
.on('data', (chunk)=> {
  let obj=JSON.parse(chunk);
  let arrObj=[obj];
  let realTimeData=arrObj.map((val)=>replaceVal(homeFile,val)).join();
 res.write(realTimeData);
 //console.log(realTimeData);

})
.on('end', (err)=> {
  if (err) return console.log('connection closed due to errors', err);
 
  res.end();
});
    }
})
server.listen(8002,"127.0.0.1",()=>{
    console.log("listening to port number 8002");
})
