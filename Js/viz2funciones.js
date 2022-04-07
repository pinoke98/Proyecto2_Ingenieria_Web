let body;
let container;
let barchar = d3.select('#barchart');
let barchart = d3.select("#barchart")


let width = 400;
let height = 200;

let margin = { left: 20, bottom: 20, right: 20, top: 20 }


window.onload = function() {
    body = d3.select("#body")
    container = d3.select("#container")
    barchart = d3.select('#barchart')
    graficar()
}

barchar.attr("height", height)
barchar.attr("width", width)

let element  = document.getElementById('carta');
let arr = {
            "BIRTH_peso5":"n",
            "BIRTH_talla5":"n",
            "FOLL12M_peso12": "n",
            "FOLL12M_talla12": "n"
        }

let variable = document.getElementById("variableGraf");
var XSelected;
var YSelected;


function tipo(variable){
    if(variable=="Peso"){
        XSelected = "FOLL12M_peso12"
        YSelected = "BIRTH_peso5"
    } else{
        XSelected = "BIRTH_talla5"
        YSelected = "FOLL12M_talla12"
    }
}


function graficar(){
    d3.csv("../Datos/Datos_Longitudinales.csv").then((data) => {
        
        variable = document.getElementById("variableGraf")
        dato = variable.options[variable.selectedIndex].id.toString()
        //console.log(data[1].BIRTH_peso5)
        tipo(dato)
        //console.log(XSelected,YSelected)
        if(arr[XSelected] == "n"){
            var filteredData = data.filter(d => {
                return d[XSelected] > 0
            })
            //console.log(filteredData)
        }
        if(arr[YSelected] == "n"){
            var filteredData = data.filter(d => {
                return d[YSelected] > 0
            })
        }
        //console.log(filteredData)
        showData(filteredData)
        let brush = d3.brush();
        var arrData = [
            {type: 'SinCesaria', cantidad: 0},
            {type: 'Cesaria', cantidad: 0}
        ]

        var isAdded = []

        brush.on("brush", function (a,b) {
            let coords = d3.event.selection
            resetGraph()
            body.selectAll("circle")
                .style("fill", function(d) {
                    let cx = d3.select(this).attr("cx");
                    let cy = d3.select(this).attr("cy");
                    


                    console.log( 'datos brush', d)
                    let selected = isSelected(coords, cx, cy)
                    
                    if(selected){
                        if(isAdded.includes(d.id)){
                            return "red"
                        }
                        
                        if(d["BIRTH_cesarea"]==0 ){
                            arrData[0]['cantidad']++
                            isAdded.push(d.id)
                        }else{
                            arrData[1]['cantidad']++
                            isAdded.push(d.id)
                        }
                        return "red"
                    }
        
                      
                    return "blue"
                })
                console.log("datos completos", arrData)
                if(arrData[0]['cantidad']>0 || arrData[1]['cantidad']>0){
                    drawBarChart(arrData)
                    isAdded = []
                    arrData = [
                        {type: 'SinCesaria', cantidad: 0},
                        {type: 'Cesaria', cantidad: 0}
                    ]

                }
        })  
        body.append("g")
            .attr("class", "brush")
            .call(brush);
    })
}

function resetGraph(){
    let arrData = [
        {type: 'SinCesaria', cantidad: 0},
        {type: 'Cesaria', cantidad: 0}
    ]

    drawBarChart(arrData)
    barchar.selectAll('rect')
        .attr('fill', 'white')
        .attr("width", 0)
        .attr("height", 0)
}



function drawBarChart(data) {
    console.log(data)

    let margin = { left: 20, bottom: 20, right: 20, top: 20 }

    let bodyWidth = width - margin.left - margin.right;
    let bodyHeight = height - margin.top - margin.bottom;

    let xScale = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([margin.left, width - margin.right])
        .padding(0.2)

    let yScale = d3.scaleLinear()
        .range([height-margin.bottom, 0])
        .domain([0, d3.max(data, d=> d.cantidad)])

    //console.log(yScale(data[0]))

    barChartBody = barchart.select(".body")
        .attr("transform", `translate(${margin.left},0)`)
        .selectAll()
        .data(data.sort((a,b)=> d3.descending(a.score, b.score)))
        

    barChartBody.enter()
        .append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", d =>{ return yScale(0) - yScale(d.cantidad)})
        .attr("y", (d) => {return yScale(d.cantidad)})
        .attr("x", (d) => {return xScale(d.type)})
        .merge(barChartBody)
        .attr("fill", "red")

    barchar.select(".yAxis")
        .attr('transform', `translate(${margin.left+30},0)`)
        .call(d3.axisLeft(yScale).ticks(5))
        .attr('font-size', '15px')

    barchar.select(".xAxis")
        .attr('transform', `translate(30,${height-20})`)
        .call(d3.axisBottom(xScale).tickFormat(i=> {return i }))
        .attr('font-size', '20px')


    barchar.node()


    //console.log("done")
}




