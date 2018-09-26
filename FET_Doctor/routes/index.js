var express = require('express');
var router = express.Router();
var http = require('http');
var querystring = require('querystring');
var mongoose = require('mongoose');
var url = require('url');
var https = require('https');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/**
 * post method for add FET Account.
 */
router.post('/addFETAccount', function(req, res)
{
  console.log("add account with STB No");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  var password = decodeURIComponent(req.body.password);
  var stbno = decodeURIComponent(req.body.stbno);
  var soid = decodeURIComponent(req.body.soid);
  var accountData = {
    account:accountid,
    password:password,
    isNeedChangePWD:false,
    stbLists:[{
        stbno:stbno,
        soid:soid
    }]
  };
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.findOne({account: accountid},
  function(err, accountSet){
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      console.error('accountSet = '+accountSet);
      if ((accountSet === null) || (accountSet == '') || (accountSet === undefined))
      {
          var newFetAccount = new fetHealthActList(accountData);
          newFetAccount.save(function (err) {
              if(err) {
                  console.error('ERROR!');
              }
              
              console.log('save new FET account');
          });
          
          var FET_account_token_Options = null;
          //var urlstr = 'http://dev01.healthplus.tw/api/active.php?action=health4/login';
          var urlstr = 'http://www.healthplus.tw/api/active.php?action=health4/login';
          //var post_data = 'account='+accountData.account+'&password='+accountData.password;
          var bodyQueryStr = {"account":accountData.account, "password":accountData.password};
          var contentStr = querystring.stringify(bodyQueryStr);
          var urlData = url.parse(urlstr);
          
          console.log("contentStr = "+contentStr);
          console.log("host = "+urlData.hostname);
          console.log("path = "+urlData.path);
          
          FET_account_token_Options = {
            host: urlData.hostname,
            path: urlData.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(contentStr, 'utf8')
            },
            timeout: 10000
          };
          
          var post_req = http.request(FET_account_token_Options, function (response)
          {
              var account_login = '';
              response.setEncoding('utf8');
              response.on('data', function (chunk) {
                  console.log('Response: ' + chunk);
                  account_login += chunk;
              });
              response.on('end', function(chunk)
              {
                  var account_json = null;
                  var token = null;
                  var now = new Date();
                  try
                  {
                      account_json = JSON.parse(account_login);
                      accountData.token = account_json.data.t;
                      accountData.UpdateTime = now.toUTCString();
                  }
                  catch (e)
                  {
                      console.log("show the token data : "+accountData);
                      console.log("error message : "+e);
                      return;
                  }
                  
                  var fetHealthActList = mongoose.model('fetHealthActList');
                  fetHealthActList.findOneAndUpdate({account: accountData.account}, accountData, 
                     {"new":true, "upsert":true, "returnNewDocument":true, "passRawResult": true}, 
                     function (err, results) {
                        if (err)
                        {
                            console.log("FET account db find data error : "+err);
                        }

                        console.log('trace account id = ', results.account, ' , token = ', results.token, 'updated');
                        res.send('{"status": 200, "message": "'+results.account+' was added.", "Token": "'+results.token+'"}');
                        res.end;
                      }
                  );
              });
          });
          // post the data
          post_req.write(contentStr);
          post_req.end();
          
          //res.send('{"status": 200, "message": '+accountData.account+' was added.", "Token": "'+accountData.token+'}');
          //res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);
          console.log("acount Set data - stb list length = "+accountSet.stbLists.length);
          var is_stb_exist = false;
          
          for (var i=0;i<accountSet.stbLists.length;i++)
          {
              if ((accountSet.stbLists[i].stbno == stbno) && (accountSet.stbLists[i].soid == soid))
              {
                  is_stb_exist = true;
                  break;
              }
          }
          
          if (is_stb_exist === false)
          {
              var FET_account_token_Options = null;
              //var urlstr = 'http://dev01.healthplus.tw/api/active.php?action=health4/login';
              var urlstr = 'http://www.healthplus.tw/api/active.php?action=health4/login';
              //var post_data = 'account='+accountData.account+'&password='+accountData.password;
              var bodyQueryStr = {"account":accountData.account, "password":accountData.password};
              var contentStr = querystring.stringify(bodyQueryStr);
              var urlData = url.parse(urlstr);
              
              console.log("contentStr = "+contentStr);
              console.log("host = "+urlData.hostname);
              console.log("path = "+urlData.path);
              
              FET_account_token_Options = {
                host: urlData.hostname,
                path: urlData.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(contentStr, 'utf8')
                },
                timeout: 10000
              };
              
              var post_req = http.request(FET_account_token_Options, function (response)
              {
                  var account_login = '';
                  response.setEncoding('utf8');
                  response.on('data', function (chunk) {
                      console.log('Response: ' + chunk);
                      account_login += chunk;
                  });
                  response.on('end', function(chunk)
                  {
                      var account_json = null;
                      var token = null;
                      var now = new Date();
                      try
                      {
                          account_json = JSON.parse(account_login);
                      }
                      catch (e)
                      {
                          console.log("show the token data : "+accountSet);
                          console.log("error message : "+e);
                          return;
                      }
                      
                      if (account_json.message  == "OK")
                      {
                          accountSet.token = account_json.data.t;
                          accountSet.UpdateTime = now.toUTCString();
                          accountSet.stbLists.push(accountData.stbLists[0]);
                          accountSet.save( function(err){
                              if (err)
                              {
                                  console.log("FET account db find data error : "+err);
                              }

                              console.log('trace account id = ', accountSet.account, ' , token = ', accountSet.token, 'updated');
                              res.send('{"status": 200, "message": "'+accountSet.account+' was added.", "Token": "'+accountSet.token+'"}');
                              res.end;
                          })
                      }
                      else
                      {
                          res.status(400).send('{"status": 400, "message": "'+account_json.detail+'."}');
                          res.end;
                      }
                  });
              });
              // post the data
              post_req.write(contentStr);
              post_req.end();
          }
          else
          {
              res.status(500).send('{"status": 500, "message": "'+accountData.account+' was registered"}');
              res.end;
          }
      }
  });
});

