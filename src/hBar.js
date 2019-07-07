d3.hbar = function () {

    let properties = {
        "width":650,
        "height":500,
        "margin" : {              // Our marign object
            "top": 30,
            "bottom" : 30,
            "left" : 30,
            "right" : 30
        },
        "data":null,
        "step":0,
        "unit":'亿',
        "predata":null,
        "multiple":1,
        "color":"",
        'divisor':10,
        "config":null
    };
    let x,y,yAxis;
    let color,type;
    let xAxis,bars,labels,numLabels;
    let width,height;
    let format = function(d){
        return parseInt(d/properties.divisor)+properties.unit;
    };
    let duration=2000;
    function chart(g){
        g.attr("transform", "translate(" + properties.margin.left + "," + properties.margin.top + ")");
        width=properties.width-properties.margin.left-properties.margin.right;
        height=properties.height-properties.margin.bottom-properties.margin.top;
        color=properties.color;
        xAxis = g.append("g")
            .attr("class", "x axis")
            .attr("fill","#fff")

            .attr("transform", "translate(0," + 0 + ")");

        x = d3.scaleLinear().range([0, width]);
        y = d3.scaleBand().range([height, 0]);
        yAxis = d3.scaleBand().range([0, height]);
        bars = g.append("g").attr("id","bars");
        labels = g.append("g").attr("id","labels");
        numLabels = g.append("g").attr("id","numLabels");

        draw(properties.data,null);
    }


    function update() {
        draw(properties.data, properties.preData);
    }
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    const draw=function(data,preData){
        type=data.map(d=>d.group).filter(onlyUnique);
        data = data.map((d,i)=>{
                return {name:d.name,
                    value: Number(d.value),
                    preValue:preData?preData[i]?preData[i].value:0:0,
                    group:d.group
                }
            })
            .sort(function(a, b) { return b.value - a.value; })
            .filter(function (d) {
                return d.value>0;
            })
            .slice(0,10).reverse();
        let indexData=d3.range(data.length).sort((a,b)=>{return a-b});
        x.domain([0, d3.max(data, function(d) { return d.value; })]);
        y.domain(data.map(function(d) { return d.name; })).padding(0.3);
        yAxis.domain(indexData.map(function(d) { return d; })).padding(0.3);
        // console.log(data);
        xAxis
            .transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .call(d3.axisTop(x).ticks(4)
                .tickFormat(function(d) {
                    if(d==0) {
                        return properties.unit;
                    }else{
                        return parseInt(d/properties.divisor);
                    }
                    // return format(d);
                })
                .tickSizeInner([-height]));

        //坐标轴上绘制名称虽然方便但是却不利于进行动画绘制
        let labelsData = labels.selectAll("text")
            .data(indexData, function(d) { return d; });
        let barData = bars.selectAll("rect")
            .data(data, function(d) { return d ? d.name : this.id; });
        let numLabelsData = numLabels.selectAll("text")
            .data(data, function(d) { return d ? d.name : this.id; });
        // let yearData = year.select(".yearLabel");
        //enter
        barData.enter().append("rect")
        // .attr("class", "enter")
            .attr("class", "enter")
            .attr('y',height)
            .attr("width", 0)
            .style("fill-opacity", 1e-6)
            .style("fill",function (d) {
                return color(type.indexOf(d.group));

            })
            .transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .style("fill-opacity", 1)
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("y", function(d) { return y(d.name); })
            .attr("width", function(d) { return x(d.value); });
        //update
        barData.attr("class", "update").transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("y", function(d) { return y(d.name); })
            .attr("width", function(d) { return x(d.value); });
        //exit
        barData.exit()
            .attr("class", "exit")
            .transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .style("fill-opacity", 1e-6)
            .attr('y',height+20)
            .attr("width", function(d) { return x(d.value); })
            .remove();
        //--------------- 类别标签
        // if(step==0){
            labelsData.enter().append("text")
            // .attr("class", "enter")

                .style("fill-opacity", 1e-6)
                .attr("class","enter")
                // .style("font-size","20px")
                .attr("y",height)
                .attr('dx','-5')
                // .attr("dy",y.bandwidth()/2)
                .attr("text-anchor",'end')
                .text((d,i,data)=>{
                    // d.name
                    return 'No.'+(1 + i);
                })
                .transition()
                .ease(d3.easeLinear)

                .duration(properties.config.duration)
                .attr("dy",y.bandwidth()/2)
                .style("fill-opacity", 1)
                .attr("y", function(d) { return yAxis(d); });
        // }



        labelsData.attr("class", "update").transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .attr("dy",y.bandwidth()/2)
            .attr("y", function(d) { return yAxis(d); });


        labelsData.exit()
            .attr("class", "exit")
            .transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .style("fill-opacity", 1e-6)
            .attr('y',height+20)
            .remove();
        //--------------- 数字标签==>改为名称标签
        numLabelsData.enter().append("text")
            // .style("font-size","20px")
            .style("fill-opacity", 1e-6)
            // .attr("class", "enter")
            .attr("class","enter")
            .attr("y",height)
            .attr("x",0)
            .attr('dx',0)
            .attr("dy", y.bandwidth()/2)
            .attr("text-anchor",'start')
            .style("alignment-baseline",'central')
            .text(function (d) {
                return d.name;
            })
            .transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .style("fill-opacity", 1)
            .attr("x", function(d) {
                let size=this.getComputedTextLength();

                if(size>x(d.value)){
                    return x(d.value);
                }else{
                    return x(d.value)-size;
                }
            })
            .attr("y", function(d) { return y(d.name); });

            // .on("start", function (d) {
            //     d3.active(this)
            //         .tween("x", function() {
            //             let that = d3.select(this),
            //                 i = d3.interpolateNumber(d.preValue, d.value);
            //             return function(t) { that.text(format(i(t))); };
            //         });
            // });

        numLabelsData
            .attr("class", "update")
            .transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .attr("x", function(d) {
                let size=this.getComputedTextLength();
                if(size>x(d.value)){
                    return x(d.value);
                }else{
                    return x(d.value)-size;
                }
            })
            .attr("dy", y.bandwidth()/2)
            .attr("y", function(d) { return y(d.name); })
            .text(function (d) {
                return d.name;
            });
            // .on("start", function (d) {
            //     d3.active(this)
            //         .tween("text", function() {
            //
            //             let that = d3.select(this),
            //                 // i = d3.interpolateNumber(that.text().replace(/亿/g, ""), d.value);
            //                 i = d3.interpolateNumber(d.preValue, d.value);
            //             // console.log(d.preValue,)
            //             return function(t) { that.text(format(i(t))); };
            //         });
            // });

        numLabelsData.exit()
            .attr("class", "exit")
            .transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration)
            .style("fill-opacity", 1e-6)
            .attr('y',height+20)
            .attr("x", function(d) {
                let size=this.getComputedTextLength();
                if(size>x(d.value)){
                    return x(d.value);
                }else{
                    return x(d.value)-size;
                }
            })
            .text(function (d) {
                return d.name;
            })

            .remove();
    };

    chart.width = function(_) {
        if (!arguments.length) return properties.width;
        properties.width = _;
        return chart;
    };
    chart.height = function(_) {
        if (!arguments.length) return properties.height;
        properties.height = _;
        return chart;
    };
    chart.margin = function(_) {
        if (!arguments.length) return properties.margin;
        properties.margin = _;
        return chart;
    };
    chart.data = function(_) {
        if (!arguments.length) return properties.data;
        properties.data = _;
        return chart;
    };
    chart.divisor = function(_) {
        if (!arguments.length) return properties.divisor;
        properties.divisor = _;
        return chart;
    };
    chart.step = function(_) {
        if (!arguments.length) return properties.step;
        properties.step = _;
        return chart;
    };
    chart.unit = function(_) {
        if (!arguments.length) return properties.unit;
        properties.unit = _;
        return chart;
    };
    chart.multiple = function(_) {
        if (!arguments.length) return properties.multiple;
        properties.multiple = _;
        return chart;
    };
    chart.preData = function(_) {
        if (!arguments.length) return properties.preData;
        properties.preData = _;
        return chart;
    };
    chart.color = function(_) {
        if (!arguments.length) return properties.color;
        properties.color = _;
        return chart;
    };
    chart.config = function(_) {
        if (!arguments.length) return properties.config;
        properties.config = _;
        return chart;
    };
    chart.update=function(){
        update();
    };

    return chart;

};

