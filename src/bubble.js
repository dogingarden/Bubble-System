
d3.bubble = function () {

    let scale=d3
        .scalePow().exponent(0.5)
        // .scaleLinear()
        .range([0,60]);
    let sizeDivisor = 100, nodePadding = 2.5;
    let color;

    // The largest node for each cluster.
    let clusters = new Array(5);
    let type;
    //nodes 为数据
    //node 为节点，容器
    let nodes,node;
    let sPosition=[];
    /*
    maxR 最大半径
    unit 显示单位
    color 计算颜色的方法
    divisor 除数
    minR 最小半径
    minValueR 最小的显示数值的半径
    maxValue 最大值
    ifShowImg 是否在气泡图上显示图片
    */
    let properties = {
        "width":1270,
        "height":1000,
        "margin" : {              // Our marign object
            "top": 30,
            "bottom" : 30,
            "left" : 30,
            "right" : 30
        },
        "data":null,
        "step":0,
        "maxR": 100,
        "unit":'',
        'color':"",
        "divisor":1,
        "minR":4,
        "minValueR":14,
        "maxValue":1,
        "config":null,
        "ifShowImg":false
    };
    let svg,width,height;

    function chart(container){
        color=properties.color;
        width=properties.width;
        height=properties.height;
        svg = container
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        scale.range([0,properties.maxR]);
        packData(0,properties.data);
        initializeSimulation();
        initializeDisplay();
        //判断是否需要添加图片
        if(properties.ifShowImg==true){
            initImgLabels(container);
        }

        //用来计算每个节点文字的长度
        d3.select("svg")
            .append("text")
            .attr("id","textTemp")
            .attr("fill-opacity",0)
            .attr("x", 10)
            .attr("y", 30);
    }
    function initImgLabels(container) {
        let imgLabels=container.append("g").attr("id","imgLabels");
        imgLabels.selectAll("pattern")
            .data(properties.data, function (d) {
                return d ? d.name : this.id;
            })
            .enter()
            .append("pattern")
            .attr("id",function(d){
                return d.name;
            })
            .attr("x","0%")
            .attr("y","0%")
            .attr("width","100%")
            .attr("height","100%")
            .attr("viewBox","0 0 512 512")
            .append("image")
            .attr("x","0")
            .attr("y","0")
            .attr("width","512")
            .attr("height","512")
            .attr("xlink:href",function(d){
                return "./img/"+d.name+".jpg";
            });
    }
    function updateImgLabels(){
        svg.select("#imgLabels")
            .selectAll("pattern")
            .data(properties.data, function (d) {
                return d ? d.name : this.id;
            })
            .enter()
            .append("pattern")
            .attr("id",function(d){
                return d.name;
            })
            .attr("x","0%")
            .attr("y","0%")
            .attr("width","100%")
            .attr("height","100%")
            .attr("viewBox","0 0 512 512")
            .append("image")
            .attr("x","0")
            .attr("y","0")
            .attr("width","512")
            .attr("height","512")
            .attr("xlink:href",function(d){
                return "./img/"+d.name+".jpg";
            });
    }
    function update() {
        packData(properties.step,properties.data);
        //判断是否需要添加图片
        if(properties.ifShowImg==true){
            updateImgLabels();
        }
        updateForces();
        updateDisplay();
    }


    function packData(index,data) {
        type=data.map(d=>d.group).filter(onlyUnique);
        scale.domain([0,d3.max(data,function (d) {return +d.value;})]);
        //过滤出所有上一次出现，但是这一次没有出现，并且其大小不是为0的节点。
        let preNodes=[];
        if(nodes){
            preNodes=nodes
                .filter(d=>{
                    //把所有当前没有，之前有的节点筛选出来
                    return data.filter(newD=>{
                            return d.name===newD.name;
                        }).length === 0;
                })
            ;
            preNodes=preNodes.map(makeExitData);
        }
        nodes=data.map(makeData);
        //连接之前的要退出的数组，防止出现抖动
        nodes=nodes.concat(preNodes);

        clusters=[];
        nodes.forEach(function (d, i) {
            let mm=type.indexOf(d.group);
            let ii=Math.floor(Math.random()*type.indexOf(d.group));

            let names=sPosition.map(function (s) {
                return s.name;
            });
            if(names.indexOf(d.name)<0){
                d.x = Math.cos(ii / mm * 2 * Math.PI) * 200 + width / 2 + Math.random();
                d.y = Math.cos(ii / mm * 2 * Math.PI) * 200 + height / 2 + Math.random();
            }
            let
                r = d.radius;
            if (!clusters[type.indexOf(d.group)] || (r > clusters[type.indexOf(d.group)].radius)) {
                clusters[type.indexOf(d.group)] = d;
            }
        });
    }
    function makeExitData(d) {
        d.value=0;
        d.value = +d.value;
        d.size = +d.value / sizeDivisor;
        d.size < 3 ? d.radius = 3 : d.radius = d.size;
        d.radius=scale(d.value);

        let names=sPosition.map(function (s) {
            return s.name;
        });
        if(names.indexOf(d.name)<0){
            sPosition.push({name:d.name,sx:0,sy:0,radius:d.radius,step:properties.step,value:d.value});
            d.x= 0;
            d.y= 0;
            d.oldR=1e-6;
            d.oldValue=1e-6;
            d.newR=d.radius;
            d.newValue=d.value;
            d.radius=0;//设置为0
        }else{
            let s=sPosition.filter(s=>{return s.name===d.name})[0];
            d.x=s.x;
            d.y=s.y;
            if(s.step===properties.step-1){
                d.oldR=s.radius;
                d.oldValue=s.value;
            }
            else{
                d.oldR=1e-6;
                d.oldValue=1e-6;
            }
            d.newValue=d.value;
            d.newR=d.radius;
            s.radius=d.radius;
            s.step=properties.step;
            s.value=d.value;
        }
        return d;
    }
    function makeData(d){
        d.value = +d.value;
        d.size = +d.value / sizeDivisor;
        d.size < 3 ? d.radius = 3 : d.radius = d.size;
        d.radius=scale(d.value);

        let names=sPosition.map(function (s) {
            return s.name;
        });
        if(names.indexOf(d.name)<0){
            sPosition.push({name:d.name,sx:0,sy:0,radius:d.radius,step:properties.step,value:d.value});
            d.x= 0;
            d.y= 0;
            d.oldR=1e-6;
            d.oldValue=1e-6;
            d.newR=d.radius;
            d.newValue=d.value;
            d.radius=0;//设置为0，慢慢增大，防止出现抖动
        }else{
            let s=sPosition.filter(s=>{return s.name===d.name})[0];
            d.x=s.x;
            d.y=s.y;
            if(s.step===properties.step-1){
                d.oldR=s.radius;
                d.oldValue=s.value;
            }
            else{
                d.oldR=1e-6;
                d.oldValue=1e-6;
            }
            d.newValue=d.value;
            d.newR=d.radius;
            s.radius=d.radius;
            s.step=properties.step;
            s.value=d.value;
        }
        return d;
    }
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    //力模拟
    let forceProperties = {
        center: {
            x: 0,
            y: 0
        },
        charge: {
            enabled: true,
            strength: -35,
            distanceMin: 1,
            distanceMax: 2000
        },
        collide: {
            enabled: true,
            strength: 0.8,
            iterations: 1,
            radius: 5
        },
        forceX: {
            enabled: true,
            strength: .07,
            x: 0
        },
        forceY: {
            enabled: true,
            strength: .07,
            y: 0
        },
        link: {
            enabled: true,
            distance: 30,
            iterations: 1
        }
    };
    // force simulator
    let simulation = d3.forceSimulation();
    // set up the simulation and event to update locations after each tick
    function initializeSimulation() {
        simulation.nodes(nodes);
        initializeForces();
        simulation.on("tick", ticked);
    }
    // add forces to the simulation
    function initializeForces() {
        // add forces and associate each with a name
        simulation
            .force("link", d3.forceLink())
            .force("charge", d3.forceManyBody())
            .force("collide", d3.forceCollide())
            .force("center", d3.forceCenter())
            .force("forceX", d3.forceX())
            .force("forceY", d3.forceY());
        // apply properties to each of the forces
        initForces();
    }

    // apply new force properties
    function initForces() {
        forceProperties.charge.strength=-10;
        simulation
            .force("cluster", forceCluster);
        // get each force by name and update the properties
        simulation.force("center")
            .x(width * forceProperties.center.x)
            .y(height * forceProperties.center.y);
        simulation.force("charge")
            .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
            .distanceMin(forceProperties.charge.distanceMin)
            .distanceMax(forceProperties.charge.distanceMax);
        simulation.force("collide")
            .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
            .radius(function(d){ return d.radius + nodePadding; })
            .iterations(forceProperties.collide.iterations);
        simulation.force("forceX")
            .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
            .x(width * forceProperties.forceX.x);
        simulation.force("forceY")
            .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
            .y(height * forceProperties.forceY.y);


        // updates ignored until this is run
        // restarts the simulation (important if simulation has already slowed down)
        simulation.alpha(0.6).restart();
    }
    function updateForces(){
        simulation
            .force("cluster", realForceCluster);
        // get each force by name and update the properties
        simulation.force("center")
            .x(width * forceProperties.center.x)
            .y(height * forceProperties.center.y);
        simulation.force("charge")
            .strength(-1 * forceProperties.charge.enabled)
            .distanceMin(forceProperties.charge.distanceMin)
            .distanceMax(forceProperties.charge.distanceMax);
        simulation.force("collide")
            .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
            .radius(function(d){ return d.radius + nodePadding; })
            .iterations(forceProperties.collide.iterations);
        simulation.force("forceX")
            .strength(0.02)
            // .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
            .x(width * forceProperties.forceX.x);
        simulation.force("forceY")
            .strength(0.02)
            // .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
            .y(height * forceProperties.forceY.y);

        // updates ignored until this is run
        // restarts the simulation (important if simulation has already slowed down)
        simulation.alpha(0.05).restart();
    }





    function forceCluster(alpha) {
        for (let i = 0, n = nodes.length, node, cluster, k = alpha * 0.3; i < n; ++i) {
            node = nodes[i];
            cluster = clusters[type.indexOf(node.group)];
            node.vx -= (node.x - cluster.x) * k;
            node.vy -= (node.y - cluster.y) * k;
        }
    }
    function realForceCluster(alpha) {
        for (let i = 0, n = nodes.length, node, cluster, k = alpha * 0; i < n; ++i) {
            node = nodes[i];
            cluster = clusters[type.indexOf(node.group)];
            node.vx -= (node.x - cluster.x) * k;
            node.vy -= (node.y - cluster.y) * k;
        }
    }
    //展示模块

    // generate the svg objects and force simulation
    function initializeDisplay() {

        // set the data and properties of node circles
        node = svg.append("g")
            .attr("class", "nodes")
            .selectAll(".circle")
            .data(nodes, function(d) { return d.name; })
            .enter().append("g")
            .attr("class","circle")
            .attr("id",function (d) {
                return "init-"+d.name;
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );
        // visualize the graph
        initDisplay();
    }

    // update the display based on the forces (but not positions)
    function initDisplay() {
        let t = d3.transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration);
        node
            .append("circle")
            .style("fill", function (d) {
                if(properties.ifShowImg===false) {
                    return color(type.indexOf(d.group));
                }
                else{
                    return "url(#"+d.name+")";
                }
            })
            .transition(t)
            .attr("r", function (d) {
                return d.radius;
            })
            ;
        node.filter(d=>{return d.newR>properties.minR})
            .append("text")
            .attr("id","name")
            .transition(t)
            .attr("dy", "0em")
            .style('fill', 'black')
            .style("text-anchor", "middle")
            .text(function(d)
            {
				if(properties.config.ifShowName){
					return d.name;
				}
            })
            .tween('font-size', function(d)
            {
                let that = d3.select(this);
                let fontSize=that.style('font-size');
                let textLength=that.node().getComputedTextLength() * fontSize.slice(0,fontSize.length-2)*0.8;
                let oldS=(2 * d.oldR ) / fontSize;
                let newS=(2 * d.newR ) / fontSize;
                if(d.name.length==1){
                    oldS=oldS/2;
                    newS=newS/2;
                }
                let i = d3.interpolate(oldS, newS);
                return function(t)
                {
                    d.fontSize = i(t);
                    that.style('font-size', function(d)
                    {
                        return d.fontSize+"px";
                    });
                }
            });
        //数值背景
        node.filter(d=>{return d.newR>properties.minValueR})
            .append("text")
            .attr("stroke","white")
            .attr("stroke-width",'0.2em')
            .attr("id",d=>"value"+d.name)
            .attr("alignment-baseline", "central")
            .style('fill', 'white')
            .style("text-anchor", "middle")
            .attr("dy",function(d){
                return 0.4*d.newR+"px";
            });

        node.filter(d=>{return d.newR>properties.minValueR})
            .append("text")
            .attr("id","value")
            .transition(t)
            .attr("alignment-baseline", "central")
            .style('fill', 'black')
            .style("text-anchor", "middle")
            .tween("text", function(d) {
                let that = d3.select(this),
                    i = d3.interpolateNumber(Number(d.oldValue), Number(d.newValue));
                return function(t) {
                    let text=Number(i(t)/properties.divisor).toFixed(0)+properties.unit
                    that.text(text);
                    node.select("#value"+d.name).text(text);
                };
            })
            .tween('font-size', function(d){
                let that = d3.select(this);
                let lengthText=d3.select("#textTemp");
                lengthText.text(Number(d.oldValue));
                let old_font_size=lengthText.node().getComputedTextLength();
                lengthText.text(Number(d.newValue));
                let new_font_size=lengthText.node().getComputedTextLength();
                let oldS=(2 * d.oldR ) / old_font_size * 24*0.15;
                let newS=(2 * d.newR ) / new_font_size * 24*0.15;
                let i = d3.interpolate(oldS, newS);
                return function(t){
                    d.fontSize = i(t);
                    that.style('font-size', function(d){
                            return d.fontSize+"px";
                        });
                    node.select("#value"+d.name)
                        .style('font-size', function(d){
                            return d.fontSize+"px";
                        });
                }
            })
            .attr("dy",function(d){
                return 0.4*d.newR+"px";
            })

    }
    //update
    function updateDisplay() {
        // transition
        let t = d3.transition()
            .ease(d3.easeLinear)
            .duration(properties.config.duration);

        node = svg.select(".nodes")
            .selectAll(".circle")
            .data(nodes, function(d) { return d.name; });
        //exit
        node.exit().select("circle")
            .transition(t)
            .attr("r", 0)
            .remove();

        node.exit().select("#name")
            .transition(t)
            .style("font-size", 0)
            .remove();

        node.exit()
            .select(d=>"#value"+d.name)
            .transition(t)
            .style("font-size", 0)
            .remove();

        node.exit().select("#value")
            .transition(t)
            .tween("text", function(d) {
                let that = d3.select(this),
                    i = d3.interpolateNumber(Number(d.oldValue), 0);
                return function(t) {
                    let text=Number(i(t)/properties.divisor).toFixed(0) + properties.unit
                    that.text(text);
                    //数值背景   
                    name.select("#value"+d.name).text(text);
                };
            })
            .attr("dy",0)
            .style("font-size", 0)
            .remove();
        //数值背景    
        node.exit().select(d=>"#value"+d.name)
            .transition(t)
            .attr("dy",0)
            .style("font-size", 0)
            .remove();

        node.exit()
            .transition(t)
            .attr("r", 0)
            .remove();

        //原先的node没有text，更新后应该加上的
        let sholdUpdateCircle=node.filter(d=>{return (d.oldR<properties.minR && d.newR>properties.minR)});
        //add name
        sholdUpdateCircle.append("text")
            .attr("dy", "0em")
            .attr("id", "name")
            .style('fill', 'black')
            .style("text-anchor", "middle")
            .text(function(d)
            {
                if(properties.config.ifShowName){
					return d.name;
				}
            });
        let sholdUpdateValue=node.filter(d=>{return (d.oldR<properties.minValueR && d.newR>properties.minValueR)});
        sholdUpdateValue
            .append("text")
            .attr("dy", "0em")
            .attr("id", "value")
            .attr("alignment-baseline", "central")
            .style('fill', 'black')
            .style("text-anchor", "middle");
        //add value background
        sholdUpdateValue
            .append("text")
            .attr("dy", "0em")
            .attr("id", d=>"value"+d.name)
            .attr("alignment-baseline", "central")
            .style('fill', 'white')
            .attr("stroke","white")
            .attr("stroke-width","0.2em")
            .style("text-anchor", "middle");

        let nodeEnter=node.enter()
            .append("g")
            .attr("class","circle")
            .attr("id",function (d) {
                return "newEnter-"+d.name;
            });

        nodeEnter.append("circle")
            .transition(t)
            .attr("r", function (d) {
                return d.newR;
            })
            .style("fill", function (d) {
                if(properties.ifShowImg===false) {
                    return color(type.indexOf(d.group));
                }
                else{
                    return "url(#"+d.name+")";
                }
            });
        
        nodeEnter
            .filter(d=>{return (d.newR>properties.minR && d.oldR<properties.minR)})
            .append("text")
            .attr("dy", "0em")
            .attr("id", "name")
            .style('fill', 'black')
            .style("text-anchor", "middle")
            .text(function(d)
            {
                if(properties.config.ifShowName){
					return d.name;
				}
            });
        //add value background
        nodeEnter.filter(d=>{return (d.newR>properties.minValueR && d.oldR<properties.minValueR)})
            .append("text")
            .attr("id", d=>"value"+d.name)
            .attr("stroke","white")
            .attr("stroke-width","0.2em")
            .attr("alignment-baseline", "central")
            .style('fill', 'black')
            .style("text-anchor", "middle")
            .attr("dy",function(d) {
                return 0.4 * d.newR+"px";
            });

        nodeEnter.filter(d=>{return (d.newR>properties.minValueR && d.oldR<properties.minValueR)})
            .append("text")
            .attr("id", "value")
            .attr("alignment-baseline", "central")
            .style('fill', 'black')
            .style("text-anchor", "middle")
            .attr("dy",function(d) {
                return 0.4 * d.newR+"px";
            });
        //合并enter and update
        node=node
            .merge(nodeEnter);
        // Apply the general update pattern to the nodes.
        node.select("#name")
            .transition(t)
            .tween('radius', function(d)
            {
                let that = d3.select(this);
                let i = d3.interpolate(d.oldR, d.newR);
                return function(t)
                {
                    d.radius = i(t);
                    that.attr('r', function(d){
                        return d.radius;
                    });
                    //下面这句话必须写在这里，实时更新效果
                    simulation.nodes(nodes).alpha(properties.step>1?0.05:0.6);
                }
            })
            .tween('font-size', function(d)
            {
                let that = d3.select(this);
                let oldS=(2 * d.oldR) /
                    that.node().getComputedTextLength() *
                    that.style('font-size').slice(0,that.style('font-size').length-2)*0.8;
                let newS=(2 * d.newR) /
                    that.node().getComputedTextLength() *
                    that.style('font-size').slice(0,that.style('font-size').length-2)*0.8;
                if(d.name.length==1){
                    oldS=oldS/2;
                    newS=newS/2;
                }    
                let i = d3.interpolate(oldS, newS);
                return function(t)
                {
                    d.fontSize = i(t);
                    that.style('font-size', function(d){
                        return d.fontSize+"px";
                    });
                }
            })
            .on("end", function(d) {
                //结束之后将小于五的圆形的文字去掉
                if(d.newR<properties.minR){
                    d3.select(this).remove();
                }
            });
        
        node
            .select("#value")
            .attr("alignment-baseline", "central")
            .transition(t)
            .tween("text", function(d) {
                let that = d3.select(this),
                i = d3.interpolateNumber(Number(d.oldValue), Number(d.newValue));
                return function(t) {
                    let text=Number(i(t)/properties.divisor).toFixed(0)+properties.unit;
                    that.text(text);
                    node.select("#value"+d.name).text(text);
                };
            })
            .tween('font-size', function(d){
                let that = d3.select(this);
                let lengthText=d3.select("#textTemp");
                lengthText.text(Number(d.oldValue));
                let old_font_size=lengthText.node().getComputedTextLength();
                lengthText.text(Number(d.newValue));
                let new_font_size=lengthText.node().getComputedTextLength();
                let oldS=(2 * d.oldR ) / old_font_size * 24*0.15;
                let newS=(2 * d.newR ) / new_font_size * 24*0.15;
                let i = d3.interpolate(oldS, newS);
                return function(t){
                    d.fontSize = i(t);
                    // console.log(d.fontSize);
                    that.style('font-size', function(d){
                            return d.fontSize+"px";
                        });
                    node.select("#value"+d.name)
                        .style('font-size', function(d){
                            return d.fontSize+"px";
                        });
                }
            })
            .attrTween("dy",function(d){
                let oldS=0.4*d.oldR;
                let newS=0.4*d.newR;
                let i = d3.interpolate(oldS, newS);
                return function(t) {
                    node.select("#value"+d.name)
                        .attr("dy", function(d){
                            return i(t)+"px";
                        });
                    return i(t)+"px";
                }
            })
            .on("end", function(d) {
                //结束之后将小于五的圆形的文字去掉
                if(d.newR<properties.minValueR){
                    d3.select(this).remove();
                }
            });


        node.call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));


    }
    function dx(d) {
        let s=sPosition.filter(s=>{return s.name===d.name})[0];
        if(d.x<-width/2+d.radius) {
            d.x = -width/2+d.radius;
        }else if(d.x>width/2-d.radius){
            d.x = width/2-d.radius;

        }
        s.x=d.x;
        return d.x;
    }
    function dy(d) {
        let s=sPosition.filter(s=>{return s.name===d.name})[0];
        if(d.y<-height/2+d.radius) {
            d.y = -height/2+d.radius;
        }else if(d.y>height/2-d.radius){
            d.y = height/2-d.radius;
        }
        s.y=d.y;
        return d.y;
    }
    // update the display positions after each simulation tick
    function ticked() {
        if (node){
            node.attr('transform', function(d){
                    return "translate(" + dx(d) + "," + dy(d) + ")";
                }).select('circle').attr('r', function(d){
                    return d.radius;
                });
        }
    }

    //监听事件//

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0.0001);
        d.fx = null;
        d.fy = null;
    }


    chart.width = function(x) {
        if (!arguments.length) return properties.width;
        properties.width = x;
        return chart;
    };
    chart.height = function(x) {
        if (!arguments.length) return properties.height;
        properties.height = x;
        return chart;
    };
    chart.step = function(x) {
        if (!arguments.length) return properties.step;
        properties.step = x;
        return chart;
    };
    chart.margin = function(x) {
        if (!arguments.length) return properties.margin;
        properties.margin = x;
        return chart;
    };
    chart.data = function(x) {
        if (!arguments.length) return properties.data;
        properties.data = x;
        return chart;
    };
    chart.maxR = function(x) {
        if (!arguments.length) return properties.maxR;
        properties.maxR = x;
        return chart;
    };
    chart.color = function(_) {
        if (!arguments.length) return properties.color;
        properties.color = _;
        return chart;
    };
    chart.unit = function(_) {
        if (!arguments.length) return properties.unit;
        properties.unit = _;
        return chart;
    };
    chart.divisor = function(_) {
        if (!arguments.length) return properties.divisor;
        properties.divisor = _;
        return chart;
    };
    chart.maxValue = function(_) {
        if (!arguments.length) return properties.maxValue;
        properties.maxValue = _;
        return chart;
    };
    chart.ifShowImg = function(_) {
        if (!arguments.length) return properties.ifShowImg;
        properties.ifShowImg = _;
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