/**
 * post method for add FET Account.
 */
router.post('/updateFETAccountPWD', function(req, res)
{
  console.log("add account with STB No");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  var password = decodeURIComponent(req.body.password);

  var accountData = {
    account:accountid,
    password:password,
    isNeedChangePWD:false
  };
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.findOne({account: accountid},
  function(err, accountSet){
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      console.error('accountSet = '+accountSet);
      if ((accountSet === null) || (accountSet == '') || (accountSet === undefined))
      {
          res.status(404).send('{"status": 404, "Account ID": "'+accountid+'" is not found.}');
          res.end;
      }
      else
      {
          var FET_account_token_Options = null;
          accountSet.password = password;
          //var urlstr = 'http://dev01.healthplus.tw/api/active.php?action=health4/login';
          var urlstr = 'http://www.healthplus.tw/api/active.php?action=health4/login';
          //var post_data = 'account='+accountData.account+'&password='+accountData.password;
          var bodyQueryStr = {"account":accountData.account, "password":accountData.password};
          var contentStr = querystring.stringify(bodyQueryStr);
          var urlData = url.parse(urlstr);
          
          console.log("contentStr = "+contentStr);
          console.log("host = "+urlData.hostname);
          console.log("path = "+urlData.path);
          
          FET_account_token_Options = {
            host: urlData.hostname,
            path: urlData.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(contentStr, 'utf8')
            }
          };
          
          var post_req = http.request(FET_account_token_Options, function (response)
          {
              var account_login = '';
              response.setEncoding('utf8');
              response.on('data', function (chunk) {
                  console.log('Response: ' + chunk);
                  account_login += chunk;
              });
              response.on('end', function(chunk)
              {
                  var account_json = null;
                  var token = null;
                  var now = new Date();
                  try
                  {
                      account_json = JSON.parse(account_login);
                      accountData.token = account_json.data.t;
                      accountData.UpdateTime = now.toUTCString();
                  }
                  catch (e)
                  {
                      console.log("show the token data : "+accountData);
                      console.log("error message : "+e);
                      return;
                  }
                  
                  var fetHealthActList = mongoose.model('fetHealthActList');
                  fetHealthActList.findOneAndUpdate({account: accountData.account}, accountData, 
                     {"new":true, "upsert":true, "returnNewDocument":true, "passRawResult": true}, 
                     function (err, results) {
                        if (err)
                        {
                            console.log("FET account db find data error : "+err);
                        }

                        console.log('trace account id = ', results.account, ' , token = ', results.token, 'updated');
                        res.send('{"status": 200, "message": "password of '+results.account+' was updated.", "Token": "'+results.token+'"}');
                        res.end;
                      }
                  );
              });
          });
          // post the data
          post_req.write(contentStr);
          post_req.end();
      }
  });
});

