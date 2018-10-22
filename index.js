
var csv = require("fast-csv");
var fs = require('fs');

// var carManufacturers = require('./carManufactureresEng');
// carManufacturers = Object.keys(carManufacturers);
var cars = {};

// const manufacturersEng = require('./carManufactureresEng')
// const carManufacturersEng = require('./out/car-manufacturers-eng');
// Object.keys(manufacturersEng).forEach(carManufacturer => {
//     manufacturersEng[carManufacturer].forEach(key => {
//         carManufacturersEng[key] = carManufacturer;
//     })
// });
// writeToJSON('car-manufacturers-eng', carManufacturersEng, function(){ console.log('carManufacturersEng.json created');});

const required = [
    'manufacturerName',
    'modelSeries',
    'bodyType',
    'subModel'
];

var carManufacturers = {};
var carModels = {};
var carBodyTypes = {};
var carSubModels = {};

csv
 .fromPath("DGAMIM-PRATI.csv", {headers : ["type", "manufacturerNo","manufacturerName","modelNo", "modelName", "modelSeries", "engineCapacity", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "bodyType", "subModel", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO" ]})
 .on("data", function(data){
   var car = {
     manufacturerNo: data.manufacturerNo,
     manufacturerName: data.manufacturerName.trim(),
     modelSeries: data.modelSeries.trim(),
     bodyType: data.bodyType.trim(),
     subModel: data.subModel.trim(),
   };

   car.modelSeriesKey = encodeURIComponent(car.modelSeries);
   car.bodyTypeKey = encodeURIComponent(car.bodyType);
   car.subModelKey = encodeURIComponent(car.subModel);

   if (!carManufacturers[car.manufacturerNo]) {
       cars[car.manufacturerNo] = {};
       carManufacturers[car.manufacturerNo] = car.manufacturerName;
       carModels[car.manufacturerNo] = {};
       carBodyTypes[car.manufacturerNo] = {};
       carSubModels[car.manufacturerNo] = {};
   }

   if (!cars[car.manufacturerNo][car.modelSeriesKey]) {
       cars[car.manufacturerNo][car.modelSeriesKey] = {};
       carModels[car.manufacturerNo][car.modelSeriesKey] = car.modelSeries;
       carBodyTypes[car.manufacturerNo][car.modelSeriesKey] = {};
       carSubModels[car.manufacturerNo][car.modelSeriesKey]  = {};
   }

   if (!cars[car.manufacturerNo][car.modelSeriesKey][car.bodyTypeKey]) {
       cars[car.manufacturerNo][car.modelSeriesKey][car.bodyTypeKey] = {};
       carBodyTypes[car.manufacturerNo][car.modelSeriesKey][car.bodyTypeKey] = car.bodyType;
       carSubModels[car.manufacturerNo][car.modelSeriesKey][car.bodyTypeKey]  = {};
   }

   if (!cars[car.manufacturerNo][car.modelSeriesKey][car.bodyTypeKey][car.subModelKey]) {
       cars[car.manufacturerNo][car.modelSeriesKey][car.bodyTypeKey][car.subModelKey] = {};
       carSubModels[car.manufacturerNo][car.modelSeriesKey][car.bodyTypeKey][car.subModelKey] = car.subModel;
   }

 })
 .on("end", function(){
    console.log("done reading csv");

    writeToJSON(
        './out/',
        'manufacturers-list',
        carManufacturers,
        function(){ console.log(`car-manufacturers created`); }
        );

    createDirIfNotExists('./out/manufacturers/');

    Object.keys(carModels).forEach(manufacturer => {
      writeToJSON(
          './out/manufacturers/' + manufacturer + '/',
          'models-list',
          carModels[manufacturer],
          function(){ console.log(`car models for manufacturer ${manufacturer} created`);}
          );

        createDirIfNotExists('./out/manufacturers/' + manufacturer + '/models/');

        Object.keys(carModels[manufacturer]).forEach(iModel => {

            writeToJSON(
                './out/manufacturers/' + manufacturer + '/models/' + iModel + '/',
                'body-list',
                carBodyTypes[manufacturer][iModel],
                function(){ console.log(`car body for ${manufacturer} ${iModel} created`);}
                );

            createDirIfNotExists('./out/manufacturers/' + manufacturer + '/models/'+ iModel + '/body/');

            Object.keys(carBodyTypes[manufacturer][iModel]).forEach(iBodyType => {
                writeToJSON(
                    './out/manufacturers/' + manufacturer + '/models/' + iModel + '/' + '/body/',
                    'sub-model-list',
                    carSubModels[manufacturer][iModel][iBodyType],
                    function(){ console.log(`car sub models for ${manufacturer} ${iModel} ${iBodyType} created`);}
                    );
            });
        });
    })

 });

function writeToJSON(dir, fileName, obj, callback) {
    fileName = encodeURIComponent(fileName);
    createDirIfNotExists(dir);
    fs.writeFile(`${dir}${fileName}.json`, JSON.stringify(obj), 'utf8', callback);
}

function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}
