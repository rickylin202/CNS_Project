var express = require('express');
var http = require('http');
var fs = require('fs');
var util = require('util');
var mongoose = require('mongoose');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * get PTX Ticket.
 */
router.get('/ptxTicket', function(req, res)
{
  console.log("Request handler ptx ticket was called by get.");
  
  fs.readFile('../bin/data/ptxTicket.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
      console.log(err);
      res.send("{\"null\"}\n");
      res.end();
    }
    else
    {
      if (data === "")
      {
        res.send("{\"null\"}\n");
      }
      else
      {
        res.send(data);
      }
      
      res.end();
    }
  });
});


/**
 * post PTX Ticket.
 */
router.post('/ptxTicket', function(req, res)
{
  console.log("Request handler ptx ticket was called by post.");
  
  fs.readFile('../bin/data/ptxTicket.json', 'utf-8', function(err, data)
  {
    if (err)
    {
      console.log('file is not exist!!');
      console.log(err);
      res.send("{\"null\"}\n");
      res.end();
    }
    else
    {
      if (data === "")
      {
        res.send("{\"null\"}\n");
      }
      else
      {
        res.send(data);
      }
      
      res.end();
    }
  });
});

/**
 * get route details.
 */
router.get('/router', function(req, res)
{
  console.log("Request handler ptx router list was called by get.");
  console.log("req = "+decodeURIComponent(req.query.routeName));
  var routeNumber = decodeURIComponent(req.query.routeName);
  var routerList = mongoose.model('routerList');
  
  routerList.
  find({ 'RouteName.Zh_tw' : new RegExp(".*"+routeNumber+".*", "i") }).
  sort({Location: -1}).
  exec( function ( err, routerResult ){
    if(err)
    {
      console.log('router list error : '+err);
      res.status(404).send('{"message": "router not found"}');
      res.end();
    }
    else
    {
      if (routerResult == null)
      {
        res.status(404).send('{"message": "router not found"}');
        res.end();
        return;
      }
        
      console.log('routerResult'+routerResult);
      res.send(routerResult);
      res.end();
    }
  });
});

/**
 * post route details.
 */
router.post('/router', function(req, res)
{
    console.log("Request handler ptx router list was called by get.");
    console.log("req = "+decodeURIComponent(req.body.routeName));
    var routeNumber = decodeURIComponent(req.body.routeName);
    var routerList = mongoose.model('routerList');
    
    routerList.
    find({ 'RouteName.Zh_tw' : new RegExp(".*"+routeNumber+".*", "i") }).
    sort({Location: -1}).
    exec( function ( err, routerResult ){
      if(err)
      {
        console.log('router list error : '+err);
        res.status(404).send('{"message": "router not found"}');
        res.end();
      }
      else
      {
        if (routerResult == null)
        {
          res.status(404).send('{"message": "router not found"}');
          res.end();
          return;
        }
          
        console.log('routerResult'+routerResult);
        res.send(routerResult);
        res.end();
      }
    });
});

/**
 * get route details.
 */
router.get('/routerInfo', function(req, res)
{
  console.log("Request handler ptx router list was called by get.");
  console.log("req = "+decodeURIComponent(req.query.routeUID));
  var routeUID = decodeURIComponent(req.query.routeUID);
  var routerList = mongoose.model('routerList');
  
  routerList.
  find({'RouteUID': routeUID }).
  exec( function ( err, routerResult ){
    if(err)
    {
      console.log('router list error : '+err);
      res.status(404).send('{"message": "router not found"}');
      res.end();
    }
    else
    {
      if (routerResult == null)
      {
        res.status(404).send('{"message": "router not found"}');
        res.end();
        return;
      }
        
      console.log('routerResult'+routerResult);
      res.send(routerResult);
      res.end();
    }
  });
});

/**
 * post route details.
 */
router.post('/routerInfo', function(req, res)
{
  console.log("Request handler ptx router list was called by get.");
  console.log("req = "+decodeURIComponent(req.body.routeUID));
  var routeUID = decodeURIComponent(req.body.routeUID);
  var routerList = mongoose.model('routerList');
  
  routerList.
  find({'RouteUID': routeUID }).
  exec( function ( err, routerResult ){
    if(err)
    {
      console.log('router list error : '+err);
      res.status(404).send('{"message": "router not found"}');
      res.end();
    }
    else
    {
      if (routerResult == null)
      {
        res.status(404).send('{"message": "router not found"}');
        res.end();
        return;
      }
        
      console.log('routerResult'+routerResult);
      res.send(routerResult);
      res.end();
    }
  });
});

/**
 * get route details.
 */
