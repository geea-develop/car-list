
var csv = require("fast-csv");
var fs = require('fs');

var carManufacturers = require('./carManufactureresEng');
carManufacturers = Object.keys(carManufacturers);
var carModels = {};
var carModelsUnique = [];
var carManufacturersHeb = {};

// const manufacturersEng = require('./carManufactureresEng')
const carManufacturersEng = require('./out/car-manufacturers-eng');
// Object.keys(manufacturersEng).forEach(carManufacturer => {
//     manufacturersEng[carManufacturer].forEach(key => {
//         carManufacturersEng[key] = carManufacturer;
//     })
// });
// writeToJSON('car-manufacturers-eng', carManufacturersEng, function(){ console.log('carManufacturersEng.json created');});

csv
 .fromPath("DGAMIM-PRATI.csv", {headers : ["type", "manufacturerNo","manufacturerName","modelNo", "modelName", "modelSeries", "engineCapacity", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO" ]})
 .on("data", function(data){
   var car = {
     manufacturerNo: data.manufacturerNo,
     manufacturerName: carManufacturersEng[data.manufacturerNo],
     modelNo: data.modelNo,
     modelName: data.modelName.trim(),
     modelSeries: data.modelSeries.trim(),
     engineCapacity: data.engineCapacity
   }

   carManufacturersHeb[data.manufacturerNo] = data.manufacturerName.trim();

   if (!carModelsUnique.includes(car.manufacturerName +'_'+ car.modelSeries+ '_'+car.modelName)) {
       carModelsUnique.push(car.manufacturerName +'_'+ car.modelSeries+ '_'+car.modelName)
       if (!carModels[car.manufacturerName])
           carModels[car.manufacturerName] = [];

       carModels[car.manufacturerName].push(car)
   }

 })
 .on("end", function(){
    console.log("done reading csv");

     writeToJSON('car-manufacturers', carManufacturersHeb, function(){ console.log(`carManufacturersHeb car-manufacturers created`);})

    Object.keys(carModels).forEach(key => {
      writeToJSON('models/'+key, carModels[key], function(){ console.log(`carModels for manufacturer ${key} created`);})
    })

 });

function writeToJSON(fileName, obj, callback) {
    fileName = fileName.replace(' ', '-');
  fs.writeFile(`./out/${fileName}.json`, JSON.stringify(obj), 'utf8', callback);
}
