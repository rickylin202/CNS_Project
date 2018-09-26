var express = require('express');
var router = express.Router();
var http = require('http');
var querystring = require('querystring');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * post method for add FET Account.
 */
router.post('/addKMUHAccount', function(req, res)
{
  console.log("add account with STB No");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  var id = decodeURIComponent(req.body.id);
  var birthday = decodeURIComponent(req.body.birthday);
  var newKMUHAcct = {
          account:accountid,
          id:id,
          birthday:birthday,
          isFirstBooking: false
      };
  
  var kmuhInfoList = mongoose.model('kmuhInfoTable');
  kmuhInfoList.findOne({account: accountid},
  function(err, accountSet)
  {
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      console.error('accountSet = '+accountSet);
      if ((accountSet === null) || (accountSet === '') || (accountSet === undefined))
      {
          var newKMUHAccount = new kmuhInfoList(newKMUHAcct);
          newKMUHAccount.save(function (err) {
              if(err) {
                  console.error('ERROR!');
              }
              
              console.log('save new KMUH account');
          });
          res.send('{"status": 200, "message": "'+newKMUHAcct.account+' was added."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);

          res.status(500).send('{"status": 500, "message": "'+newKMUHAcct.account+' was registered"}');
          res.end;
      }
  });
});

router.post('/getKMUHAccountInfo', function(req, res)
{
  console.log("add account with STB No");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);

  var kmuhInfoList = mongoose.model('kmuhInfoTable');
  kmuhInfoList.findOne({account: accountid},
  function(err, accountSet)
  {
      if (err)
      {
          console.log("account id data error : "+err);
      }
     
      if ((accountSet === null) || (accountSet === '') || (accountSet === undefined))
      {
          res.status(404).send('{"status": 404, "Account ID": "'+accountid+' is not found."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);
          var accout_info = new Object();
          accout_info.account = accountSet.account;
          accout_info.id = accountSet.id;
          accout_info.birthday = accountSet.birthday;
          accout_info.isFirstBooking = accountSet.isFirstBooking;
          res.send(JSON.stringify(accout_info));
          res.end;
      }
  });
});

router.post('/updateKMUHAccountInfo', function(req, res)
{
  console.log("add account with STB No");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);

  var kmuhInfoList = mongoose.model('kmuhInfoTable');
  kmuhInfoList.findOne({account: accountid},
  function(err, accountSet)
  {
      if (err)
      {
          console.log("account id data error : "+err);
      }
     
      if ((accountSet === null) || (accountSet === '') || (accountSet === undefined))
      {
          res.status(404).send('{"status": 404, "Account ID": "'+accountid+' is not found."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);
          accountSet.isFirstBooking = true;
          accountSet.save(function (err) {
              if(err)
              {
                  console.error('update account Data ERROR!');
                  res.status(400).send('{"status": 400, "message": "'+accountSet.account+'" can not update user status".}');
                  res.end;
              }
              else
              {
                  res.send('{"status": 200, "message": "'+accountSet.account+' update user status OK!"}');
                  res.end;
              }
              
              console.log('update account Data OK');
          });
      }
  });
});

router.post('/deleteKMUHAccountInfo', function(req, res)
{
  console.log("add account with STB No");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);

  var kmuhInfoList = mongoose.model('kmuhInfoTable');
  kmuhInfoList.findOneAndRemove({account: accountid},
  function (err, results) {
      if (err)
      {
          console.log("stop id find data error : "+err);
      }
      
      console.log("delete results = "+results);
      res.send('{"status":200, "account": "'+accountid+' was delete all."}');
      res.end();
  });
});

