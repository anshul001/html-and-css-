fs = require('fs');
var count = 0;
var result = [];
var header,hlen;
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('WDI_Data.csv')
});
lineReader.on('line',function(line){
  count++;
  if(count == 1){
    header = line.split(",");
    hlen = header.length;
  } else {

      var curLine = line.split(","); // line from the file
      if(curLine[0] == 'India' && curLine[2]=='GDP growth (annual %)'){
          for (var attr = 4; attr<hlen;attr++){
            var obj = {};
            obj["Year"] = header[attr];
              obj["Val"]=Number(curLine[attr]);
              result.push(obj);
          }

        }
      }
});
lineReader.on('close',function(){
  fs.writeFile('njsnIndia.json',JSON.stringify(result),function(err){
    if(err)
    console.log(err);
    else{
      console.log("Data is saved in json file");
    }
  });
});
