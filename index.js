
var csv = require("fast-csv");
var fs = require('fs');

var carManufacturers = {};
var carModels = {};

csv
 .fromPath("DGAMIM-PRATI.csv", {headers : ["type", "manufacturerNo","manufacturerName","modelNo", "modelName", "modelSeries", "engineCapacity", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO" ]})
 .on("data", function(data){
   var car = {
     manufacturerNo: data.manufacturerNo,
     manufacturerName: data.manufacturerName,
     modelNo: data.modelNo,
     modelName: data.modelName,
     modelSeries: data.modelSeries,
     engineCapacity: data.engineCapacity
   }
   carManufacturers[data.manufacturerNo] = data.manufacturerName;

   if (!carModels[data.manufacturerNo])
    carModels[data.manufacturerNo] = [];

   carModels[data.manufacturerNo].push(car)

 })
 .on("end", function(){
    console.log("done reading csv");

    writeToJSON('car-manufacturers', carManufacturers, function(){ console.log('carManufacturers.json created');});

    Object.keys(carModels).forEach(key => {
      writeToJSON('models/'+key, carModels[key], function(){ console.log(`carModels for manufacturer ${key} created`);})
    })

 });

function writeToJSON(fileName, obj, callback) {
  fs.writeFile(`./out/${fileName}.json`, JSON.stringify(obj), 'utf8', callback);
}