router.post('/addKMUHFavoriteList', function(req, res)
{
  console.log("add account with STB No");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  var doctorid = decodeURIComponent(req.body.doctorid);
  var doctorname = decodeURIComponent(req.body.doctorname);
  var deptid = decodeURIComponent(req.body.deptid);
  var deptname = decodeURIComponent(req.body.deptname);
  var subDeptCode = decodeURIComponent(req.body.subDeptCode);
  var subDeptName = decodeURIComponent(req.body.subDeptName);
  var noontype = decodeURIComponent(req.body.noonType);
  var favoriteday = decodeURIComponent(req.body.favoriteday);
  var local = decodeURIComponent(req.body.local);
  
  var newFavoriteList = {
          location:local,
          deptid:deptid,
          deptname:deptname,
          subDeptCode:subDeptCode,
          subDeptName:subDeptName,
          doctorid:doctorid,
          doctorname:doctorname,
          noonType:noontype,
          favoriteday:favoriteday,
          updateTime:new Date()
      };
  
  var kmuhFavoriteList = mongoose.model('kmuhFavoriteTable');
  kmuhFavoriteList.findOne({account: accountid},
  function(err, accountSet)
  {
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      console.error('accountSet = '+accountSet);
      
      if ((accountSet === null) || (accountSet === '') || (accountSet === undefined))
      {
          var addFavoriteList = {
               account:accountid,
               favorite_list:[newFavoriteList]
          };
          console.error('newFavoriteList.updateTime = '+ newFavoriteList.updateTime);
          var newKMUHAccount = new kmuhFavoriteList(addFavoriteList);
          newKMUHAccount.save(function (err) {
              if(err) {
                  console.error('ERROR!');
              }
              
              console.log('save new KMUH account');
          });
          res.send('{"status": 200, "message": "'+addFavoriteList.account+' was added."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);
          
          var is_exist = false;
          for (var i=0;i<accountSet.favorite_list.length;i++)
          {
              if (doctorid === accountSet.favorite_list[i].doctorid)
              {
                  is_exist = true;
                  accountSet.favorite_list[i].location = local;
                  accountSet.favorite_list[i].deptid = deptid;
                  accountSet.favorite_list[i].deptname = deptname;
                  accountSet.favorite_list[i].subDeptCode = subDeptCode;
                  accountSet.favorite_list[i].subDeptName = subDeptName;
                  accountSet.favorite_list[i].doctorname = doctorname;
                  accountSet.favorite_list[i].noonType = noontype;
                  accountSet.favorite_list[i].favoriteday = favoriteday;
                  accountSet.favorite_list[i].updateTime = new Date();
                  break;
              }
          }
          
          if (is_exist === true)
          {
              accountSet.save(function (err) {
                  if(err)
                  {
                      console.error('update account Data ERROR!');
                      res.status(400).send('{"status": 400, "message": "'+accountSet.account+'" can not update user status".}');
                      res.end;
                  }
                  else
                  {
                      res.send('{"status": 200, "message": "'+accountSet.account+' update user status OK!"}');
                      res.end;
                  }
                  
                  console.log('update account Data OK');
              });
          }
          else
          {
              if (accountSet.favorite_list.length < 10)
              {
                  accountSet.favorite_list.push(newFavoriteList);
              }
              else
              {
                  var old_record = new Date(accountSet.favorite_list[0].updateTime);
                  var the_old_index = 0;
                  for (var j=1;j<accountSet.favorite_list.length;j++)
                  {
                      var check_time = new Date(accountSet.favorite_list[j].updateTime);
                      
                      if (old_record.getTime() > check_time.getTime())
                      {
                          old_record = new Date(accountSet.favorite_list[j].updateTime);
                          the_old_index = j;
                      }
                  }
                  
                  accountSet.favorite_list.splice(the_old_index, 1);
                  accountSet.favorite_list.push(newFavoriteList);
              }
              
              accountSet.save(function (err) {
                  if(err)
                  {
                      console.error('update account Data ERROR!');
                      res.status(400).send('{"status": 400, "message": "'+accountSet.account+'" can not update user status".}');
                      res.end;
                  }
                  else
                  {
                      res.send('{"status": 200, "message": "'+accountSet.account+' update user status OK!"}');
                      res.end;
                  }
                  
                  console.log('update account Data OK');
              });
          }
          
          //res.send('{"status": 200, "message": "'+addFavoriteList.account+' was updated"}');
          //res.end;
      }
  });
});

router.post('/getKMUHFavoriteList', function(req, res)
{
  console.log("getKMUHFavoriteList");
  console.log("account = "+decodeURIComponent(req.body.account));
  console.log("location = "+decodeURIComponent(req.body.location));
  var accountid = decodeURIComponent(req.body.account);
  var location = decodeURIComponent(req.body.location);
  var kmuhFavoriteList = mongoose.model('kmuhFavoriteTable');
  kmuhFavoriteList.findOne({account: accountid},
  function(err, accountSet)
  {
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      console.log('accountSet = '+accountSet);
      console.log('location = '+location);
      if ((accountSet === null) || (accountSet === '') || (accountSet === undefined))
      {

          res.status(404).send('{"status": 404, "Account ID": "'+accountid+' is not found."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);
          console.log("acount Set data - account length = "+accountSet.favorite_list.length);
          console.log("location type = "+typeof location);
          var favoriteList = new Array();
          
          for (var i=0;i<accountSet.favorite_list.length;i++)
          {
              if (location != "undefined")
              {
                  if (location === accountSet.favorite_list[i].location)
                  {
                      var favoriteInfo = new Object();
                      favoriteInfo.location = accountSet.favorite_list[i].location;
                      favoriteInfo.deptid = accountSet.favorite_list[i].deptid;
                      favoriteInfo.deptname = accountSet.favorite_list[i].deptname;
                      favoriteInfo.subDeptCode = accountSet.favorite_list[i].subDeptCode;
                      favoriteInfo.subDeptName = accountSet.favorite_list[i].subDeptName;
                      favoriteInfo.doctorid = accountSet.favorite_list[i].doctorid;
                      favoriteInfo.doctorname = accountSet.favorite_list[i].doctorname;
                      favoriteInfo.noonType = accountSet.favorite_list[i].noonType;
                      favoriteInfo.favoriteday = accountSet.favorite_list[i].favoriteday;
                      favoriteList.push(favoriteInfo);
                  }
                  
              }
              else
              {
                  var favoriteInfo = new Object();
                  favoriteInfo.location = accountSet.favorite_list[i].location;
                  favoriteInfo.deptid = accountSet.favorite_list[i].deptid;
                  favoriteInfo.deptname = accountSet.favorite_list[i].deptname;
                  favoriteInfo.subDeptCode = accountSet.favorite_list[i].subDeptCode;
                  favoriteInfo.subDeptName = accountSet.favorite_list[i].subDeptName;
                  favoriteInfo.doctorid = accountSet.favorite_list[i].doctorid;
                  favoriteInfo.doctorname = accountSet.favorite_list[i].doctorname;
                  favoriteInfo.noonType = accountSet.favorite_list[i].noonType;
                  favoriteInfo.favoriteday = accountSet.favorite_list[i].favoriteday;
                  favoriteList.push(favoriteInfo);
              }
          }
          
          res.send('{"status": 200, "favoriteList": '+JSON.stringify(favoriteList)+'}');
          res.end;
      }
  });
});

module.exports = router;