router.get('/routerStop', function(req, res)
{
    console.log("Request handler ptx router stop list was called by get.");
    console.log("req = "+decodeURIComponent(req.query.RouteUID));
    var routeUID = decodeURIComponent(req.query.RouteUID);
    var routerStopList = mongoose.model('routerStopList');
    
    routerStopList.find({'RouteUID' : routeUID},
    function(err, routerRouteList)
    {
        if(err)
        {
            console.log(err, 'error posting json');
        }
        else
        {
          console.log('routerStopList = '+routerRouteList);
          
          if (routerRouteList == null)
          {
              res.status(404).send('{"message": "router not found"}');
              res.end();
              return;
          }
          
          console.log('routerStopList length = '+routerRouteList.length);
          console.log('routerStopList RouteUID = '+routerRouteList[0].RouteUID);
          console.log('routerStopList stops length = '+routerRouteList[0].Stops.length);
          var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
          
          //for (var i=0;i<routerStopList.Stops.length;i++)
          {
              cityRouteEstimateTimeList.findOneAndUpdate({RouteUID:routerRouteList[0].RouteUID, Location:routerRouteList[0].Location},
              ({$inc:{likeNumber:1}}),
              {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true},
              function (err, results, raw) {
                  if (err)
                  {
                      console.log("stop id find data error : "+err);
                  }
                    
                  if (raw.lastErrorObject.updatedExisting)
                  {
                    console.log('trace route id = ', results.RouteUID, 'updated');
                    console.log('stop id like number = ', results.likeNumber);
                  }
                  else
                  {
                    console.log('trace route id = ', results.RouteUID, 'added');
                    console.log('stop id like number = ', results.likeNumber);
                    var ptxTicket = '';
                    fs.readFile("./data/ptxTicket.json", 'utf-8', function(err, jsonData)
                    {
                      if (err)
                      {
                        console.log(err);
                      }
                      else
                      {
                        console.log("The ptx Ticket file was read!");
                        var ticket_json = JSON.parse(jsonData);
                        var location = routerRouteList[0].Location;
                        ptxTicket = ticket_json.Ticket;
                        console.log('ptxTicket = ', ptxTicket);
                        console.log('Location = ', location);
                        
                        var bus_Estimate_Time_Options = null;
                        var bus_RealTime_Stop_Options = null;
                        
                        if (location === "InterCity")
                        {
                            bus_Estimate_Time_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                            
                            bus_RealTime_Stop_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/RealTimeNearStop/InterCity?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                        }
                        else if (location === "NewTaipei")
                        {
                            bus_Estimate_Time_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/City/'+location+'?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                                
                            var routeuid = (routerRouteList[0].RouteUID).substr(0, (routerRouteList[0].RouteUID.length - 1));
                            bus_RealTime_Stop_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/RealTimeNearStop/City/Tainan?ticket='+ptxTicket+'&%24filter=contains(RouteUID%2C%20\u0027'+routeuid+'\u0027)&%24format=JSON'
                            };
                        }
                        else
                        {
                            bus_Estimate_Time_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/City/'+location+'?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                            
                            bus_RealTime_Stop_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/City/'+location+'?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                        }
                        
                        http.get(bus_Estimate_Time_Options, function (response)
                        { 
                            var routerData = '';
                            response.on('data', function(chunk) {
                                routerData += chunk;
                            });
                            
                            response.on('end', function(chunk)
                            {
                              //console.log("show the Kaohsiung N1 API data : "+routerData);
                              var router_data = null;
                              try
                              {
                                  router_data = JSON.parse(routerData);
                              }
                              catch (e)
                              {
                                  console.log("show the now N1 API data : "+routerData);
                                  console.log("error message : "+e);
                                  return;
                              }
                              
                              var busEstimateTime = mongoose.model('busEstimateTime');
                              for (var i=0;i<router_data.length;i++)
                              {
                                if (router_data[i].StopUID !== "")
                                {
                                    var stopuid = router_data[i].StopUID;
                                    busEstimateTime.findOneAndUpdate({StopUID: stopuid}, router_data[i], 
                                    {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true}, 
                                    function (err, results, raw) {
                                      if (err)
                                      {
                                          console.log("N1API db find data error : "+err);
                                      }
                                        
                                      if (raw.lastErrorObject.updatedExisting)
                                      {
                                        console.log('trace N1API = ', results.StopUID, 'updated');
                                      }
                                      else
                                      {
                                        console.log('trace N1API = ', results.StopUID, 'added');
                                      }
                                    });
                                }
                              }
                            });
                          }).end();
                        
                        http.get(bus_RealTime_Stop_Options, function (response)
                        { 
                            var routerData = '';
                            response.on('data', function(chunk) {
                                routerData += chunk;
                            });
                            
                            response.on('end', function(chunk)
                            {
                              //console.log("show the Kaohsiung N1 API data : "+routerData);
                              var router_data = null;
                              try
                              {
                                  router_data = JSON.parse(routerData);
                              }
                              catch (e)
                              {
                                  console.log("show the now A2 API data : "+routerData);
                                  console.log("error message : "+e);
                                  return;
                              }
                              
                              var busRealTimeNearStop = mongoose.model('busRealTimeNearStop');
                              busRealTimeNearStop.remove({RouteUID: routeuid},
                              function (err, results) {
                                  if (err)
                                  {
                                      console.log("route id find data error : "+err);
                                  }
                                  
                                  console.log("delete results = "+results);
                              });
                              
                              for (var i=0;i<router_data.length;i++)
                              {
                                  if (router_data[i].StopUID !== "")
                                  {
                                      var stopuid = router_data[i].StopUID;
                                      
                                      if (location === "NewTaipei")
                                      {
                                          router_data[i].RouteUID = router_data[i].RouteUID.substr(0, (router_data[i].RouteUID.length - 1)) + "0";
                                      }
                                      
                                      var routeuid = router_data[i].RouteUID;
                                      
                                      busRealTimeNearStop.findOneAndUpdate({StopUID: stopuid, RouteUID: routeuid}, router_data[i], 
                                      {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true}, 
                                      function (err, results, raw) {
                                        if (err)
                                        {
                                            console.log("A2API db find data error : "+err);
                                        }
                                          
                                        if (raw.lastErrorObject.updatedExisting)
                                        {
                                          console.log('trace A2API = ', results.StopUID, 'updated');
                                        }
                                        else
                                        {
                                          console.log('trace A2API = ', results.StopUID, 'added');
                                        }
                                      });
                                  }
                              }
                            });
                          }).end();
                      }
                    });
                  }
              });
          }

          res.send(routerRouteList);
          res.end();
        }
    });
});

/**
 * post route details.
 */
router.post('/routerStop', function(req, res)
{
    console.log("Request handler ptx router stop list was called by get.");
    console.log("req = "+decodeURIComponent(req.body.RouteUID));
    var routeUID = decodeURIComponent(req.body.RouteUID);
    var routerStopList = mongoose.model('routerStopList');
    
    routerStopList.find({'RouteUID' : routeUID},
    function(err, routerRouteList)
    {
        if(err)
        {
            console.log(err, 'error posting json');
        }
        else
        {
          console.log('routerStopList = '+routerRouteList);
          
          if (routerRouteList == null)
          {
              res.status(404).send('{"message": "router not found"}');
              res.end();
              return;
          }
          
          console.log('routerStopList length = '+routerRouteList.length);
          console.log('routerStopList RouteUID = '+routerRouteList[0].RouteUID);
          console.log('routerStopList stops length = '+routerRouteList[0].Stops.length);
          var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
          
          //for (var i=0;i<routerStopList.Stops.length;i++)
          {
              cityRouteEstimateTimeList.findOneAndUpdate({RouteUID:routerRouteList[0].RouteUID, Location:routerRouteList[0].Location},
              ({$inc:{likeNumber:1}}),
              {"new": true, "upsert":true,"returnNewDocument":true, "passRawResult": true},
              function (err, results, raw) {
                  if (err)
                  {
                      console.log("stop id find data error : "+err);
                  }
                    
                  if (raw.lastErrorObject.updatedExisting)
                  {
                    console.log('trace route id = ', results.RouteUID, 'updated');
                    console.log('stop id like number = ', results.likeNumber);
                  }
                  else
                  {
                    console.log('trace route id = ', results.RouteUID, 'added');
                    console.log('stop id like number = ', results.likeNumber);
                    var ptxTicket = '';
                    fs.readFile("./data/ptxTicket.json", 'utf-8', function(err, jsonData)
                    {
                      if (err)
                      {
                        console.log(err);
                      }
                      else
                      {
                        console.log("The ptx Ticket file was read!");
                        var ticket_json = JSON.parse(jsonData);
                        var location = routerRouteList[0].Location;
                        ptxTicket = ticket_json.Ticket;
                        console.log('ptxTicket = ', ptxTicket);
                        console.log('Location = ', location);
                        
                        var bus_Estimate_Time_Options = null;
                        var bus_RealTime_Stop_Options = null;
                        
                        if (location === "InterCity")
                        {
                            bus_Estimate_Time_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/InterCity?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                            
                            bus_RealTime_Stop_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/RealTimeNearStop/InterCity?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                        }
                        else if (location === "NewTaipei")
                        {
                            bus_Estimate_Time_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/City/'+location+'?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                                
                            var routeuid = (routerRouteList[0].RouteUID).substr(0, (routerRouteList[0].RouteUID.length - 1));
                            bus_RealTime_Stop_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/RealTimeNearStop/City/Tainan?ticket='+ptxTicket+'&%24filter=contains(RouteUID%2C%20\u0027'+routeuid+'\u0027)&%24format=JSON'
                            };
                        }
                        else
                        {
                            bus_Estimate_Time_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/City/'+location+'?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                            
                            bus_RealTime_Stop_Options = {
                                host:'ptx.transportdata.tw',
                                path: '/MOTC/v2/Bus/EstimatedTimeOfArrival/City/'+location+'?ticket='+ptxTicket+'&%24filter=RouteUID%20eq%20\u0027'+routerRouteList[0].RouteUID+'\u0027&%24format=JSON'
                            };
                        }
                        http.get(bus_Estimate_Time_Options, function (response)
                        { 
                            var routerData = '';
                            response.on('data', function(chunk) {
                                routerData += chunk;
                            });
                            
                            response.on('end', function(chunk)
                            {
                              //console.log("show the Kaohsiung N1 API data : "+routerData);
                              var router_data = null;
                              try
                              {
                                  router_data = JSON.parse(routerData);
                              }
                              catch (e)
                              {
                                  console.log("show the now N1 API data : "+routerData);
                                  console.log("error message : "+e);
                                  return;
                              }
                              
                              var busEstimateTime = mongoose.model('busEstimateTime');
                              for (var i=0;i<router_data.length;i++)
                              {
                                if (router_data[i].StopUID !== "")
                                {
                                    var stopuid = router_data[i].StopUID;
                                    busEstimateTime.findOneAndUpdate({StopUID: stopuid}, router_data[i], 
                                    {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true}, 
                                    function (err, results, raw) {
                                      if (err)
                                      {
                                          console.log("N1API db find data error : "+err);
                                      }
                                        
                                      if (raw.lastErrorObject.updatedExisting)
                                      {
                                        console.log('trace N1API = ', results.StopUID, 'updated');
                                      }
                                      else
                                      {
                                        console.log('trace N1API = ', results.StopUID, 'added');
                                      }
                                    });
                                }
                              }
                            });
                          }).end();
                        
                        http.get(bus_RealTime_Stop_Options, function (response)
                        { 
                            var routerData = '';
                            response.on('data', function(chunk) {
                                routerData += chunk;
                            });
                            
                            response.on('end', function(chunk)
                            {
                              //console.log("show the Kaohsiung N1 API data : "+routerData);
                              var router_data = null;
                              try
                              {
                                  router_data = JSON.parse(routerData);
                              }
                              catch (e)
                              {
                                  console.log("show the now A2 API data : "+routerData);
                                  console.log("error message : "+e);
                                  return;
                              }
                              
                              var busRealTimeNearStop = mongoose.model('busRealTimeNearStop');
                              busRealTimeNearStop.remove({RouteUID: routeuid},
                              function (err, results) {
                                  if (err)
                                  {
                                      console.log("route id find data error : "+err);
                                  }
                                  
                                  console.log("delete results = "+results);
                              });
                              
                              for (var i=0;i<router_data.length;i++)
                              {
                                  if (router_data[i].StopUID !== "")
                                  {
                                      var stopuid = router_data[i].StopUID;
                                      
                                      if (location === "NewTaipei")
                                      {
                                          router_data[i].RouteUID = router_data[i].RouteUID.substr(0, (router_data[i].RouteUID.length - 1)) + "0";
                                      }
                                      
                                      var routeuid = router_data[i].RouteUID;
                                      
                                      busRealTimeNearStop.findOneAndUpdate({StopUID: stopuid, RouteUID: routeuid}, router_data[i], 
                                      {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true}, 
                                      function (err, results, raw) {
                                        if (err)
                                        {
                                            console.log("A2API db find data error : "+err);
                                        }
                                          
                                        if (raw.lastErrorObject.updatedExisting)
                                        {
                                          console.log('trace A2API = ', results.StopUID, 'updated');
                                        }
                                        else
                                        {
                                          console.log('trace A2API = ', results.StopUID, 'added');
                                        }
                                      });
                                  }
                              }
                            });
                          }).end();
                      }
                    });
                  }
              });
          }

          res.send(routerRouteList);
          res.end();
        }
    });
});

