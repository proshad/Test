var express = require("express");
var fs = require('fs');
var sys = require('sys');
var app = express();
var path = require('path');

app.listen(80);
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);


app.post("/create_cv", function (request, res) {
  var jsonObj = {};
  var posLength = parseInt(request.query.posLength);
  var eduLength = parseInt(request.query.eduLength);
  var type = parseInt(request.query.type);

  var user = request.body.userName;
  jsonObj.name = user;
  var email = request.body.userEmail;
  jsonObj.email = email;
  var avatarUrl = request.body.avatar;
  jsonObj.avatarUrl = avatarUrl;
  var currentOrganization = request.body.currentOrganization;
  jsonObj.currentOrganization = currentOrganization;
  var location = request.body.location;
  jsonObj.location = location;
  var tags = request.body.tags;
  jsonObj.tags = tags;
  var shortDescription = request.body.description;
  jsonObj.shortDescription = shortDescription;
  var linkedinProfileUrl = request.body.linkedinProfileUrl;
  jsonObj.linkedinProfileUrl = linkedinProfileUrl;
  var mediaDescription = request.body.mediaDescription;
  jsonObj.mediaDescription = mediaDescription;
  var uploadUrl = request.body.mediaUploader;
  jsonObj.mediaURL = uploadUrl;


  // postion data
  var posJSONArr = [];
  for (var i = 1; i <= posLength; i++) {
    var posJSON = {};
    var companyName = request.body["companyName-" + i];
    posJSON.companyName = companyName;
    var companyPosition = request.body["companyPosition-" + i];
    posJSON.companyPosition = companyPosition;
    var posPeriodFromYear = request.body["posPeriodFromYear-" + i];
    posJSON.posPeriodFromYear = posPeriodFromYear;
    var posPeriodFromMonth = request.body["posPeriodFromMonth-" + i];
    posJSON.posPeriodFromMonth = posPeriodFromMonth;
    var posPeriodToMonth = request.body["posPeriodToMonth-" + i];
    posJSON.posPeriodToMonth = posPeriodToMonth;
    var posPeriodToYear = request.body["posPeriodToYear-" + i];
    posJSON.posPeriodToYear = posPeriodToYear;
    var companyLocation = request.body["companyLocation-" + i];
    posJSON.companyLocation = companyLocation;
    var companyDescription = request.body["companyDescription-" + i];
    posJSON.companyDescription = companyDescription;

    posJSONArr.push(posJSON);
  }
  jsonObj.position = posJSONArr;

  // education data
  var eduJSONArr = [];
  for (var i = 1; i <= eduLength; i++) {
    var eduJSON = {};
    var eduSchoolName = request.body["eduSchoolName-" + i];
    eduJSON.eduSchoolName = eduSchoolName;
    var eduDegree = request.body["eduDegree-" + i];
    eduJSON.eduDegree = eduDegree;
    var eduLocation = request.body["eduLocation-" + i];
    eduJSON.eduLocation = eduLocation;
    var eduPeriodFromMonth = request.body["eduPeriodFromMonth-" + i];
    eduJSON.eduPeriodFromMonth = eduPeriodFromMonth;
    var eduPeriodFromYear = request.body["eduPeriodFromYear-" + i];
    eduJSON.eduPeriodFromYear = eduPeriodFromYear;
    var eduPeriodToMonth = request.body["eduPeriodToMonth-" + i];
    eduJSON.eduPeriodToMonth = eduPeriodToMonth;
    var eduPeriodToYear = request.body["eduPeriodToYear-" + i];
    eduJSON.eduPeriodToYear = eduPeriodToYear;
    var eduDescription = request.body["eduDescription-" + i];
    eduJSON.eduDescription = eduDescription;

    eduJSONArr.push(eduJSON);
  }
  jsonObj.education = eduJSONArr;

  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var d = new Date();
  var publishDate = d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
  jsonObj.publishDate = publishDate;

  var jsonStr = JSON.stringify(jsonObj);

  var emailName = email.substring(0, email.indexOf("@"));
  var filePath = 'public/data/CV/' + emailName + '.json';
  if (type == 0) {// preview
    filePath = 'public/data/CV_Temp/' + emailName + '.json';
  }

  fs.writeFile(filePath, jsonStr, function (err) {
    if (err) throw err;
    console.log('Data has been saved!');
  });

//    res.writeHead(200, {'Content-Type': 'text/html'});
//    res.write('Thank you, data has been saved');
//    res.end();

  var redirectUrl = 'view-cv.html?user=' + emailName + "&type=" + type;
  res.redirect(redirectUrl);
});


app.post("/create_rnd", function (request, res) {
  var jsonObj = {};
  var length = parseInt(request.query.contactLength);

  var rndName = request.body.rndName;
  jsonObj.rndName = rndName;

  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var d = new Date();
  var publishDate = d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
  jsonObj.publishDate = publishDate;

  var linkToSite = request.body.linkToSite;
  jsonObj.linkToSite = linkToSite;

  var tags = request.body.tags;
  jsonObj.tags = tags;

  var shortDescription = request.body.shortDescription;
  jsonObj.shortDescription = shortDescription;

  var mediaDescription = request.body.mediaDescription;
  jsonObj.mediaDescription = mediaDescription;

  var uploadUrl = request.body.mediaUploader;
  jsonObj.mediaURL = uploadUrl;

  var mainDescription = request.body.mainDescription;
  jsonObj.mainDescription = mainDescription;


  var jsonStr = JSON.stringify(jsonObj);

  var files = fs.readdirSync('public/data/RnD/');

  fs.writeFile('public/data/RnD/rnd' + (files.length + 1) + '.json', jsonStr, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('Thank you, data has been saved');
  res.end();

});


app.get('/getCVList', function (req, res) {

  var files = fs.readdirSync('public/data/CV/');
  var count = files.length;
  var cvList = [];
  var total =0;
  for (var f in files) {
    var name = files[f];
    var file = __dirname + '/public/data/CV/' + name;

    fs.readFile(file, 'utf8', function (err, data) {
      total++;
      if (err) {
        console.log('Error: ' + err);
        return;
      }
      var jsonObj = {};
      var jsonData = JSON.parse(data);


      jsonObj.name = jsonData.name;
      jsonObj.avatar = jsonData.avatarUrl;
      var email = jsonData.email;
      var emailName = email.substring(0, email.indexOf("@"));
      jsonObj.url = "view-cv.html?user=" + emailName + "&type=1";    //type=1 means published
      jsonObj.location = jsonData.location;
      jsonObj.date = jsonData.publishDate;

      var jsonPosArr = jsonData.position;
      var companyArr = [];
      for (var i = 0; i < jsonPosArr.length; i++) {
        var obj = jsonPosArr[i];
        companyArr.push(obj.companyName);
      }

      jsonObj.companies = companyArr;

      var jsonEduArr = jsonData.education;
      var eduArr = [];
      for (var i = 0; i < jsonEduArr.length; i++) {
        var obj = jsonEduArr[i];
        eduArr.push(obj.eduSchoolName);
      }
      jsonObj.schools = eduArr;

      cvList.push(jsonObj);

      if(total==count){
        var jsonStr = JSON.stringify(cvList);
        fs.writeFile('public/data/cvlist.json', jsonStr, function (err) {
          if (err) throw err;
          console.log('Data has been saved!');
        });
        res.redirect("data/cvlist.json");
      }

    });

  }



});


