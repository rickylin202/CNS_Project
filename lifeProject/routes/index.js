var express = require('express');
var http = require('http');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST weather page. */
router.post('/weather', function(req, res, next) {
  console.log("Request handler weather was called.");
  console.log("req = "+decodeURIComponent(req.body.locationName));
  var searchCity = decodeURIComponent(req.body.locationName);

  fs.readFile('./data/threeDayWeather.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
	  console.log(err);
	  res.send(err + "\n");
	  res.end();
    }
    else
    {
	  if ((data == "undefined") || (data == "null"))
	  {
		  console.log("threeDayWeather file is error now");
		  res.send("null\n");
	  }
	  else
	  {
	    var weatherInfo_json = JSON.parse(data);
	  
	    console.log("weather info days = "+weatherInfo_json.length);
	    for(var i=0;i<weatherInfo_json.length;i++)
	    {
		  var cityName = (weatherInfo_json[i].locationName).toString();
		  console.log("type = "+typeof(cityName));
		  console.log("weather info location Name = "+cityName);
		  console.log("weather info result = "+cityName.match(searchCity));
		  if(cityName.match(searchCity) !== null)
	      {
	        var weather_Info = weatherInfo_json[i].weatherElement;
		    console.log("weather info types = "+weather_Info.length);
		    res.send(JSON.stringify(weather_Info));
		    break;
		  }
	    }
	  }

	  res.end();
    }
  });
  
});

/* GET weather page. */
router.get('/weather', function(req, res, next) {
  console.log("Request handler weather was called.");
  console.log("req = "+decodeURIComponent(req.query.locationName));
  var searchCity = decodeURIComponent(req.query.locationName);

  fs.readFile('./data/threeDayWeather.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
      console.log(err);
      res.send(err + "\n");
      res.end();
    }
    else
    {
      if ((data == "undefined") || (data == "null"))
      {
          console.log("threeDayWeather file is error now");
          res.send("null\n");
      }
      else
      {
        var weatherInfo_json = JSON.parse(data);
      
        console.log("weather info days = "+weatherInfo_json.length);
        for(var i=0;i<weatherInfo_json.length;i++)
        {
          var cityName = (weatherInfo_json[i].locationName).toString();
          console.log("type = "+typeof(cityName));
          console.log("weather info location Name = "+cityName);
          console.log("weather info result = "+cityName.match(searchCity));
          if(cityName.match(searchCity) !== null)
          {
            var weather_Info = weatherInfo_json[i].weatherElement;
            console.log("weather info types = "+weather_Info.length);
            res.send(JSON.stringify(weather_Info));
            break;
          }
        }
      }

      res.end();
    }
  });
  
});

/* Get UV page. */
router.get('/uv', function(req, res, next) {
  console.log("Request handler UV was called.");
  console.log("req = "+decodeURIComponent(req.query.locationName));
  var searchCity = decodeURIComponent(req.query.locationName);
  
  var mongoose = require('mongoose');
  var UVData = mongoose.model('UVDB');
  
  UVData.
  find({SiteName : searchCity }).
  exec( function ( err, UVResult ){
    if(err)
    {
      console.log('UVData was not found!!');
      console.log(err);
      res.send("查詢失敗");
      res.end();
    }
    else
    {
      console.log('UVResult'+UVResult);
      res.send(UVResult[0].UVI);
      res.end();
    }
  });
});

/* Post uv page. */
router.post('/uv', function(req, res, next) {
  console.log("Request handler uv was called.");
  console.log("req = "+decodeURIComponent(req.body.locationName));
  var searchCity = decodeURIComponent(req.body.locationName);
  
  var mongoose = require('mongoose');
  var UVData = mongoose.model('UVDB');
  
  UVData.
  find({SiteName : searchCity }).
  exec( function ( err, UVResult ){
    if(err)
    {
      console.log('UVData was not found!!');
      console.log(err);
      res.send("查詢失敗");
      res.end();
    }
    else
    {
      console.log('UVResult'+UVResult);
      res.send(UVResult[0].UVI);
      res.end();
    }
  });
});