/**
 * get method for Dislike bus route id.
 */
router.get('/dislikeBusRouteId', function(req, res)
{
  console.log("dislike the route id");
  console.log("route uid = "+decodeURIComponent(req.query.routeUID));
  var routeUID = decodeURIComponent(req.query.routeUID);
  
  var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
  console.log("dislike bus route id = "+routeUID);
  cityRouteEstimateTimeList.findOne({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("RouteUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      /*if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('this RouteUID is not in list');
      }
      else
      {
          if (cityBusETList.likeNumber > 1)
          {
              cityBusETList.likeNumber--;
              cityBusETList.save(function (err) {
                  if(err) {
                      console.error('update city Bus ET List ERROR!');
                  }
                  
                  console.log('update the city Bus ET List!!');
              });
          }
          else
          {
              // cityBusETList.likeNumber = 0;
              cityRouteEstimateTimeList.findOneAndRemove({RouteUID: routeUID},
              function (err, results) {
                  if (err)
                  {
                      console.log("stop id find data error : "+err);
                  }
                  
                  console.log("delete results = "+results);
              });
          }
      }*/
  });
  res.send('{"status":200, "RouteUID":"'+routeUID+'","messages":"dislike is ok."}');
  res.end();
  
});

/**
 * post method for Dislike bus route id.
 */
router.post('/dislikeBusRouteId', function(req, res)
{
  console.log("dislike the route id");
  console.log("route uid = "+decodeURIComponent(req.body.routeUID));
  var routeUID = decodeURIComponent(req.body.routeUID);
  
  var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
  console.log("dislike bus route id = "+routeUID);
  cityRouteEstimateTimeList.findOne({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("RouteUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      /*if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('this RouteUID is not in list');
      }
      else
      {
          if (cityBusETList.likeNumber > 1)
          {
              cityBusETList.likeNumber--;
              cityBusETList.save(function (err) {
                  if(err) {
                      console.error('update city Bus ET List ERROR!');
                  }
                  
                  console.log('update the city Bus ET List!!');
              });
          }
          else
          {
              // cityBusETList.likeNumber = 0;
              cityRouteEstimateTimeList.findOneAndRemove({RouteUID: routeUID},
              function (err, results) {
                  if (err)
                  {
                      console.log("stop id find data error : "+err);
                  }
                  
                  console.log("delete results = "+results);
              });
          }
      }*/
  });
  res.send('{"status":200, "RouteUID":"'+routeUID+'","messages":"dislike is ok."}');
  res.end();
  
});

/**
 * get method for get RTNS by bus route id.
 */
router.get('/getRTNSByRouteId', function(req, res)
{
  console.log("get RTNS of the route id");
  console.log("route uid = "+decodeURIComponent(req.query.RouteUID));
  var routeUID = decodeURIComponent(req.query.RouteUID);
  
  var busRealTimeNearStop = mongoose.model('busRealTimeNearStop');
  console.log("dislike bus route id = "+routeUID);
  busRealTimeNearStop.find({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("RouteUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('this RouteUID is not in list');
          res.send('{"RouteUID":"'+routeUID+'","RouteStatus":"0"}');
      }
      else
      {
          res.send(cityBusETList);
      }
      
      res.end();
  });
});

/**
 * post method for get RTNS by bus route id.
 */
router.post('/getRTNSByRouteId', function(req, res)
{
  console.log("get RTNS of the route id");
  console.log("route uid = "+decodeURIComponent(req.body.RouteUID));
  var routeUID = decodeURIComponent(req.body.RouteUID);
  
  var busRealTimeNearStop = mongoose.model('busRealTimeNearStop');
  console.log("dislike bus route id = "+routeUID);
  busRealTimeNearStop.find({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("RouteUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('this RouteUID is not in list');
          res.send('{"RouteUID":"'+routeUID+'","RouteStatus":"0"}');
      }
      else
      {
          res.send(cityBusETList);
      }
      
      res.end();
  });
});

/**
 * get method for get ETS by bus route id.
 */
router.get('/getESTByRouteId', function(req, res)
{
  console.log("get EST of the route id");
  console.log("route uid = "+decodeURIComponent(req.query.RouteUID));
  var routeUID = decodeURIComponent(req.query.RouteUID);
  
  var busEstimateTime = mongoose.model('busEstimateTime');
  console.log("dislike bus route id = "+routeUID);
  busEstimateTime.find({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("RouteUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('this RouteUID is not in list');
          res.status(404).send('{"RouteUID":"'+routeUID+'","messages":"routeUID is not in list."}');
      }
      else
      {
          res.send(cityBusETList);
      }
      
      res.end();
  });
});

