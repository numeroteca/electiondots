var data = [
 {
   "label":"Abstenciones",
   "count":154,
   "colour":"#dddddd"
 },
 {
   "label":"PP",
   "count":42,
   "colour":"#397da0"
 },
 {
   "label":"PSOE",
   "count":59,
   "colour":"#cc2630"
 },
 {
   "label":"Podemos",
   "count":93,
   "colour":"#896897"
 },
 {
   "label":"Ciudadanos",
   "count":49,
   "colour":"#fcbb5c"
 },
 {
   "label":"ERC",
   "count":60,
   "colour":"#dc9700"
 },
 {
   "label":"DL",
   "count":57,
   "colour":"#002369"
 },
 {
   "label":"PNV",
   "count":null,
   "colour":"#7aae30"
 },
 {
   "label":"IU",
   "count":null,
   "colour":"#037b51"
 },
 {
   "label":"Bildu",
   "count":null,
   "colour":"#666"
 },
 {
   "label":"CC",
   "count":null,
   "colour":"#666"
 },
 {
   "label":"Animalista",
   "count":4,
   "colour":"#666"
 },
 {
   "label":"UPyD",
   "count":8,
   "colour":"#666"
 },
 {
   "label":"BNG",
   "count":null,
   "colour":"#666"
 },
 {
   "label":"Unio",
   "count":6,
   "colour":"#666"
 },
 {
   "label":"Vox",
   "count":0,
   "colour":"#666"
 },
 {
   "label":"Otros",
   "count":3,
   "colour":"#666"
 }
];

var layout = d3_iconarray.layout()
	.width(70) //number of dots per line
	.height(35);

//expand the data to an array
var dataArray = data.reduce(function(value, d){
	    for(var i=0;i<d.count ;i++){
	        value.push(d.colour);
	    }
	    return value;
	}, []);

var grid = layout(dataArray);

var dotRadius = 5;
var width = 1200, 
	height = 700, 
	margin = {top:20, bottom:20, left:20, right:300 };

var arrayScale = d3.scaleLinear()
	.domain([ 0, 70 ]) //numer of gaps in every row
	.range([0, width-(margin.left+margin.right)]);
var svg = d3.select('#gbs-example')
		.append('svg')
			.attr('width',width)
			.attr('height',height)
		.append('g')
			.attr('transform','translate('+margin.left+','+margin.top+')');
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
		.style("opacity", 0);

svg.selectAll('circle')
	.data(grid)
		.enter()
	.append('circle')
		.attr('cx', function(d){ 
			return arrayScale(d.position.x); 
		})
		.attr('cy', function(d){ 
			return arrayScale(d.position.y); 
		})
		.attr('r',dotRadius)
		.attr('fill',function(d){ return d.data; })
		.on("mouseover", function(d) {      
			div.transition()
				.duration(200)      
				.style("opacity", .9);      
			div.html("10.000 personas")  
				.style("left", (d3.event.pageX) + "px")     
				.style("top", (d3.event.pageY) - 60 + "px");    
					})                  
			.on("mouseout", function(d) {       
					div.transition()        
				.duration(500)      
				.style("opacity", 0);   
			});


//Legend?
d3.select('#gbs-example svg')
	.append('g').attr('transform','translate('+ (width-margin.right + 50)+',' + (margin.top + dotRadius) + ')')
	.selectAll('g.key-element')
	.data(data)
		.enter()
	.append('g')
		.attr('transform',function(d,i){ return 'translate(0,'+(i*20)+')'; })
		.attr('class','key-element')
	.call(function(parent){
		parent.append('circle')
			.attr('r', dotRadius)
			.attr('cx', -dotRadius*2)
			.attr('cy', -dotRadius)	
			.attr('fill', function(d){ return d.colour; })
		
		parent.append('text')
			.attr('dx', 0)
			.attr('dy',0 )
			.text(function(d){
				return d.label + ' (' + d.count + ' x 10mil hab)';
			})
			.call(wrap, margin.right-10);
	})


//wrapping long labels https://bl.ocks.org/mbostock/7555321

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

d3.select(self.frameElement).style("height", (height + 200)+"px");
