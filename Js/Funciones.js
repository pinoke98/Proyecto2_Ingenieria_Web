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

var svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("width",element.offsetWidth/1.05)
            .attr("height", element.offsetHeight*1.5)
            .attr("id","svg")
        .append("g")
            .attr("transform","translate(" + 10 + "," + 10 + ")");

svg.append("g")
    .attr("id","body")
    .style("transform","translate(30px,0px)")

svg.append("g")
    .attr("id","yAxis")

svg.append("g")
    .attr("id","xAxis")


let body = d3.select("#body")
let barchart = d3.select("#svg")
let join;

function graficar(){
    d3.csv("/Datos/Datos_Longitudinales.csv").then((data) => {
        let variableX = document.getElementById("variableX");
        var XSelected = variableX.options[variableX.selectedIndex].id.toString();
        let variableY = document.getElementById("variableY");
        var YSelected = variableY.options[variableY.selectedIndex].id.toString();
        if(arr[XSelected] == "n"){
            var filteredData = data.filter(d => {
                return d[XSelected] > 0
            })
        }
        if(arr[YSelected] == "n"){
            var filteredData = data.filter(d => {
                return d[YSelected] > 0
            })
        }
        // console.log(filteredData)
        if(arr[XSelected] == "n" && arr[YSelected] == "n"){
            showDataDisp(filteredData)
        }else if(arr[XSelected] == "c" && arr[YSelected] == "n"){
            showDataBar1(filteredData)
        }else if(arr[XSelected] == "n" && arr[YSelected] == "c"){
            showDataBar2(filteredData)
        }else{

        }
    })
}

function showDataDisp(data) {
    let element  = document.getElementById('carta');
    var bodyWidth = element.offsetWidth;
    var bodyHeight = element.offsetHeight;
    //console.log(data);
    if(join != null){
        join.exit().remove()
        console.log(join)
    }
    let variableX = document.getElementById("variableX");
    var XSelected = variableX.options[variableX.selectedIndex].id.toString();
    // console.log(XSelected);

    let variableY = document.getElementById("variableY");
    var YSelected = variableY.options[variableY.selectedIndex].id.toString();
    // console.log(YSelected);

    let xExtent = d3.extent(data, d => +d[XSelected])
    // console.log(xExtent)
    let xScale = d3.scaleLinear().range([0, bodyWidth])
        .domain([xExtent[0]-xExtent[0]*0.1, xExtent[1]+xExtent[1]*0.1])

    let yExtent = d3.extent(data, d => +d[YSelected])
    //console.log(yExtent)
    let yScale = d3.scaleLinear().range([0, bodyHeight/1.5])
        .domain([yExtent[1]+yExtent[1]*0.1, yExtent[0]-yExtent[0]*0.1])

    join = body.selectAll("circle")
        .data(data)

    join.enter()
        .append("circle")
        .style("fill", "blue")
        .style("r", "5")
        .merge(join)
        .transition()
        .duration(1000)
            .attr("cx", d => xScale(+d[XSelected]))
            .attr("cy", d => yScale(+d[YSelected]))

    d3.select("#yAxis")
        .style("transform", "translate(30px, -5px)")
        .call(d3.axisLeft(yScale))

    d3.select("#xAxis")
        .style("transform", `translate(30px, 665px)`)
        .call(d3.axisBottom(xScale))

    join.exit()
        .remove()
    console.log(join)
}