/**
 * post method for get ETS by bus route id.
 */
router.post('/getESTByRouteId', function(req, res)
{
  console.log("get EST of the route id");
  console.log("route uid = "+decodeURIComponent(req.body.RouteUID));
  var routeUID = decodeURIComponent(req.body.RouteUID);
  
  var busEstimateTime = mongoose.model('busEstimateTime');
  console.log("search EST of bus route id = "+routeUID);
  busEstimateTime.find({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("RouteUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('this RouteUID is not in list');
          res.status(404).send('{"RouteUID":"'+routeUID+'","messages":"routeUID is not in list."}');
      }
      else
      {
          res.send(cityBusETList);
      }
      
      res.end();
  });
});

/**
 * get method for get ETS by bus stop id.
 */
router.get('/getESTByStopId', function(req, res)
{
  console.log("get EST of the stop id");
  console.log("stop uid = "+decodeURIComponent(req.query.StopUID));
  console.log("route uid = "+decodeURIComponent(req.query.RouteUID));
  var stopUID = decodeURIComponent(req.query.StopUID);
  var routeUID = decodeURIComponent(req.query.RouteUID);
  var direction = parseInt(decodeURIComponent(req.query.Direction), 10);
  
  var busEstimateTime = mongoose.model('busEstimateTime');
  console.log("search EST of bus stop id = "+stopUID);
  busEstimateTime.find({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("StopUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('cityBusETList is empty');
          res.status(404).send('{"StopUID":"'+stopUID+'","messages":"StopUID is not in list."}');
          res.end();
      }
      else
      {
          var data_index = null;
          for (var i=0; i<cityBusETList.length; i++)
          {
              if (direction != -1)
              {
                  if (((cityBusETList[i].StopUID).search(stopUID) >= 0) && (cityBusETList[i].Direction == direction))
                  {
                      data_index = i;
                      break;
                  }
              }
              else
              {
                  if ((cityBusETList[i].StopUID).search(stopUID) >= 0)
                  {
                      data_index = i;
                      break;
                  }
              }
          }
          
          if (data_index != null)
          {
              res.send(cityBusETList[data_index]);
              res.end();
              return;
          }
          else
          {
              // res.status(404).send('{"StopUID":"'+stopUID+'","messages":"StopUID is not in list."}');
              var routerStopList = mongoose.model('routerStopList');
              routerStopList.find({'RouteUID' : routeUID},
              function(err, routerRouteList)
              {
                  if(err)
                  {
                      console.log(err, 'error posting json');
                  }
                  else
                  {
                    console.log('routerStopList = '+routerRouteList);
                    
                    if (routerRouteList == null)
                    {
                        res.status(404).send('{"StopUID":"'+stopUID+'","messages":"StopUID is not in list."}');
                        res.end();
                        return;
                    }
                    
                    console.log('routerStopList length = '+routerRouteList.length);
                    console.log('routerStopList RouteUID = '+routerRouteList[0].RouteUID);
                    console.log('routerStopList stops length = '+routerRouteList[0].Stops.length);
                    
                    var now = new Date();
                    var returnData = null;
                    if (routerRouteList[0].RouteUID.search("NWT") != -1)
                    {
                        returnData = {"RouteUID":routerRouteList[0].RouteUID,
                                "RouteName":routerRouteList[0].RouteName,
                                "StopUID":null,
                                "StopName":null,
                                "EstimateTime":0,
                                "StopCountDown":0,
                                "UpdateTime":now.toLocaleString()};
                        
                        var busRealTimeNearStop = mongoose.model('busRealTimeNearStop');
                        busRealTimeNearStop.find({RouteUID: routeUID, StopUID: stopUID, Direction: direction},
                        function(err, cityBusETList){
                            if (err)
                            {
                                console.error("RouteUID data error : "+err);
                            }
                            
                            console.log('cityBusETList = '+cityBusETList);
                            if ((cityBusETList != null) && (cityBusETList != ''))
                            {
                                returnData.EstimateTime = 30;
                                returnData.StopCountDown = 1;
                            }
                            
                            for (var j=0;j<routerRouteList.length;j++)
                            {
                                for (var i=0;i<routerRouteList[j].Stops.length;i++)
                                {
                                   if (routerRouteList[j].Stops[i].StopUID === stopUID)
                                   {
                                       returnData.StopUID = stopUID;
                                       returnData.StopName = routerRouteList[j].Stops[i].StopName;
                                       break;
                                   }
                                }
                            }
                            var message = JSON.stringify(returnData);
                            console.log("send back data : "+message);
                            res.json(returnData);
                            res.end();
                        });
                    }
                    else
                    {
                        if ((routerRouteList[0].RouteUID.search("TAO") != -1) || (routerRouteList[0].RouteUID.search("KHH") != -1))
                        {
                            returnData = {"RouteUID":routerRouteList[0].RouteUID,
                                    "RouteName":routerRouteList[0].RouteName,
                                    "StopUID":null,
                                    "StopName":null,
                                    "EstimateTime":-1,
                                    "UpdateTime":now.toLocaleString()};
                        }
                        else
                        {
                            returnData = {"RouteUID":routerRouteList[0].RouteUID,
                                    "RouteName":routerRouteList[0].RouteName,
                                    "StopUID":null,
                                    "StopName":null,
                                    "EstimateTime":-1,
                                    "StopStatus":1,
                                    "UpdateTime":now.toLocaleString()};
                        }
                        
                        for (var j=0;j<routerRouteList.length;j++)
                        {
                            for (var i=0;i<routerRouteList[j].Stops.length;i++)
                            {
                               if (routerRouteList[j].Stops[i].StopUID === stopUID)
                               {
                                   returnData.StopUID = stopUID;
                                   returnData.StopName = routerRouteList[j].Stops[i].StopName;
                                   break;
                               }
                            }
                        }
                        var message = JSON.stringify(returnData);
                        console.log("send back data : "+message);
                        res.json(returnData);
                        res.end();
                    }
                  }
              });
          }
      }
  });
});

/**
 * post method for get ETS by bus stop id.
 */
