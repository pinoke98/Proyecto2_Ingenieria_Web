
window.onload = function() {
    graficar()
}
let element  = document.getElementById('carta');
let arr = {"Tratamiento":"c",
            "Pretermino":"c",
            "BIRTH_cesarea":"c",
            "BIRTH_peso5":"n",
            "BIRTH_talla5":"n",
            "BIRTH_sexo5":"c",
            "BIRTH_pc5":"n"
        }

let variableX = document.getElementById("variableXvis2");
var XSelected = variableX.options[variableX.selectedIndex].id.toString();
let variableY = document.getElementById("variableYvis2");
var YSelected = variableY.options[variableY.selectedIndex].id.toString();

let body = d3.select("#body")
let container = d3.select("#container")
function graficar(){
    d3.csv("../Datos/Datos_Longitudinales.csv").then((data) => {
        variableX = document.getElementById("variableXvis2");
        XSelected = variableX.options[variableX.selectedIndex].id.toString();
        variableY = document.getElementById("variableYvis2");
        YSelected = variableY.options[variableY.selectedIndex].id.toString();
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
            body.selectAll("circle")
                .style("fill", function(d) {
                    let cx = d3.select(this).attr("cx");
                    let cy = d3.select(this).attr("cy");

                    let selected = isSelected(coords, cx, cy)
                    return selected ? "red" : "blue"
                })
            
        })

        body.append("g")
            .attr("class", "brush")
            .call(brush);
    })
}

function showData(clients) {
    var bodyWidth = 1000;
    var bodyHeight = 700;
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

    

}

function isSelected(coords, x, y) {
    let x0 = coords[0][0],
        x1 = coords[1][0],
        y0 = coords[0][1],
        y1 = coords[1][1];
    
    return x0 <= x && x <= x1 && y0 <= y && y <= y1;
}
