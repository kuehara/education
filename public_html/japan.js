var w = 1024;
var h = 800;
var cycle = [12,22,30,40,54];

// SVG要素生成
var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("fill", "black");

// ebis画像の表示
var imgList = ['ebis'];
var svgImgs = svg.selectAll()
                .data(imgList)
                .enter()
                .append('image')
                .attr({
                  'xlink:href': function (data) {
                    return 'img/' + data + '.png';
                  },
                  'width'     : 200,
                  'height'    : 300,
                  'x'         : 100
                });
                  
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

    var g = svg.selectAll("g")
        .data(japan)
        .enter()
        .append('g');
        
    g.append("circle")
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
                cy: h,
                cx: 0
            })
        })
        .attr({
            r: 3,
            fill: "yellow",
            stroke: "orange",
            cx: function(d) {
                var lat = d.properties.latitude;
                var lng = d.properties.longitude;
                return projection([lng, lat])[0];                
            },
            cy: function(d) {
                var lat = d.properties.latitude;
                var lng = d.properties.longitude;
                return projection([lng, lat])[1];                
            }
        })
        .attr("stroke-width", 10)
        .each("end", function() {
            d3.select(this)
            .transition()
            .duration(800)
            .attr({
                fill: "ping",
                r: 0,
                cy: function(d) {
                    return Math.random() * 20 + 80;
                },
                cx: function(d) {
                    return Math.random() * 60 + 180;
                }
            })
        });

        var line = d3.svg.line()
            .interpolate('basis')
            .x(function(d) {return d[0];})
            .y(function(d) {return d[1];});
            
        // 線要素定義
        /*
        var access_path = g.append('path')
            .attr({
              'd': function(d) {
                var lat = d.properties.latitude;
                var lng = d.properties.longitude;
                return "line(" + projection([lng, lat]) + ")";  
              },
              'stroke': 'lightgreen',
              'stroke-width': 5,
              'fill': 'none',
              'marker-end':"url(#arrowhead)",
            });
*/
});