router.post('/getESTByStopId', function(req, res)
{
  console.log("get EST of the stop id");
  console.log("stop uid = "+decodeURIComponent(req.body.StopUID));
  console.log("route uid = "+decodeURIComponent(req.body.RouteUID));
  var stopUID = decodeURIComponent(req.body.StopUID);
  var routeUID = decodeURIComponent(req.body.RouteUID);
  var direction = parseInt(decodeURIComponent(req.body.Direction), 10);
  
  var busEstimateTime = mongoose.model('busEstimateTime');
  console.log("search EST of bus stop id = "+stopUID);
  busEstimateTime.find({RouteUID: routeUID},
  function(err, cityBusETList){
      if (err)
      {
          console.error("StopUID data error : "+err);
      }
      
      console.log('cityBusETList = '+cityBusETList);
      if ((cityBusETList === null) || (cityBusETList == ''))
      {
          console.log('cityBusETList is empty');
          res.status(404).send('{"StopUID":"'+stopUID+'","messages":"StopUID is not in list."}');
          res.end();
      }
      else
      {
          var data_index = null;
          for (var i=0; i<cityBusETList.length; i++)
          {
              if (direction != -1)
              {
                  if (((cityBusETList[i].StopUID).search(stopUID) >= 0) && (cityBusETList[i].Direction == direction))
                  {
                      data_index = i;
                      break;
                  }
              }
              else
              {
                  if ((cityBusETList[i].StopUID).search(stopUID) >= 0)
                  {
                      data_index = i;
                      break;
                  }
              }
          }
          
          if (data_index != null)
          {
              res.send(cityBusETList[data_index]);
              res.end();
              return;
          }
          else
          {
              // res.status(404).send('{"StopUID":"'+stopUID+'","messages":"StopUID is not in list."}');
              var routerStopList = mongoose.model('routerStopList');
              routerStopList.find({'RouteUID' : routeUID},
              function(err, routerRouteList)
              {
                  if(err)
                  {
                      console.log(err, 'error posting json');
                  }
                  else
                  {
                    console.log('routerStopList = '+routerRouteList);
                    
                    if (routerRouteList == null)
                    {
                        res.status(404).send('{"StopUID":"'+stopUID+'","messages":"StopUID is not in list."}');
                        res.end();
                        return;
                    }
                    
                    console.log('routerStopList length = '+routerRouteList.length);
                    console.log('routerStopList RouteUID = '+routerRouteList[0].RouteUID);
                    console.log('routerStopList stops length = '+routerRouteList[0].Stops.length);
                    
                    var now = new Date();
                    var returnData = null;
                    if (routerRouteList[0].RouteUID.search("NWT") != -1)
                    {
                        returnData = {"RouteUID":routerRouteList[0].RouteUID,
                                "RouteName":routerRouteList[0].RouteName,
                                "StopUID":null,
                                "StopName":null,
                                "EstimateTime":0,
                                "StopCountDown":0,
                                "UpdateTime":now.toLocaleString()};
                        
                        var busRealTimeNearStop = mongoose.model('busRealTimeNearStop');
                        busRealTimeNearStop.find({RouteUID: routeUID, StopUID: stopUID, Direction: direction},
                        function(err, cityBusETList){
                            if (err)
                            {
                                console.error("RouteUID data error : "+err);
                            }
                            
                            console.log('cityBusETList = '+cityBusETList);
                            if ((cityBusETList != null) && (cityBusETList != ''))
                            {
                                returnData.EstimateTime = 30;
                                returnData.StopCountDown = 1;
                            }
                            
                            for (var j=0;j<routerRouteList.length;j++)
                            {
                                for (var i=0;i<routerRouteList[j].Stops.length;i++)
                                {
                                   if (routerRouteList[j].Stops[i].StopUID === stopUID)
                                   {
                                       returnData.StopUID = stopUID;
                                       returnData.StopName = routerRouteList[j].Stops[i].StopName;
                                       break;
                                   }
                                }
                            }
                            var message = JSON.stringify(returnData);
                            console.log("send back data : "+message);
                            res.json(returnData);
                            res.end();
                        });
                    }
                    else
                    {
                        if ((routerRouteList[0].RouteUID.search("TAO") != -1) || (routerRouteList[0].RouteUID.search("KHH") != -1))
                        {
                            returnData = {"RouteUID":routerRouteList[0].RouteUID,
                                    "RouteName":routerRouteList[0].RouteName,
                                    "StopUID":null,
                                    "StopName":null,
                                    "EstimateTime":-1,
                                    "UpdateTime":now.toLocaleString()};
                        }
                        else
                        {
                            returnData = {"RouteUID":routerRouteList[0].RouteUID,
                                    "RouteName":routerRouteList[0].RouteName,
                                    "StopUID":null,
                                    "StopName":null,
                                    "EstimateTime":-1,
                                    "StopStatus":1,
                                    "UpdateTime":now.toLocaleString()};
                        }
                        
                        for (var j=0;j<routerRouteList.length;j++)
                        {
                            for (var i=0;i<routerRouteList[j].Stops.length;i++)
                            {
                               if (routerRouteList[j].Stops[i].StopUID === stopUID)
                               {
                                   returnData.StopUID = stopUID;
                                   returnData.StopName = routerRouteList[j].Stops[i].StopName;
                                   break;
                               }
                            }
                        }
                        var message = JSON.stringify(returnData);
                        console.log("send back data : "+message);
                        res.json(returnData);
                        res.end();
                    }
                  }
              });
          }
      }
  });
});

/**
 * get method for get favorite bus list.
 */
router.get('/getFavoriteBusList', function(req, res)
{
  console.log("get Favorite bus list");
  console.log("STBID = "+decodeURIComponent(req.query.STBID));

  var STBID = decodeURIComponent(req.query.STBID);
  
  var favoriteBusLists = mongoose.model('favoriteBusList');
  favoriteBusLists.findOne({STBID: STBID},
  function(err, stbFavBusList){
      if (err)
      {
          console.log("STB ID data error : "+err);
      }
      
      console.error('stbFavBusList = '+stbFavBusList);
      if ((stbFavBusList === null) || (stbFavBusList == ''))
      {
          res.status(404).send('"message":"Favorite bus list was not found!!"');
          res.end;
      }
      else
      {
          res.status(200).send(stbFavBusList);
          res.end;
      }
  });
});

/**
 * post method for get favorite bus list.
 */
router.post('/getFavoriteBusList', function(req, res)
{
  console.log("get Favorite bus list");
  console.log("STBID = "+decodeURIComponent(req.body.STBID));

  var STBID = decodeURIComponent(req.body.STBID);
  
  var favoriteBusLists = mongoose.model('favoriteBusList');
  favoriteBusLists.findOne({STBID: STBID},
  function(err, stbFavBusList){
      if (err)
      {
          console.log("STB ID data error : "+err);
      }
      
      console.error('stbFavBusList = '+stbFavBusList);
      if ((stbFavBusList === null) || (stbFavBusList == ''))
      {
          res.status(404).send('"message":"Favorite bus list was not found!!"');
          res.end;
      }
      else
      {
          res.status(200).send(stbFavBusList);
          res.end;
      }
  });
});

/**
 * get method for Update bus station id.
 */
