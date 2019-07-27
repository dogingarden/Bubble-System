//加载数据
d3.queue(2)
    .defer(d3.csv ,"./data/data.csv")
    .defer(d3.json,"./data/config.json")
    .await(makeMyChart);

let margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 1920 - margin.left - margin.right,
    height = 1080 - margin.top - margin.bottom;

let step=0;
let allData=null;
let maxValue=0;
let color = d3.scaleOrdinal(d3.schemeAccent);
let config;

function makeMyChart(error, data, cfg) {

    if (error) throw error;
    data=packData(data);
    config=cfg;
    d3.select("#yearDiv")
        .append("svg")
        .attr("height",100)
        .attr("width",width)
        .append("g")
        .attr("id","year")
        .append("text")
        .attr("class","yearMarker")
        .attr("transform","translate("+width/2+",50)");

    maxValue=d3.max(data,function (d) {
        return d3.max(d.data,function (e) {
            return +e.value;
        })
    });
    allData=data;
    draw(data[step].data,null);
}

let draw=function(nowData,preData){
    
    d3.select("#year")
        .select("text")
        .transition()
        .duration(100)
        .text(allData[step].year);
    //update year
    d3.select("body")
        .transition()
        .duration(config.duration)
        .on("start", function (d) {
            if(step===0){
                //如果初始化时候，则初始化两个图
                initChart(nowData,preData);
            }else{
                updateChart(nowData,preData);
            }

        })
        .on("end", function(){
            step++;
            if(step < allData.length){
                draw(allData[step].data,allData[step-1].data);
            }
        });
};


//左下 - 添加气泡图
let hbar,bubble,desc;

let initChart=function(nowData,preData){

    hbar=d3.hbar()
        .height(600)
        .width(650)
        .step(step)
        .data(nowData)
        .color(color)
        .divisor(config.barDer)
        .unit(config.barLabel)
        .config(config)
        .preData(null)
        .margin({
            "top": 40,
            "bottom" : 40,
            "left" : 100,
            "right" : 100
        });

    bubble=d3.bubble()
        .width(1270-100)
        .height(1080-150)
        .step(step)
        .color(color)
        .maxValue(maxValue)
        .maxR(config.maxRadius)
        .data(nowData)
        .divisor(config.bubbleDer)
        .unit(config.bubbleLabel)
        .ifShowImg(config.ifShowImg)
        .config(config)
        .margin({
            "top": 50,
            "bottom" : 50,
            "left" : 50,
            "right" : 50
        });

    desc=d3.desc()
        .height(400)
        .width(650)
        .step(step)
        .descText((function () {
            if(allData[step].desc===undefined){
                return ""
            }else{
                return allData[step].desc;
            }
        })())
        .config(config)
        .data(allData[step])
        .margin({
            "top": 40,
            "bottom" : 40,
            "left" : 100,
            "right" : 100
        });

    d3.select("#hbarDiv")
        .append("svg")
        .attr("width",650)
        .attr("height",600)
        .append("g")
        .call(hbar);

    d3.select("#bubbleDiv")
        .append("svg")
        .attr("width",1270-100)
        .attr("height",1080-150)
        .attr("transform","translate(50,100)")
        .append("g")
        .call(bubble);

    d3.select("#imgDiv")
        .append("svg")
        .attr("width",650)
        .attr("height",400)
        .call(desc);

};
//更新表格
let updateChart=function(nowData,preData) {

    hbar.data(nowData)
        .preData(preData)
        .step(step)
        .update();

    bubble.data(nowData)
        .step(step)
        .update();

    desc.data(allData[step])
        .step(step)
        .descText((function () {
            if(allData[step].desc===undefined){
                return ""
            }else{
                return allData[step].desc;
            }
        })())
        .update();
};
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
function packData(data){
    let showData=[];
    let years=data.map(d=>d.date).filter(onlyUnique);
    console.log(years);
    years.forEach(y=>{
  
      let temp_arr={year:y,data:[]};
      let temp_data=data.filter(d=>d.date==y);
      temp_data.forEach(d=>{
        temp_arr.data.push({name:d.name,value:d.value,group:"jj"});
  
      })
      showData.push(temp_arr);
  
    });
    return showData;
}