/* Get current weather page. */
router.get('/currentTemp', function(req, res, next) {
  console.log("Request handler current weather was called.");
  console.log("temp req = "+decodeURIComponent(req.query.locationName));
  var searchCity = decodeURIComponent(req.query.locationName);
  var isInFile = false;
  
  fs.readFile('./data/currentWeather.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
      console.log(err);
      res.send(err + "\n");
      res.end();
    }
    else
    {
      if ((data == "undefined") || (data == "null"))
      {
        console.log("currentWeather file is error now");
        res.send("null\n");
        res.end();
      }
      else
      {
        var cweatherInfo_json = JSON.parse(data);
        var temp_data = "";
          
        for(var i=0;i<cweatherInfo_json.length;i++)
        {
          if(cweatherInfo_json[i].locationName[0] === searchCity)
          {
            isInFile = true;
            if (cweatherInfo_json[i].weatherElement[4].elementName[0] == "TEMP")
            {
                temp_data = cweatherInfo_json[i].weatherElement[4].elementValue[0].value[0];
            }
            else if (cweatherInfo_json[i].weatherElement[3].elementName[0] == "TEMP")
            {
                temp_data = cweatherInfo_json[i].weatherElement[3].elementValue[0].value[0];
            }
            else
            {
                temp_data = "NaN";
            }
            console.log("current weather temp = "+temp_data);
            res.send(temp_data);
            res.end();
            break;
          }
        }
        
        if (isInFile === false)
        { 
          getOtherCityTemp(searchCity, function(temp)
          {
            console.log("returnData = "+temp);
            res.send(temp);
            res.end();
          });
        }
      }
      
    }
  });
});

/* Post current weather page. */
router.post('/currentTemp', function(req, res, next) {
  console.log("Request handler current weather was called.");
  console.log("temp req = "+decodeURIComponent(req.body.locationName));
  var searchCity = decodeURIComponent(req.body.locationName);
  var isInFile = false;
  
  fs.readFile('./data/currentWeather.json', 'utf-8', function(err, data)
  {
    var fileStrIsCurrent = true;
    
    if (err)
    {
      console.log('file is not exist!!');
	  console.log(err);
	  res.send(err + "\n");
	  res.end();
    }
    else
    {
	  if ((data == "undefined") || (data == "null"))
	  {
		console.log("currentWeather file is error now");
	    res.send("null\n");
		res.end();
	  }
	  else
	  {
		var cweatherInfo_json = JSON.parse(data);
		var temp_data = "";
		
		try
		{
		  console.log("currentWeather file data length : "+cweatherInfo_json.length);
		}
		catch (e)
		{
		  temp_data = "NaN";
		  res.send(temp_data);
          res.end();
          fileStrIsCurrent = false;
		}

        if (fileStrIsCurrent === true)
        {
          for(var i=0;i<cweatherInfo_json.length;i++)
          {
            if(cweatherInfo_json[i].locationName[0] === searchCity)
            {
              isInFile = true;
              if (cweatherInfo_json[i].weatherElement[4].elementName[0] == "TEMP")
              {
                temp_data = cweatherInfo_json[i].weatherElement[4].elementValue[0].value[0];
              }
              else if (cweatherInfo_json[i].weatherElement[3].elementName[0] == "TEMP")
              {
                temp_data = cweatherInfo_json[i].weatherElement[3].elementValue[0].value[0];
              }
              else
              {
                temp_data = "NaN";
              }
              console.log("current weather temp = "+temp_data);
              res.send(temp_data);
              res.end();
              break;
            }
          }
        }
		
		if (isInFile === false)
		{
          getOtherCityTemp(searchCity, function(temp)
          {
            console.log("returnData = "+temp);
            res.send(temp);
            res.end();
          });
		}
	  }
      
    }
  });
});

function getOtherCityTemp(searchCity, callback)
{
  fs.readFile('./data/currentWeather2.json', 'utf-8', function(err, data)
  {
    if (err)
    {
  	  console.log('file is not exist!!');
	  console.log(err);
	  callback("Nan");
    }
    else
    {
	  if ((data == "undefined") || (data == "null"))
	  {
	    console.log("currentWeather2 file is error now");
	    callback("Nan");
	  }
	  else
	  {
	    var cweatherInfo_json = JSON.parse(data);
		var temp_data = "";
		
		try
        {
		  for(var i=0;i<cweatherInfo_json.length;i++)
	      {
	        if(cweatherInfo_json[i].locationName[0] === searchCity)
	        {
	          if (cweatherInfo_json[i].weatherElement[4].elementName[0] == "TEMP")
	          {
	            temp_data = cweatherInfo_json[i].weatherElement[4].elementValue[0].value[0];
	          }
	          else if (cweatherInfo_json[i].weatherElement[3].elementName[0] == "TEMP")
	          {
	            temp_data = cweatherInfo_json[i].weatherElement[3].elementValue[0].value[0];
	          }
	          else
	          {
	            temp_data = "NaN";
	          }
	          console.log("current weather temp = "+temp_data);
	          callback(temp_data);
	          break;
	        }
	      }
        }
        catch (e)
        {
          temp_data = "NaN";
          callback(temp_data);
        }
	  }
    }
  });
}