router.get('/updateBusStationId', function(req, res)
{
  console.log("update the stop id of which STB");
  console.log("updateData = "+decodeURIComponent(req.query.updateData));
  console.log("city name = "+decodeURIComponent(req.query.cityName));
  var favoriteList = JSON.parse(req.query.updateData);
  var cityName = req.query.cityName;
  
  var favoriteBusLists = mongoose.model('favoriteBusList');
  favoriteBusLists.findOne({STBID: favoriteList.STBID},
  function(err, stbFavBusList){
      if (err)
      {
          console.log("STB ID data error : "+err);
      }
      
      console.error('stbFavBusList = '+stbFavBusList);
      if ((stbFavBusList === null) || (stbFavBusList == ''))
      {
          var newstbFavBusList = new favoriteBusLists(favoriteList);
          newstbFavBusList.save(function (err) {
              if(err) {
                  console.error('ERROR!');
              }
              
              console.log('save new favorite Bus list');
          });
          
          res.send('{"status": 200, "STBID": "'+favoriteList.STBID+'"}');
          res.end;
      }
      else
      {
          var isExist = false;
          console.log("stbFavBusList.BusList length = "+stbFavBusList.BusList.length);
          for (var i=0;i<stbFavBusList.BusList.length;i++)
          {
              console.log("the index i is = "+i);
              console.log("stbFavBusList.BusList = "+stbFavBusList.BusList[i].StopUID);
              console.log("favoriteList.BusList[0].StopID = "+favoriteList.BusList[0].StopUID);
              if (((stbFavBusList.BusList[i].StopUID).search((favoriteList.BusList[0].StopUID)) >= 0) && ((stbFavBusList.BusList[i].RouteUID).search((favoriteList.BusList[0].RouteUID)) >= 0))
              {
                  isExist = true;
                  if (stbFavBusList.BusList[i].Type != favoriteList.BusList[0].Type)
                  {
                      stbFavBusList.BusList[i].Type = favoriteList.BusList[0].Type;
                      stbFavBusList.save(function (err) {
                          if(err) {
                              console.error('update new favorite ERROR!');
                          }
                          
                          console.log('update bus type in list');
                      });
                      res.send('{"status": 200, "STBID": "'+favoriteList.STBID+'"}');
                      res.end;
                      break;
                  }
              }
          }
          
          if (isExist === false)
          {
              if (stbFavBusList.BusList.length > 9)
              {
                  res.status(500).send('{"status": 500, "STBID": "'+favoriteList.STBID+'"}');
                  res.end;
              }
              else
              {
                  favoriteBusLists.update({STBID: favoriteList.STBID},
                  {$push:{BusList: favoriteList.BusList[0]}},
                  {upsert:true},
                  function (err, result)
                  {
                      if (err)
                      {
                          console.error('add new bus list ERROR! '+err);
                      }
                      
                      console.log('new favorite Bus list = '+result);
                      console.log('save new favorite Bus list');
                  });
                  
                  // var cityBusEstimateTimeList = mongoose.model('cityBusEstimateTimeList');
                  var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
                  
                  for (var i=0;i<favoriteList.BusList.length;i++)
                  {
                      console.log("update bus stop id = "+favoriteList.BusList[i].StopUID);
                      console.log("update bus stop id = "+favoriteList.BusList[i].RouteUID);
                      
                      cityRouteEstimateTimeList.findOneAndUpdate({RouteUID:favoriteList.BusList[i].RouteUID, Location:cityName},
                      ({$inc:{likeNumber:1}}),
                      {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true},
                      function (err, results, raw) {
                          if (err)
                          {
                              console.log("route id find data error : "+err);
                          }
                            
                          if (raw.lastErrorObject.updatedExisting)
                          {
                            console.log('trace router id = ', results.RouteUID, 'updated');
                            console.log('router id like number = ', results.likeNumber);
                          }
                          else
                          {
                            console.log('trace router id = ', results.RouteUID, 'added');
                            console.log('router id like number = ', results.likeNumber);
                          }
                      });
                  }
                  
                  res.send('{"status": 200, "STBID": "'+favoriteList.STBID+'"}');
                  res.end;
              }
              
          }
      }
  });

});

/**
 * post method for Update bus station id.
 */
router.post('/updateBusStationId', function(req, res)
{
  console.log("update the stop id of which STB");
  console.log("updateData = "+decodeURIComponent(req.body.updateData));
  console.log("city name = "+decodeURIComponent(req.body.cityName));
  var favoriteList = JSON.parse(req.body.updateData);
  var cityName = req.body.cityName;
  
  var favoriteBusLists = mongoose.model('favoriteBusList');
  favoriteBusLists.findOne({STBID: favoriteList.STBID},
  function(err, stbFavBusList){
      if (err)
      {
          console.log("STB ID data error : "+err);
      }
      
      console.error('stbFavBusList = '+stbFavBusList);
      if ((stbFavBusList === null) || (stbFavBusList == ''))
      {
          var newstbFavBusList = new favoriteBusLists(favoriteList);
          newstbFavBusList.save(function (err) {
              if(err) {
                  console.error('ERROR!');
              }
              
              console.log('save new favorite Bus list');
          });
          
          res.send('{"status": 200, "STBID": "'+favoriteList.STBID+'"}');
          res.end;
      }
      else
      {
          var isExist = false;
          console.log("stbFavBusList.BusList length = "+stbFavBusList.BusList.length);
          for (var i=0;i<stbFavBusList.BusList.length;i++)
          {
              console.log("the index i is = "+i);
              console.log("stbFavBusList.BusList = "+stbFavBusList.BusList[i].StopUID);
              console.log("favoriteList.BusList[0].StopID = "+favoriteList.BusList[0].StopUID);
              if (((stbFavBusList.BusList[i].StopUID).search((favoriteList.BusList[0].StopUID)) >= 0) && ((stbFavBusList.BusList[i].RouteUID).search((favoriteList.BusList[0].RouteUID)) >= 0))
              {
                  isExist = true;
                  if (stbFavBusList.BusList[i].Type != favoriteList.BusList[0].Type)
                  {
                      stbFavBusList.BusList[i].Type = favoriteList.BusList[0].Type;
                      stbFavBusList.save(function (err) {
                          if(err) {
                              console.error('update new favorite ERROR!');
                          }
                          
                          console.log('update bus type in list');
                      });
                      res.send('{"status": 200, "STBID": "'+favoriteList.STBID+'"}');
                      res.end;
                      break;
                  }
              }
          }
          
          if (isExist === false)
          {
              if (stbFavBusList.BusList.length > 9)
              {
                  res.status(500).send('{"status": 500, "STBID": "'+favoriteList.STBID+'"}');
                  res.end;
              }
              else
              {
                  favoriteBusLists.update({STBID: favoriteList.STBID},
                  {$push:{BusList: favoriteList.BusList[0]}},
                  {upsert:true},
                  function (err, result)
                  {
                      if (err)
                      {
                          console.error('add new bus list ERROR! '+err);
                      }
                      
                      console.log('new favorite Bus list = '+result);
                      console.log('save new favorite Bus list');
                  });
                  
                  // var cityBusEstimateTimeList = mongoose.model('cityBusEstimateTimeList');
                  var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
                  
                  for (var i=0;i<favoriteList.BusList.length;i++)
                  {
                      console.log("update bus stop id = "+favoriteList.BusList[i].StopUID);
                      console.log("update bus stop id = "+favoriteList.BusList[i].RouteUID);
                      
                      cityRouteEstimateTimeList.findOneAndUpdate({RouteUID:favoriteList.BusList[i].RouteUID, Location:cityName},
                      ({$inc:{likeNumber:1}}),
                      {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true},
                      function (err, results, raw) {
                          if (err)
                          {
                              console.log("route id find data error : "+err);
                          }
                            
                          if (raw.lastErrorObject.updatedExisting)
                          {
                            console.log('trace router id = ', results.RouteUID, 'updated');
                            console.log('router id like number = ', results.likeNumber);
                          }
                          else
                          {
                            console.log('trace router id = ', results.RouteUID, 'added');
                            console.log('router id like number = ', results.likeNumber);
                          }
                      });
                  }
                  
                  res.send('{"status": 200, "STBID": "'+favoriteList.STBID+'"}');
                  res.end;
              }
          }
      }
  });
});

/**
 * get method for Delete bus station id.
 */
