var w = 1000;
var h = 1000;
var cycle = [12,22,30,40,54];

// SVG要素生成
var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("fill", "black");

// 日本地図データ読み込み
d3.json("./japan.json", function(json) {
    var japan = topojson.object(json, json.objects.japan).geometries;
 
    // 投影法設定
    var projection = d3.geo.mercator()
        .center([137, 34])
        .translate([w/2, h/2])
        .scale(1500);
 
    // 緯度経度⇒パスデータ変換設定
    var path = d3.geo.path()
        .projection(projection);
    // パスデータとして日本地図描画
    svg.selectAll("path")
        .data(japan)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .style("fill", "#2C2C43");

    svg.selectAll("circle")
        .data(japan)
        .enter()
        .append("circle")
        .transition()
        .delay(function(d, i) {
            return i * 300;
        })
        .duration(1000)
        .each("start", function() {
            d3.select(this)
            .attr({
                fill: "green",
                r: 0,
                cy: h
            })
        })
        .attr({
            r: 10,
            fill: "yellow",
            stroke: "orange"
        })
        .attr("stroke-width", 10)
        .each("end", function() {
            d3.select(this)
            .transition()
            .duration(800)
            .attr({
                fill: "ping",
                r: 0,
                cy: 10
            })
            .attr("transform", function(d) {
                var lat = d.properties.latitude;
                var lng = d.properties.longitude;
                return "translate(" + projection([lng, lat]) + ")";
            });
        });
});