/**
 * post method for add Token.
 */
router.post('/getAccountToken', function(req, res)
{
  console.log("Get Account Token");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  var stbno = decodeURIComponent(req.body.stbno);
  var soid = decodeURIComponent(req.body.soid);
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.findOne({account: accountid},
  function(err, accountSet){
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      console.error('accountSet = '+accountSet);
      if ((accountSet === null) || (accountSet == '') || (accountSet === undefined))
      {
          res.status(404).send('{"status": 404, "Account ID": "'+accountid+'" is not found.}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);
          //console.log("acount Set data - soid = "+accountSet.soid);
          console.log("acount Set data - stbno = "+accountSet.stbLists.length);
          var is_stb_exist = false;
          
          for (var i=0;i<accountSet.stbLists.length;i++)
          {
              if ((stbno == accountSet.stbLists[i].stbno) && (soid == accountSet.stbLists[i].soid))
              {
                  is_stb_exist = true;
                  break;
                  
              }
          }
          
          if (is_stb_exist === true)
          {
              res.send('{"status": 200, "token": "'+accountSet.token+'"}');
              res.end;
          }
          else
          {
              res.status(400).send('{"status": 400, "Account ID": "'+accountSet.account+'" can not find this stb id.}');
              res.end;
          }
      }
  });
});

/**
 * post method for get stb account list.
 */
router.post('/getSTBAccountList', function(req, res)
{
  console.log("Get stb account list");

  var stbno = decodeURIComponent(req.body.stbno);
  var soid = decodeURIComponent(req.body.soid);
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.find({ "stbLists": {$elemMatch:{ stbno: stbno, soid: soid } } },
  function(err, accountSet){
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      //console.error('accountSet = '+accountSet);
      if ((accountSet === null) || (accountSet == '') || (accountSet === undefined))
      {
          res.status(404).send('{"status": 404, "message":"stb account list is not found."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.length);

          if (accountSet.length > 0)
          {
              var stb_account_lists = new Array();
              var stb_account_info = null;
              var stb_list = new Object();
              for (var i=0;i<accountSet.length;i++)
              {
                  stb_account_info = {
                      account: accountSet[i].account,
                      nickname: accountSet[i].nickname,
                      token: accountSet[i].token,
                      isNeedChangePassword: accountSet[i].isNeedChangePWD
                  };
                  stb_account_lists.push(stb_account_info);
              }
              stb_list.status = 200;
              stb_list.accountList = stb_account_lists;
              res.send(JSON.stringify(stb_list));
              res.end;
          }
          else
          {
              res.status(404).send('{"status": 404, "message":"stb account list is not found."}');
              res.end;
          }
      }
  });
});

/**
 * post method for delete stb account list.
 */
router.post('/deleteSTBAccountList', function(req, res)
{
  console.log("Get stb account list");
  console.log("account = "+decodeURIComponent(req.body.stbno));
  var stbno = decodeURIComponent(req.body.stbno);
  var soid = decodeURIComponent(req.body.soid);
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.find({ "stbLists": {$elemMatch:{ stbno: stbno, soid: soid } } },
  function(err, accountSet){
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      //console.error('accountSet = '+accountSet);
      if ((accountSet === null) || (accountSet == '') || (accountSet === undefined))
      {
          res.send('{"status": 200, "message": "stb account list is not found."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.length);

          if (accountSet.length > 0)
          {
              for (var i=0;i<accountSet.length;i++)
              {
                  if (accountSet[i].stbLists.length > 1)
                  {
                      fetHealthActList.findOneAndUpdate({account: accountSet[i].account},
                      {$pull:{stbLists:{stbno:accountSet[i].stbno, soid:accountSet[i].soid}}},
                      {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true},
                      function (err, results) {
                          if (err)
                          {
                              console.log("account id find data error : "+err);
                          }
                          else
                          {
                              console.log("account id "+accountSet[i].account+" delete stb already");
                          }
                      });
                  }
                  else
                  {
                      if (accountSet[i].stbLists.length == 1)
                      {
                          if ((accountSet[i].stbLists[0].stbno == stbno) && (accountSet[i].stbLists[0].soid == soid))
                          {
                              fetHealthActList.findOneAndRemove({account: accountSet[i].account},
                              function (err, results) {
                                  if (err)
                                  {
                                      console.log("stop id find data error : "+err);
                                  }
                                  
                                  console.log("final stb list delete results = "+results);
                              });
                          }
                      }
                      else if (accountSet[i].stbLists.length == 0)
                      {
                          fetHealthActList.findOneAndRemove({account: accountSet[i].account},
                          function (err, results) {
                              if (err)
                              {
                                  console.log("stop id find data error : "+err);
                              }
                              
                              console.log("zero stblist delete results = "+results);
                          });
                      }
                  }
              }
              res.send('{"status":200, "message": "'+stbno+' was deleted stb data."}');
              res.end();
          }
          else
          {
              res.send('{"status": 200, "message": "stb account list is not found."}');
              res.end;
          }
      }
  });
});

/**
 * post method for delete FET Account.
 */
router.post('/deleteAccount', function(req, res)
{
  console.log("delete account");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.findOneAndRemove({account: accountid},
  function (err, results) {
      if (err)
      {
          console.log("stop id find data error : "+err);
      }
      
      console.log("delete results = "+results);
  });
  res.send('{"status":200, "account": "'+accountid+' was delete all."}');
  res.end();
});

/**
 * post method for delete FET Account.
 */
router.post('/deleteSTBData', function(req, res)
{
  console.log("delete account");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  var stbno = decodeURIComponent(req.body.stbno);
  var soid = decodeURIComponent(req.body.soid);
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.findOne({account: accountid},
  function (err, results) {
      if (err)
      {
          console.log("account id find data error : "+err);
          res.send('{"status":404, "account": "'+accountid+' was not found."}');
          res.end();
      }
      else
      {
          if (results.stbLists.length > 0)
          {
              fetHealthActList.findOneAndUpdate({account: accountid},
              {$pull:{stbLists:{stbno:stbno, soid:soid}}},
              {"new": true, "upsert":true, "returnNewDocument":true, "passRawResult": true},
              function (err, results) {
                  if (err)
                  {
                      console.log("account id find data error : "+err);
                      res.send('{"status":400, "account": "'+accountid+' was not found stb data."}');
                      res.end();
                  }
                  else
                  {
                      res.send('{"status":200, "account": "'+accountid+' was deleted stb data."}');
                      res.end();
                  }
              });
          }
          else
          {
              console.log("STB length of account id is zero : "+err);
              res.send('{"status":400, "account": "'+accountid+' was not found stb data."}');
              res.end();
          }
      }
  });
  
});


/**
 * post method for delete FET Account.
 */
router.post('/updateAccountName', function(req, res)
{
  console.log("delete account");
  console.log("account = "+decodeURIComponent(req.body.account));
  var accountid = decodeURIComponent(req.body.account);
  var name = decodeURIComponent(req.body.name);
  var cellphone = decodeURIComponent(req.body.cellphone);
  
  var fetHealthActList = mongoose.model('fetHealthActList');
  fetHealthActList.findOne({account: accountid},
  function(err, accountSet){
      if (err)
      {
          console.log("account id data error : "+err);
      }
      
      console.error('accountSet = '+accountSet);
      if ((accountSet === null) || (accountSet == '') || (accountSet === undefined))
      {
          res.status(404).send('{"status": 404, "Account ID": "'+accountid+' is not found."}');
          res.end;
      }
      else
      {
          console.log("acount Set data - account = "+accountSet.account);
          //console.log("acount Set data - soid = "+accountSet.soid);
          console.log("acount Set data - stbno = "+accountSet.stbLists.length);
          accountSet.nickname = name;
          accountSet.cellphone = cellphone;
          
          accountSet.save(function (err) {
              if(err)
              {
                  console.error('update account Data ERROR!');
                  res.status(400).send('{"status": 400, "message": "'+accountSet.account+'" can not update user name".}');
                  res.end;
              }
              else
              {
                  res.send('{"status": 200, "message": "'+accountSet.account+' update user name OK!"}');
                  res.end;
              }
              
              console.log('update account Data OK');
          });
      }
  });
});

module.exports = router;