router.get('/deleteBusStationId', function(req, res)
{
  console.log("delete the stop id of which STB");
  console.log("deleteData = "+decodeURIComponent(req.query.deleteData));
  //console.log("city name = "+decodeURIComponent(req.query.cityName));
  var favoriteList = JSON.parse(req.query.deleteData);
  //var cityName = req.query.cityName;
  
  var favoriteBusLists = mongoose.model('favoriteBusList');
  favoriteBusLists.findOne({STBID: favoriteList.STBID},
  function(err, stbFavBusList){
      if (err)
      {
          console.error("STB ID data error : "+err);
      }
      
      console.log('stbFavBusList = '+stbFavBusList);
      if ((stbFavBusList === null) || (stbFavBusList == ''))
      {
          console.log('this STB ID not in list');
          res.status(404).send('{"STBID":"'+favoriteList.STBID+'"}');
          res.end();
      }
      else
      {
          console.log("stbFavBusList.BusList length = "+stbFavBusList.BusList.length);
          
          if (stbFavBusList.BusList.length > 1)
          {
              favoriteBusLists.findOneAndUpdate({STBID: favoriteList.STBID},
              {$pull:{BusList:{StopUID:favoriteList.BusList[0].StopUID}}},
              {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true},
              function (err, results, raw) {
                  if (err)
                  {
                      console.log("router id find data error : "+err);
                  }
                  
                  if (raw.lastErrorObject.updatedExisting)
                  {
                    console.log(JSON.stringify(results));
                    console.log('trace stop id was deleted');

                    var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
                    console.log("delete bus route id = "+favoriteList.BusList[0].RouteUID);
                    cityRouteEstimateTimeList.findOne({RouteUID: favoriteList.BusList[0].RouteUID},
                    function(err, cityBusETList){
                        if (err)
                        {
                            console.error("StopID data error : "+err);
                        }
                        
                        console.log('cityBusETList = '+cityBusETList);
                        if ((cityBusETList === null) || (cityBusETList == ''))
                        {
                            console.log('this RouteUID is not in list');
                        }
                        else
                        {
                            if (cityBusETList.likeNumber > 1)
                            {
                                cityBusETList.likeNumber--;
                                cityBusETList.save(function (err) {
                                    if(err) {
                                        console.error('update city Bus ET List ERROR!');
                                    }
                                    
                                    console.log('update the city Bus ET List!!');
                                });
                            }
                            else
                            {
                                // cityBusETList.likeNumber = 0;
                                cityRouteEstimateTimeList.findOneAndRemove({RouteUID: favoriteList.BusList[0].RouteUID},
                                function (err, results) {
                                    if (err)
                                    {
                                        console.log("stop id find data error : "+err);
                                    }
                                    
                                    console.log("delete results = "+results);
                                });
                            }
                        }
                    });
                    res.send('{"status":200, "STBID":"'+favoriteList.STBID+'"}');
                    res.end();
                  }
              });
          }
          else
          {
              var isRemoveSTBItem = false;
              if (stbFavBusList.BusList.length == 0)
              {
                  isRemoveSTBItem = true;
              }
              else if (stbFavBusList.BusList.length == 1)
              {
                  if ((stbFavBusList.BusList[i].StopUID).search((favoriteList.BusList[0].StopUID)) >= 0)
                  {
                      isRemoveSTBItem = true;
                  }
                  else
                  {
                      res.status(404).send('{"STBID":"'+favoriteList.STBID+'"}');
                      res.end();
                  }
              }
              
              if (isRemoveSTBItem === true)
              {
                  favoriteBusLists.findOneAndRemove({STBID: favoriteList.STBID},
                  function (err, results) {
                      if (err)
                      {
                          console.log("stop id find data error : "+err);
                      }
                      
                      console.log("delete results = "+results);
                  });
                  
                  var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
                  console.log("delete bus route id = "+favoriteList.BusList[0].RouteUID);
                  cityRouteEstimateTimeList.findOne({RouteUID: favoriteList.BusList[0].RouteUID},
                  function(err, cityBusETList){
                      if (err)
                      {
                          console.error("RouteID data error : "+err);
                      }
                      
                      console.log('cityBusETList = '+cityBusETList);
                      if ((cityBusETList === null) || (cityBusETList == ''))
                      {
                          console.log('this RouteUID is not in list');
                      }
                      else
                      {
                          if (cityBusETList.likeNumber > 1)
                          {
                              cityBusETList.likeNumber--;
                              cityBusETList.save(function (err) {
                                  if(err) {
                                      console.error('update city Bus ET List ERROR!');
                                  }
                                  
                                  console.log('update the city Bus ET List!!');
                              });
                          }
                          else
                          {
                              // cityBusETList.likeNumber = 0;
                              cityRouteEstimateTimeList.findOneAndRemove({RouteUID: favoriteList.BusList[0].RouteUID},
                              function (err, results) {
                                  if (err)
                                  {
                                      console.log("Route id find data error : "+err);
                                  }
                                  
                                  console.log("delete results = "+results);
                              });
                          }
                      }
                  });
                  res.send('{"status":200, "STBID":"'+favoriteList.STBID+'"}');
                  res.end();
              }
          }
      }
  });
});

/**
 * post method for Delete bus station id.
 */
router.post('/deleteBusStationId', function(req, res)
{
    console.log("delete the stop id of which STB");
    console.log("deleteData = "+decodeURIComponent(req.body.deleteData));
    //console.log("city name = "+decodeURIComponent(req.body.cityName));
    var favoriteList = JSON.parse(req.body.deleteData);
    //var cityName = req.body.cityName;
    
    var favoriteBusLists = mongoose.model('favoriteBusList');
    favoriteBusLists.findOne({STBID: favoriteList.STBID},
    function(err, stbFavBusList){
        if (err)
        {
            console.error("STB ID data error : "+err);
        }
        
        console.log('stbFavBusList = '+stbFavBusList);
        if ((stbFavBusList === null) || (stbFavBusList == ''))
        {
            console.log('this STB ID not in list');
            res.status(404).send('{"STBID":"'+favoriteList.STBID+'"}');
            res.end();
        }
        else
        {
            console.log("stbFavBusList.BusList length = "+stbFavBusList.BusList.length);
            
            if (stbFavBusList.BusList.length > 1)
            {
                favoriteBusLists.findOneAndUpdate({STBID: favoriteList.STBID},
                {$pull:{BusList:{StopUID:favoriteList.BusList[0].StopUID}}},
                {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true},
                function (err, results, raw) {
                    if (err)
                    {
                        console.log("router id find data error : "+err);
                    }
                    
                    if (raw.lastErrorObject.updatedExisting)
                    {
                      console.log(JSON.stringify(results));
                      console.log('trace stop id was deleted');

                      var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
                      console.log("delete bus route id = "+favoriteList.BusList[0].RouteUID);
                      cityRouteEstimateTimeList.findOne({RouteUID: favoriteList.BusList[0].RouteUID},
                      function(err, cityBusETList){
                          if (err)
                          {
                              console.error("StopID data error : "+err);
                          }
                          
                          console.log('cityBusETList = '+cityBusETList);
                          if ((cityBusETList === null) || (cityBusETList == ''))
                          {
                              console.log('this RouteUID is not in list');
                          }
                          else
                          {
                              if (cityBusETList.likeNumber > 1)
                              {
                                  cityBusETList.likeNumber--;
                                  cityBusETList.save(function (err) {
                                      if(err) {
                                          console.error('update city Bus ET List ERROR!');
                                      }
                                      
                                      console.log('update the city Bus ET List!!');
                                  });
                              }
                              else
                              {
                                  // cityBusETList.likeNumber = 0;
                                  cityRouteEstimateTimeList.findOneAndRemove({RouteUID: favoriteList.BusList[0].RouteUID},
                                  function (err, results) {
                                      if (err)
                                      {
                                          console.log("stop id find data error : "+err);
                                      }
                                      
                                      console.log("delete results = "+results);
                                  });
                              }
                          }
                      });
                      res.send('{"status":200, "STBID":"'+favoriteList.STBID+'"}');
                      res.end();
                    }
                });
            }
            else
            {
                var isRemoveSTBItem = false;
                if (stbFavBusList.BusList.length == 0)
                {
                    isRemoveSTBItem = true;
                }
                else if (stbFavBusList.BusList.length == 1)
                {
                    if (stbFavBusList.BusList[0].StopUID == favoriteList.BusList[0].StopUID)
                    {
                        isRemoveSTBItem = true;
                    }
                    else
                    {
                        res.status(404).send('{"STBID":"'+favoriteList.STBID+'"}');
                        res.end();
                    }
                }
                
                if (isRemoveSTBItem === true)
                {
                    favoriteBusLists.findOneAndRemove({STBID: favoriteList.STBID},
                    function (err, results) {
                        if (err)
                        {
                            console.log("stop id find data error : "+err);
                        }
                        
                        console.log("delete results = "+results);
                    });
                    
                    var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
                    console.log("delete bus route id = "+favoriteList.BusList[0].RouteUID);
                    cityRouteEstimateTimeList.findOne({RouteUID: favoriteList.BusList[0].RouteUID},
                    function(err, cityBusETList){
                        if (err)
                        {
                            console.error("StopID data error : "+err);
                        }
                        
                        console.log('cityBusETList = '+cityBusETList);
                        if ((cityBusETList === null) || (cityBusETList == ''))
                        {
                            console.log('this RouteUID is not in list');
                        }
                        else
                        {
                            if (cityBusETList.likeNumber > 1)
                            {
                                cityBusETList.likeNumber--;
                                cityBusETList.save(function (err) {
                                    if(err) {
                                        console.error('update city Bus ET List ERROR!');
                                    }
                                    
                                    console.log('update the city Bus ET List!!');
                                });
                            }
                            else
                            {
                                // cityBusETList.likeNumber = 0;
                                cityRouteEstimateTimeList.findOneAndRemove({RouteUID: favoriteList.BusList[0].RouteUID},
                                function (err, results) {
                                    if (err)
                                    {
                                        console.log("stop id find data error : "+err);
                                    }
                                    
                                    console.log("delete results = "+results);
                                });
                            }
                        }
                    });
                    res.send('{"status":200, "STBID":"'+favoriteList.STBID+'"}');
                    res.end();
                }
            }
        }
    });
});

