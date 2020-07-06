// load page
d3.json("data/samples.json").then((data)=> {
    
    // populate the dropdwown menu
    //var dropdown = d3.select("#selDataset");
    data.names.forEach(function(name) {
        d3.select("#selDataset").append("option").text(name).property("value");
    });
    
    // load the charts and demo data using the function below
    barBubbleDemo(data.names[0]);
});

//function for bar chart and bubble chart
function barBubbleDemo(id) {
    d3.json("data/samples.json").then (bellyButton =>{
        // metadata for demographic panel
        var metadata = bellyButton.metadata.filter(d => d.id.toString() === id)[0];
        // update demographic information panel
        var demographic_info = d3.select("#sample-metadata");
        demographic_info.html("");
        Object.entries(metadata).forEach((key, value) => {   
            demographic_info.append("h5").text(key + ": " + value);    
        });

        //top10 values for chart. reverse took too long for something so simple
        //2 step sorting for changes to dropdown
        var sort_withID = bellyButton.samples.filter(s => s.id.toString() === id)[0];
        var sample_values =  sort_withID.sample_values.slice(0,10).reverse();
        // hovertext for the chart, reversed
        var otu_labels =  sort_withID.otu_labels.slice(0,10).reverse();
        // ids, reversed, add "OTU" for label like example in Readme
        var otu_ids = (sort_withID.otu_ids.slice(0, 10).reverse()).map(d => "OTU " + d);                     

        // update demographic information panel
        var demographic_info = d3.select("#sample-metadata");
        demographic_info.html("");
        Object.entries(metadata).forEach((key) => {   
            demographic_info.append("h5").text(key[0] + ": " + key[1]);    
        });

        var wash_values =  bellyButton.metadata.filter(s => s.id.toString() === id)[0];
        var wfreq =  wash_values.wfreq
        
        // Bonus gauge chart. (the needle is off by just a little bit)
        var degrees = 180-(wfreq*20);
        //alert(degrees);
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        var mainPath = path1,
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data2 = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 14, color:'850000'},
            showlegend: false,
            name: 'Washing Frequency',
            text: wfreq,},
        {  values: [ 1,1,1,1,1,1,1,1,1,9],
        rotation: 90,
        direction: "clockwise",       
        text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        textinfo: 'text',
        textposition:'inside',      
        marker: {colors:['rgb(255, 255, 299,)', 'rgb(247, 252, 185)',
                                'rgb(217, 240, 163)', 'rgb(202, 209, 95)',
                                'rgb(173, 221, 142)', 'rgb(120, 198, 121)', 'rgb(65, 171, 93)',
                                'rgb(35, 132, 67)',"rgb(0, 104, 55)", "white"]},
        hoverinfo: 'none',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var layout2 = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 17 } },
        height: 500,
        width: 600,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('gauge', data2, layout2);
        
        // different type of gauge chart
        // var data2 = [
        //     {
        //       type: "indicator",
        //       mode: "gauge+number",
        //       value: wfreq,
        //       title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: { size: 24 } },
        //       gauge: {
        //         axis: { range: [null, 9], tickwidth: 1, dtick: 1},
        //         bar: { color: "red", thickness: .1 },
        //         steps: [
        //           { range: [0, 1], color: 'rgb(255, 255, 229)'},
        //           { range: [1, 2], color: "rgb(247, 252, 185)" },
        //           { range: [2, 3], color: "rgb(255, 255, 229)" },
        //           { range: [3, 4], color: "rgb(217, 240, 163)" },
        //           { range: [4, 5], color: "rgb(173, 221, 142)" },
        //           { range: [5, 6], color: "rgb(120, 198, 121)" },
        //           { range: [6, 7], color: "rgb(65, 171, 93)" },
        //           { range: [7, 8], color: "rgb(35, 132, 67)" },
        //           { range: [8, 9], color: "rgb(0, 104, 55)"},
        //         ],
        //       }
        //     }
        //   ];
          
        //   var layout2 = {
        //     width: 600,
        //     height: 500,
        //     margin: { t: 0, b: 0  },
        //   };          
        // Plotly.newPlot('gauge', data2, layout2);
        
        // Top10 Bar Chart
        var trace = {
            x: sample_values,
            y: otu_ids,
            type:"bar",
            text: otu_labels,
            marker: {
            color: 'blue'},                
            orientation: "h",
        };
        var data = [trace];
        var layout = {
            title: "Top 10 OTUs<br>(Operational Taxonomic Units)",
            width: 600,
            height: 500,
            // xaxis: {
            //     title:"Sample Values"
            // },
            // yaxis: {
            //     title:"OTU IDs"
            // }
        };
    Plotly.newPlot("bar", data, layout);

        // Bubble chart, so simple yet so much time to figure out (data was complicated on this one)
        var trace1 = {
            x: sort_withID.otu_ids,
            y: sort_withID.sample_values,
            mode: "markers",
            marker: {
                size: sort_withID.sample_values,
                color: sort_withID.otu_ids
            },
            text: sort_withID.otu_labels    
        };
        var layout1 = {
            xaxis:{title: "OTU ID"
            }
        };
        var data1 = [trace1];
    Plotly.newPlot("bubble", data1, layout1);         
    });
}  

// dropdown change (from the index file)
function optionChanged(id) {
    barBubbleDemo(id);
}