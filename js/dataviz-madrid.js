var layout = d3_iconarray.layout()
	.width(25) //number of dots per line 70
	.height(35);

var dotRadius = 6;
var width = 1300, 
	height = 730, 
	margin = {top:20, bottom:20, left:10, right:300 };

var arrayScale = d3.scaleLinear()
	.domain([ 0, 70 ]) //numer of gaps in every row
	.range([0, width-(margin.left+margin.right)]);
var svg = d3.select('#datavizmadrid')
		.append('svg')
			.attr('width',width)
			.attr('height',height)
		.append('g')
			.attr('transform','translate('+margin.left+','+margin.top+')');
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
		.style("opacity", 0);

d3.json("data/votos-limpios-20d_madrid.json", function (error, data) {
	//data/votos-limpios-20d_espana.json, //data/votos-limpios-20d_cataluna.json
	//expand the data to an array
	var dataArray = data.reduce(function(value, d){
			  for(var i=0;i<d.count ;i++){
			      value.push(d.colour);
			  }
			  return value;
		}, []);
	console.log(dataArray);

	var grid = layout(dataArray);
	console.log(grid);

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
			.attr('fill',function(d){ return d.data; });

//Legend
d3.select('#datavizmadrid svg')
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
				return d.label + ' (' + d.count + ' x 10mil pers)';
			})
			.attr('class', 'legend')
			//.call(wrap, margin.right-10) avoids text wrap
			;
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
});	