/**
 * get method for Delete bus station id.
 */
router.get('/deleteAllBusStationId', function(req, res)
{
  console.log("delete the stop id of which STB");
  console.log("deleteSTBID = "+decodeURIComponent(req.query.deleteSTBID));
  //console.log("city name = "+decodeURIComponent(req.query.cityName));
  var deleteSTBID = req.query.deleteSTBID;
  //var cityName = req.query.cityName;
  
  var favoriteBusLists = mongoose.model('favoriteBusList');
  favoriteBusLists.findOne({STBID: deleteSTBID},
  function(err, stbFavBusList)
  {
      if (err)
      {
          console.error("STB ID data error : "+err);
      }
      
      console.log('stbFavBusList = '+stbFavBusList);
      if ((stbFavBusList === null) || (stbFavBusList == ''))
      {
          console.log('this STB ID not in list');
          res.send('{"status":200, "STBID":"'+deleteSTBID+'was delete all."}');
          res.end();
      }
      else
      {
          console.log("stbFavBusList.BusList length = "+stbFavBusList.BusList.length);
          
          if (stbFavBusList.BusList.length > 0)
          {
              var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
              
              for (var i=0;i<stbFavBusList.BusList.length;i++)
              {
                  console.log("delete bus route id = "+stbFavBusList.BusList[i].RouteUID);
                  cityRouteEstimateTimeList.findOne({RouteUID: stbFavBusList.BusList[i].RouteUID},
                  function(err, cityBusETList)
                  {
                      if (err)
                      {
                          console.error("StopID data error : "+err);
                      }
                      
                      console.log('cityBusETList = '+cityBusETList);
                      if ((cityBusETList === null) || (cityBusETList == ''))
                      {
                          console.log('this RouteUID is not in list');
                      }
                      else
                      {
                          if (cityBusETList.likeNumber > 1)
                          {
                              cityBusETList.likeNumber--;
                              cityBusETList.save(function (err) {
                                  if(err) {
                                      console.error('update city Bus ET List ERROR!');
                                  }
                                  
                                  console.log('update the city Bus ET List!!');
                              });
                          }
                          else
                          {
                              // cityBusETList.likeNumber = 0;
                              cityRouteEstimateTimeList.findOneAndRemove({RouteUID: stbFavBusList.BusList[i].RouteUID},
                              function (err, results) {
                                  if (err)
                                  {
                                      console.log("route id find data error : "+err);
                                  }
                                  
                                  console.log("delete results = "+results);
                              });
                          }
                      }
                  });
              }
          }
          
          favoriteBusLists.findOneAndRemove({STBID: deleteSTBID},
          function (err, results) {
              if (err)
              {
                  console.log("stop id find data error : "+err);
              }
              
              console.log("delete results = "+results);
          });
          res.send('{"status":200, "STBID":"'+deleteSTBID+'was delete all."}');
          res.end();
      }
  });
});


/**
 * post method for Delete bus station id.
 */
router.post('/deleteAllBusStationId', function(req, res)
{
    console.log("delete the stop id of which STB");
    console.log("deleteSTBID = "+decodeURIComponent(req.body.deleteSTBID));
    //console.log("city name = "+decodeURIComponent(req.query.cityName));
    var deleteSTBID = req.body.deleteSTBID;
    //var cityName = req.query.cityName;
    
    var favoriteBusLists = mongoose.model('favoriteBusList');
    favoriteBusLists.findOne({STBID: deleteSTBID},
    function(err, stbFavBusList)
    {
        if (err)
        {
            console.error("STB ID data error : "+err);
        }
        
        console.log('stbFavBusList = '+stbFavBusList);
        if ((stbFavBusList === null) || (stbFavBusList == ''))
        {
            console.log('this STB ID not in list');
            res.send('{"status":200, "STBID":"'+deleteSTBID+' was delete all."}');
            res.end();
        }
        else
        {
            console.log("stbFavBusList.BusList length = "+stbFavBusList.BusList.length);
            
            if (stbFavBusList.BusList.length > 0)
            {
                var cityRouteEstimateTimeList = mongoose.model('cityRouteEstimateTimeList');
                
                for (var i=0;i<stbFavBusList.BusList.length;i++)
                {
                    console.log("delete bus route id = "+stbFavBusList.BusList[i].RouteUID);
                    cityRouteEstimateTimeList.findOne({RouteUID: stbFavBusList.BusList[i].RouteUID},
                    function(err, cityBusETList)
                    {
                        if (err)
                        {
                            console.error("StopID data error : "+err);
                        }
                        
                        console.log('cityBusETList = '+cityBusETList);
                        if ((cityBusETList === null) || (cityBusETList == ''))
                        {
                            console.log('this RouteUID is not in list');
                        }
                        else
                        {
                            if (cityBusETList.likeNumber > 1)
                            {
                                cityBusETList.likeNumber--;
                                cityBusETList.save(function (err) {
                                    if(err) {
                                        console.error('update city Bus ET List ERROR!');
                                    }
                                    
                                    console.log('update the city Bus ET List!!');
                                });
                            }
                            else
                            {
                                // cityBusETList.likeNumber = 0;
                                cityRouteEstimateTimeList.findOneAndRemove({RouteUID: stbFavBusList.BusList[i].RouteUID},
                                function (err, results) {
                                    if (err)
                                    {
                                        console.log("route id find data error : "+err);
                                    }
                                    
                                    console.log("delete results = "+results);
                                });
                            }
                        }
                    });
                }
            }
            
            favoriteBusLists.findOneAndRemove({STBID: deleteSTBID},
            function (err, results) {
                if (err)
                {
                    console.log("stop id find data error : "+err);
                }
                
                console.log("delete results = "+results);
            });
            res.send('{"status":200, "STBID":"'+deleteSTBID+' was delete all."}');
            res.end();
        }
    });
});
module.exports = router;