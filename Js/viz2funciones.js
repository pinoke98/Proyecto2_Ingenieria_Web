let body;
let container;

window.onload = function() {
    body = d3.select("#body")
    container = d3.select("#container")
    //graficar()
}
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
        console.log(data[1].BIRTH_peso5)
        tipo(dato)
        console.log(XSelected,YSelected)
        if(arr[XSelected] == "n"){
            var filteredData = data.filter(d => {
                return d[XSelected] > 0
            })
            console.log(filteredData)
        }
        if(arr[YSelected] == "n"){
            var filteredData = data.filter(d => {
                return d[YSelected] > 0
            })
        }
        console.log(filteredData)
        showData(filteredData)
        let brush = d3.brush();

        brush.on("brush", function (a,b) {
            let coords = d3.event.selection
            let arr = []
            body.selectAll("circle")
                .style("fill", function(d) {
                    let cx = d3.select(this).attr("cx");
                    let cy = d3.select(this).attr("cy");
                    let data = d3.select(this).data()
                    

                    let selected = isSelected(coords, cx, cy)
                    
                    if(selected){
                        arr.push(data)
                        return "red"
                    }
                    return "blue"
                })
                
        })

    

        

        body.append("g")
            .attr("class", "brush")
            .call(brush);
    })
}

function showData(clients) {
    var bodyWidth = 600;
    var bodyHeight = 400;
    console.log(clients)

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