/* Post week weather page. */
router.post('/weekWeather', function(req, res, next) {
  console.log("Request handler week weather was called.");
  console.log("temp req = "+decodeURIComponent(req.body.locationName));
  var searchCity = decodeURIComponent(req.body.locationName);
  
  fs.readFile('./data/weekWeather.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
	  console.log(err);
	  res.send(err + "\n");
	  res.end();
    }
    else
    {
	  if ((data == "undefined") || (data == "null"))
	  {
		console.log("weekWeather file is error now");
	    res.send("null\n");
		res.end();
	  }
	  else
	  {
        var weekWeatherInfo_json = JSON.parse(data);
	  
	    for(var i=0;i<weekWeatherInfo_json.length;i++)
	    {
		  if(weekWeatherInfo_json[i].locationName[0].search(searchCity) !== -1)
		  {
		    console.log("week weather temp = "+weekWeatherInfo_json[i].weatherElement[0].elementName[0]);
		    res.send(weekWeatherInfo_json[i].weatherElement);
			res.end();
		    break;
		  }
	    }
	  }
    }
  });
});

/* Get week weather page. */
router.get('/weekWeather', function(req, res, next) {
  console.log("Request handler week weather was called.");
  console.log("temp req = "+decodeURIComponent(req.query.locationName));
  var searchCity = decodeURIComponent(req.query.locationName);
  
  fs.readFile('./data/weekWeather.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
      console.log(err);
      res.send(err + "\n");
      res.end();
    }
    else
    {
      if ((data == "undefined") || (data == "null"))
      {
        console.log("weekWeather file is error now");
        res.send("null\n");
        res.end();
      }
      else
      {
        var weekWeatherInfo_json = JSON.parse(data);
      
        for(var i=0;i<weekWeatherInfo_json.length;i++)
        {
          if(weekWeatherInfo_json[i].locationName[0].search(searchCity) !== -1)
          {
            console.log("week weather temp = "+weekWeatherInfo_json[i].weatherElement[0].elementName[0]);
            res.send(weekWeatherInfo_json[i].weatherElement);
            res.end();
            break;
          }
        }
      }
    }
  });
});

/* Post air page. */
router.post('/air', function(req, res, next) {
  console.log("Request handler air was called.");
  console.log("req = "+decodeURIComponent(req.body.locationName));
  var searchCity = decodeURIComponent(req.body.locationName);
  
  fs.readFile('./data/air.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
	  console.log(err);
	  res.send(err + "\n");
	  res.end();
    }
    else
    {
	  if (data.search("執行階段錯誤") !== -1)
	  {
	    console.log("air server data error, this time didn't save to document file.");
	  }
	  else
	  {
        // var air_json = JSON.parse((data.replace(/PM2.5/g, "PM2_5")));
        var air_json = null; 
        try {
          air_json = JSON.parse((data.replace(/PM2.5/g, "PM2_5")));
        }
        catch (e)
        {
          console.log("air file is error now");
        }
        
        var now = new Date();
		var airData = "";
	  
	    if (air_json != null)
	    {
	        for(var i=0;i<air_json.length;i++)
	        {
	          if(air_json[i].SiteName.search(searchCity) !== -1)
	          {
	            var dataTime = new Date(air_json[i].PublishTime);
	            
	            /*if (air_json[i].PSI === "")
	            {
	                continue;
	            }*/
	            console.log("all data = "+JSON.stringify(air_json[i]));
	            console.log("PM2.5 = "+air_json[i].PM2_5);
	            airData = air_json[i];
	            break;
	          }
	        }
	    }
		
		if (airData === "")
        {
	      res.send("null\n");
        }
		else
		{
		  res.send(airData);
		}
	  }
      
	  res.end();
    }
  });
});

/* Post AQI page. */
router.post('/AQI', function(req, res, next) {
  console.log("Request handler AQI was called.");
  console.log("req = "+decodeURIComponent(req.body.locationName));
  var searchCity = decodeURIComponent(req.body.locationName);
  
  var mongoose = require('mongoose');
  var AQIData = mongoose.model('AQIDB');
  
  AQIData.
  find({SiteName : searchCity }).
  exec( function ( err, AQIResult ){
    if(err)
    {
      console.log('AQIData was not found!!');
      console.log(err);
      res.send("查詢失敗");
      res.end();
    }
    else
    {
      console.log('AQIData'+AQIResult);
      res.send(AQIResult);
      res.end();
    }
  });
});