function showDataBar1(data) {
    let element  = document.getElementById('carta');
    var bodyWidth = element.offsetWidth;
    var bodyHeight = element.offsetHeight;

    let variableX = document.getElementById("variableX");
    var XSelected = variableX.options[variableX.selectedIndex].id.toString();
    // console.log(XSelected);

    let variableY = document.getElementById("variableY");
    var YSelected = variableY.options[variableY.selectedIndex].id.toString();
    // console.log(YSelected);

    let xScale = d3.scaleBand()
        .range([0,bodyWidth])
        .domain(data.map(d => d[XSelected]))
        .padding(0.2)

    let yScale = d3.scaleLinear()
        .range([bodyHeight,0])
        .domain([0, d3.max(data, d => d[YSelected])])

    join = body.selectAll("rect")
        .data(data)
    
    join.enter()
        .append("rect")
        .merge(join)
        .transition()
        .duration(1000)
            .attr("fill", "#556677")
            .attr("width", xScale.bandwidth())
            .attr("height", d => (bodyHeight - yScale(d[YSelected])))
            .attr("y", d => yScale(d[YSelected]))
            .attr("x", d => xScale(d[XSelected]))
        
    d3.select("#yAxis")
        .style("transform", "translate(30px, -5px)")
        .call(d3.axisLeft(yScale))

    d3.select("#xAxis")
        .style("transform", `translate(30px, 665px)`)
        .call(d3.axisBottom(xScale))

    join.exit()
        .remove()
}

function showDataBar2(data) {
    let element  = document.getElementById('carta');
    var bodyWidth = element.offsetWidth;
    var bodyHeight = element.offsetHeight;

    let variableX = document.getElementById("variableY");
    var XSelected = variableX.options[variableX.selectedIndex].id.toString();
    // console.log(XSelected);

    let variableY = document.getElementById("variableX");
    var YSelected = variableY.options[variableY.selectedIndex].id.toString();
    // console.log(YSelected);

    let xScale = d3.scaleBand()
        .range([0,bodyWidth])
        .domain(data.map(d => d[XSelected]))
        .padding(0.2)

    let yScale = d3.scaleLinear()
        .range([bodyHeight,0])
        .domain([0, d3.max(data, d => d[YSelected])])

    join = body.selectAll("rect")
        .data(data)
    
    join.enter()
        .append("rect")
        .merge(join)
        .transition()
        .duration(1000)
            .attr("fill", "#556677")
            .attr("width", xScale.bandwidth())
            .attr("height", d => (bodyHeight - yScale(d[YSelected])))
            .attr("y", d => yScale(d[YSelected]))
            .attr("x", d => xScale(d[XSelected]))
            .attr("transform", d => `translate(0,0)`)
        
    d3.select("#yAxis")
        .style("transform", "translate(30px, -5px)")
        .call(d3.axisLeft(yScale))

    d3.select("#xAxis")
        .style("transform", `translate(30px, 665px)`)
        .call(d3.axisBottom(xScale))

    join.exit()
        .remove()
}
// function showDataBar2(data) {
//     let element  = document.getElementById('carta');
//     var bodyWidth = element.offsetWidth;
//     var bodyHeight = element.offsetHeight;
//     if(join != null){
//         join.exit().remove()
//         console.log(join)
//     }
//     let variableX = document.getElementById("variableX");
//     var XSelected = variableX.options[variableX.selectedIndex].id.toString();
//     // console.log(XSelected);

//     let variableY = document.getElementById("variableY");
//     var YSelected = variableY.options[variableY.selectedIndex].id.toString();
//     // console.log(YSelected);

//     let xScale = d3.scaleLinear()
//         .range([0, bodyWidth])
//         .domain([0, d3.max(data, d => d[XSelected])])

//     let yScale = d3.scaleBand()
//         .range([0,bodyHeight])
//         .domain(data.map(d => d[YSelected]))
//         .padding(0.1)

//     join = body.selectAll("rect")
//         .data(data)
    
//     join.enter()
//         .append("rect")
//         .merge(join)
//         .transition()
//         .duration(1000)
//             .attr("x", d => xScale(0))
//             .attr("y", d => yScale(d[YSelected]))
//             .attr("width", d => xScale(d[YSelected]))
//             .attr("height", yScale.bandwidth())
//             .attr("fill", "#556677")
//             .attr("transform", d => `translate(-400,0)`)
        
//     d3.select("#yAxis")
//         .style("transform", "translate(30px, -5px)")
//         .call(d3.axisLeft(yScale))

//     d3.select("#xAxis")
//         .style("transform", `translate(30px, 665px)`)
//         .call(d3.axisBottom(xScale))

//     console.log("Melo")
//     join.exit()
//         .remove()
// }
