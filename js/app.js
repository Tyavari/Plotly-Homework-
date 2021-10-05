// Use function to reaqd json via d3
function buildMetaData(sample) {
    d3.json("samples.json").then((data) => {
      let metadata = data.metadata;
      console.log(metadata);

    // Filter  data
    let buildingArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = buildingArray[0];
    
    // Use d3 to select the required panel
    let panelData = d3.select("#sample-metadata");

    // Clear the previous data in html
    panelData.html("");

   
    // Add each key-value pair to the panelData
    Object.entries(result).forEach(([key, value]) => {
      panelData.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      let sampleData = data.samples;
      let buildingArray = sampleData.filter(sampleObj => sampleObj.id == sample);
      let result = buildingArray[0];
  
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      // Begin building Bubble Chart
    let bubbleChart = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
      };
      let bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleChart);
      
      //Begin building Bar Chart
      let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      let barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      let chartLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, chartLayout);
    });
  };

  function init() {
    let selectDropdown = d3.select("#selDataset");
  
    // Use the list of sample names to populate select options
    d3.json("samples.json").then((data) => {
      let name = data.names;
  
      name.forEach((sample) => {
        selectDropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      })
  
      // Begin building plots with list data
      let sampleData = name[0];
      buildCharts(sampleData);
      buildMetaData(sampleData);
    });
  };
  
  function optionChanged(newSample) {
    // Refresh data each time another sample is selected
    buildCharts(newSample);
    buildMetaData(newSample);
  };

  
// Initialize dashboard
  init()