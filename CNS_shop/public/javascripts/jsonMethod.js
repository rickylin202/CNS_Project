var connectIP = "http://172.17.128.6:3005";
//var connectIP = "http://192.168.0.10:3005";

/*function getJsonData(scriptUrl, params, callback, isFresh, failcallback)
{
    var xmlHttp = new XMLHttpRequest();
    var jsonData;
    var timeout = false;
    var timeOutTimer = setTimeout(function(){
        timeout = true;
        xmlHttp.abort();
        document.getElementById("loading").style.display = "none"
        document.getElementById("networkError").style.display = "block";
    }, 20000);
    alert("params => "+params);

    try
    {
        document.getElementById("loading").style.display = "block";
        document.getElementById("searchError").style.display = "none";
        document.getElementById("networkError").style.display = "none";
        alert("scriptUrl = "+scriptUrl);
        alert("isFresh = "+isFresh);
        xmlHttp.open("POST", scriptUrl, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xmlHttp.onreadystatechange = function(APIName) {
            if(timeout === true) return;
            
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                clearTimeout(timeOutTimer);
                alert("scriptUrl = "+scriptUrl);
                var str = xmlHttp.responseText;
                alert("response Text =============== "+str);
                jsonData = JSON.parse(str);
                document.getElementById("loading").style.display = "none";
                //alert("isFresh = "+isFresh);
                if (isFresh == null)
                {
                    callback(jsonData);
                }
                else
                {
                    callback(jsonData, isFresh);
                }
                
            }
            else if (xmlHttp.readyState == 4 && xmlHttp.status == 404)
            {
                document.getElementById("loading").style.display = "none";
                document.getElementById("searchError").style.display = "block";
                clearTimeout(timeOutTimer);
                
                if (failcallback != null)
                {
                    failcallback(scriptUrl, params, callback, isFresh);
                }
            }
            else if (xmlHttp.readyState == 4 && xmlHttp.status == 500)
            {
                document.getElementById("loading").style.display = "none";
                document.getElementById("busListFull").style.display = "block";
                clearTimeout(timeOutTimer);
            }
            alert("xmlHttp.readyState = "+xmlHttp.readyState);
            alert("xmlHttp.status = "+xmlHttp.status);
        }
        xmlHttp.send(params);
    }
    catch(exception)
    {
        alert("xmlHttp Fail");
        document.getElementById("loading").style.display = "none"
        document.getElementById("networkError").style.display = "block";
        if (failcallback != null)
        {
            failcallback(scriptUrl, params, callback, isFresh);
        }
    }
}*/

function showTime()
{
    var now = new Date();
    var month = now.getMonth()+1;
    var date = now.getDate();
    var day = "";
    switch (now.getDay())
    {
        case 0:
          day = "日";
          break;
        case 1:
          day = "一";
          break;
        case 2:
          day = "二";
          break;
        case 3:
          day = "三";
          break;
        case 4:
          day = "四";
          break;
        case 5:
          day = "五";
          break;
        case 6:
          day = "六";
          break;
    }
    
    var hour = (now.getHours() > 9) ? now.getHours() : "0"+now.getHours();
    var min = (now.getMinutes() > 9) ? now.getMinutes() : "0"+now.getMinutes();
    
    var timeStr = month + "/" + date + " (" + day + ") " + hour + ":" + min;
    document.getElementById("nowDate").innerText = timeStr;
    setTimeout("showTime()", (60-now.getSeconds)*1000);
}

function getAppUrl(appName)
{
    var appinfo = toi.downloadableAppManageService.getAppInfoByName(appName);
    var appURL = toi.downloadableAppManageService.getAppLaunchPath(appinfo.appId);
    alert("getAppUrl = " + appURL);
    return appURL;
}