/* Get AQI page. */
router.get('/AQI', function(req, res, next) {
  console.log("Request handler AQI was called.");
  console.log("req = "+decodeURIComponent(req.query.locationName));
  var searchCity = decodeURIComponent(req.query.locationName);
  
  var mongoose = require('mongoose');
  var AQIData = mongoose.model('AQIDB');
  
  AQIData.
  find({SiteName : searchCity }).
  exec( function ( err, AQIResult ){
    if(err)
    {
      console.log('AQIData was not found!!');
      console.log(err);
      res.send("查詢失敗");
      res.end();
    }
    else
    {
      console.log('AQIData'+AQIResult);
      res.send(AQIResult);
      res.end();
    }
  });
});

/* Post inv page. */
router.post('/invApp', function(req, res, next) {
  console.log("Request handler invApp was called.");
  console.log("req = "+decodeURIComponent(req.body.searchMonth));
  var searchMonth = decodeURIComponent(req.body.searchMonth);
  
  fs.readFile('./invApp/'+searchMonth+'.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
      console.log(err);
      res.send("{\"v\": \"0.2\", \"code\": \"901\", \"msg\": \"無此期別資料\"}\n");
      res.end();
    }
    else
    {
      if (data.search("執行階段錯誤") !== -1)
      {
        console.log("invApp server data error, this time didn't save to document file.");
      }
      else
      {
        if (data === "")
        {
          res.send("{\"v\": \"0.2\", \"code\": \"901\", \"msg\": \"無此期別資料\"}\n");
        }
        else
        {
          res.send(data);
        }
      }
      
      res.end();
    }
  });
});

/* get inv page. */
router.get('/invApp', function(req, res, next) {
  console.log("Request handler invApp was called.");
  console.log("req = "+decodeURIComponent(req.query.searchMonth));
  var searchMonth = decodeURIComponent(req.query.searchMonth);
  
  fs.readFile('./invApp/'+searchMonth+'.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
      console.log(err);
      res.send("{\"v\": \"0.2\", \"code\": \"901\", \"msg\": \"無此期別資料\"}\n");
      res.end();
    }
    else
    {
      if (data.search("執行階段錯誤") !== -1)
      {
        console.log("invApp server data error, this time didn't save to document file.");
      }
      else
      {
        if (data === "")
        {
          res.send("{\"v\": \"0.2\", \"code\": \"901\", \"msg\": \"無此期別資料\"}\n");
        }
        else
        {
          res.send(data);
        }
      }
      
      res.end();
    }
  });
});

/* Post traffic page. */
router.post('/traffic', function(req, res, next) {
  console.log("Request handler traffic was called.");
  console.log("req = "+decodeURIComponent(req.body.routeNumber));
  var routeNumber = decodeURIComponent(req.body.routeNumber);
  var mongoose = require('mongoose');
  var trafficitems = mongoose.model('trafficItem');
  
  trafficitems.
  find({ locationpath : routeNumber }).
  sort({fromkm_Num : 1, tokm_Num : 1}).
  exec( function ( err, trafficResult ){
    if(err)
    {
      console.log('trafficItem was not found!!');
      console.log(err);
      res.send("查詢失敗");
      res.end();
    }
    else
    {
      console.log('trafficResult'+trafficResult);
      res.send(trafficResult);
      res.end();
    }
  });
});

/* get traffic page. */
router.get('/traffic', function(req, res) {
  console.log("Request handler traffic was called.");
  console.log("req = "+decodeURIComponent(req.query.routeNumber));
  var routeNumber = decodeURIComponent(req.query.routeNumber);
  var mongoose = require('mongoose');
  var trafficitems = mongoose.model('trafficItem');
  
  trafficitems.
  find({ locationpath : routeNumber }).
  sort({fromkm_Num : 1, tokm_Num : 1}).
  exec( function ( err, trafficResult ){
    if(err)
    {
      console.log('trafficItem was not found!!');
      console.log(err);
      res.send("查詢失敗");
      res.end();
    }
    else
    {
      console.log('trafficResult'+trafficResult);
      res.send(trafficResult);
      res.end();
    }
  });
});
module.exports = router;