function graficarBarras(arr){
    
    barchar.append('svg')
        .attr('height', height - margin.top -margin.bottom)
        .attr('width', width - margin.left - margin.right)
        .attr('viewBox', [0,0,width,height])

    const x= d3.scaleBand()
        .domain(d3.range(arr.length))
        .range([margin.left, width - margin.right])
        .padding(0.2)
    
    const y= d3.scaleLinear()
        .domain([0,100])
        .range([height-margin.bottom,margin.top])

    barchar.append('g')
        .attr('fill', 'red')
        .attr('transform', `translate(${margin.left},${margin.bottom})`)
        .selectAll('rect')
        .data(arr.sort((a,b)=> d3.descending(a.score, b.score)))
        .enter()
        .append('rect')
        .attr('x', (d,i)=>x(i))
        .attr('y', (d) => y(d['cantidad']))
        .attr("height", d =>  y(0) - y(d['cantidad']))  
        .attr("width", x.bandwidth())
        .merge(barchar)


    barchar.append('g')
        .attr('transform', `translate(0 ${height- margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => arr[i].type))
        .attr('font-size','20px')  
    
    barchar.append('g')
        .attr('transform',`translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, arr.format))
        .attr('font-size', '20px')

    barchar.node()

}



function showData(clients) {
    var bodyWidth = 600;
    var bodyHeight = 400;
    //console.log(clients)

    let xExtent = d3.extent(clients, d => +d[XSelected])
    let xScale = d3.scaleLinear().range([0, bodyWidth])
        .domain([xExtent[0]-5, xExtent[1]+5])
        

    let yExtent = d3.extent(clients, d => +d[YSelected])
    let yScale = d3.scaleLinear().range([0, bodyHeight])
        .domain([yExtent[0]-5, yExtent[1]+5])

    let join = body.selectAll("circle")
        .data(clients)

    let newelements = join.enter()
        .append("circle")
        .style("fill", "blue")
        .style("r", "5")
            
    join.merge(newelements)
        .transition()
        .attr("cx", d => xScale(+d[XSelected]))
        .attr("cy", d => yScale(+d[YSelected]))

    d3.select("#yAxis")
        .style("transform", "translate(40px, 10px)")
        .call(d3.axisLeft(yScale))

    d3.select("#xAxis")
        .style("transform", `translate(40px, ${bodyHeight+10}px)`)
        .call(d3.axisBottom(xScale))

    let yAxis = d3.axisLeft(yScale);
    let yAxisGroup = d3.select("#yAxis")
        .style("transform", "translate(40px, 10px)")
        .call(yAxis)

    let xAxis = d3.axisBottom(xScale)
    let xAxisGroup = d3.select("#xAxis")
        .style("transform", `translate(40px, ${bodyHeight + 10}px)`)
        .call(xAxis)


    let zoom = d3.zoom()
    zoom.on("zoom", function (a, b) {
        let newXScale = d3.event.transform.rescaleX(xScale);
        let newYScale = d3.event.transform.rescaleY(yScale);

        xAxis.scale(newXScale)
        xAxisGroup.call(xAxis)

        yAxis.scale(newYScale)
        yAxisGroup.call(yAxis)

        join.merge(newelements)
            .attr("cx", d => newXScale(+d[XSelected]))
            .attr("cy", d => newYScale(+d[YSelected]))
    });
    container.call(zoom)

    
    console.log("graficado")
}




function isSelected(coords, x, y) {
    let x0 = coords[0][0],
        x1 = coords[1][0],
        y0 = coords[0][1],
        y1 = coords[1][1];
    
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
}

function showTooltip(text, coords) {
    let x = coords[0];
    let y = coords[1];

    d3.select("#tooltip")
        .style("display", "block")
        .style("top", y)
        .style("left", x)
        .text(text)
}
