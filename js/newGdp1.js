fs = require('fs');
var count = 0;
var result = [];
var fresult = [];
var header,hlen;
var country=[];
var flag = 0;
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('WDI_Data.csv')
});
var data = fs.readFileSync('continent.csv');
var cLine = data.toString().split("\n");
for(var i =0;i<cLine.length-1;i++){
  contLine = cLine[i].split(",");
  country[i] = contLine[0];
}
lineReader.on('line',function(line){
  count++;
  if(count == 1){
    header = line.split(",");
    hlen = header.length;
  } else {
      var obj = {};
      var curLine = line.split(","); // line from the file
      if(curLine[2]=='GDP per capita (constant 2005 US$)'){
        for(var i =0;i<country.length;i++){
          if(curLine[0] == country[i]){
            flag = 1;
            break;
          }
        }
          if(flag == 1){
        obj[header[0]] = curLine[0];
        if(curLine[2] == 'GDP per capita (constant 2005 US$)' ){
          obj[curLine[2]] = Number(curLine[49]);
          obj["GNI per capita (constant 2005 US$)"] = 0;
          obj["total"] = obj["GNI per capita (constant 2005 US$)"] +   obj["GDP per capita (constant 2005 US$)"];
        }

        result.push(obj);

        }
      }
    }
});
lineReader.on('line',function(line){
  count++;
  if(count == 1){
    header = line.split(",");
    hlen = header.length;
  } else {
    var curLine = line.split(","); // line from the file
    if(curLine[2]=='GNI per capita (constant 2005 US$)'){
      for(var i =0;i<country.length;i++){
        if(curLine[0] == country[i]){
          flag = 1;
          break;
        }
      }
        if(flag == 1){
      for(i=0;i<result.length;i++){
        if(curLine[0] == result[i]["Country Name"]){
          result[i]["GNI per capita (constant 2005 US$)"] +=Number(curLine[49]);
          result[i]["total"] = result[i]["GNI per capita (constant 2005 US$)"]+result[i]["GDP per capita (constant 2005 US$)"];
        }

      }
  }
}
}
});



lineReader.on('close',function(){

  result.sort(function (a, b) {
    if (a.total > b.total) {
       return -1;
     }
     if (a.total < b.total) {
       return 1;
     }
    // a must be equal to b
    return 0;
  });
  for(var i=0;i<15;i++){
    fresult[i] = result[i];
  }
  fs.writeFile('njsn.csv',JSON.stringify(fresult),function(err){
    if(err)
    console.log(err);
    else{
      console.log("Data is saved in json file");
    }
  });
});
