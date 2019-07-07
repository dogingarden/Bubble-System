d3.desc = function () {

    let properties = {
        "width": 650,
        "height": 500,
        "margin": {
            "top": 30,
            "bottom": 30,
            "left": 30,
            "right": 30
        },
        "data": null,
        "step": 0,
        "unit": '',
        "predata": null,
        "multiple": 1,
        "descText": "",
        "config": null
    };
    let g;
    let imageName = '';
    function chart(svg) {
        g = svg.append("g");
        let showData = properties.data.data.sort((a, b) => { return -a.value + b.value });
        imageName = showData[0].name;
        g.append("image")
            .attr("transform", "translate(750,0)")
            .attr("href", "./img/" + imageName + ".jpg")
            .attr("width", 450)
            .attr("height", 250)
            .transition()
            .duration(properties.config.duration * 0.2)
            .attr("transform", "translate(100,0)")
            ;
        //一般为第一的名字
        g.append("text")
            .attr("id", "name")
            .attr("transform", `translate(950,250)`)
            // .attr('dx', )
            .attr('dy', "1em")
            .attr("alignment-baseline", "hanging")
            .attr("text-anchor", "middle")
            .attr("font-size", "34px")
            .attr("fill", "black")
            .text(properties.config.descTitle + imageName)
            .transition()
            .duration(properties.config.duration * 0.2)
            .attr("transform", `translate(325,270)`);
        //本次时间段的描述
        g.append("text")
            .attr("id", "desc")
            .attr("transform", `translate(950,250)`)
            // .attr('dx', )
            .attr('dy', "2.4em")
            .attr("alignment-baseline", "hanging")
            .attr("text-anchor", "middle")
            .attr("font-size", "24px")
            .attr("fill", "black")
            .text(function () {
                return properties.descText;
            })
            .transition()
            .duration(properties.config.duration * 0.2)
            .attr("transform", `translate(325,270)`);
    }

    function update() {
        let showData = properties.data.data.sort((a, b) => { return -a.value + b.value });

        if (imageName === showData[0].name) {
            g.select("#name")
                .transition()
                .duration(properties.config.duration * 0.2)
                .text(properties.config.descTitle + imageName);
            g.select("#desc")
                .transition()
                .duration(properties.config.duration * 0.2)
                .text(function () {
                    return properties.descText;
                })

        } else {
            //修改
            imageName = showData[0].name;
            g.select("image")
                .transition()
                .duration(properties.config.duration * 0.2)
                .attr("transform", "translate(750,0)")
                .on("end", function () {
                    d3.select(this)
                        .attr("href", "./img/" + imageName + ".jpg")
                        .transition()
                        .duration(properties.config.duration * 0.2)
                        .delay(100)
                        .attr("transform", "translate(100,0)");
                });
            g.select("#name")
                .transition()
                .duration(properties.config.duration * 0.2)
                .attr("transform", `translate(950,300)`)
                .on("end", function () {
                    d3.select(this)
                        .text(properties.config.descTitle + imageName)
                        .transition()
                        .duration(properties.config.duration * 0.2)
                        .delay(100)
                        .attr("transform", `translate(325,270)`);
                });
            g.select("#desc")
                .transition()
                .duration(properties.config.duration * 0.2)
                .attr("transform", `translate(950,300)`)
                .on("end", function () {
                    d3.select(this)
                        .text(function () {
                            return properties.descText;
                        })
                        .transition()
                        .duration(properties.config.duration * 0.2)
                        .delay(100)
                        .attr("transform", `translate(325,270)`);
                });
        }
    }

    chart.width = function (x) {
        if (!arguments.length) return properties.width;
        properties.width = x;
        return chart;
    };
    chart.height = function (x) {
        if (!arguments.length) return properties.height;
        properties.height = x;
        return chart;
    };
    chart.margin = function (x) {
        if (!arguments.length) return properties.margin;
        properties.margin = x;
        return chart;
    };
    chart.data = function (x) {
        if (!arguments.length) return properties.data;
        properties.data = x;
        return chart;
    };
    chart.step = function (x) {
        if (!arguments.length) return properties.step;
        properties.step = x;
        return chart;
    };
    chart.unit = function (x) {
        if (!arguments.length) return properties.unit;
        properties.unit = x;
        return chart;
    };
    chart.multiple = function (x) {
        if (!arguments.length) return properties.multiple;
        properties.multiple = x;
        return chart;
    };
    chart.preData = function (x) {
        if (!arguments.length) return properties.preData;
        properties.preData = x;
        return chart;
    };
    chart.descText = function (x) {
        if (!arguments.length) return properties.descText;
        properties.descText = x;
        return chart;
    };
    chart.config = function (x) {
        if (!arguments.length) return properties.config;
        properties.config = x;
        return chart;
    };
    chart.update = function () {
        update();
    };

    return chart;

};