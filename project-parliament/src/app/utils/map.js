var mapSVG = d3.select("#map")
    .attr("height", map.height)
    .attr("width", map.width)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "500 -3825 " + map.width + " " + map.height);
var mapGroup = mapSVG.append("g")
    .attr("id", "wahlkreise");

var projection = d3.geoMercator()
    .scale(3500);

var path = d3.geoPath()
    .projection(projection);

var mapData = d3.json("../data/2021/test.topo.json");

mapGroup.selectAll("path")
    .data(topojson.feature(mapData, mapData.objects.map).features) //retrieve wahlkreise boundary data
    .enter().append("path")
    .attr("d", path);

