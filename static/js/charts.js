function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/json/samples.json").then((data) => {
    let sampleNames = data.names;

    console.log(sampleNames);

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/json/samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/json/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    let allSamples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    // 5. Create a variable that holds the first sample in the array.
    let resultSample = allSamples.filter(sampleObj => sampleObj.id == sample)[0];

    // Deliverable 3 Gauge Chart
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // 2. Create a variable that holds the first sample in the metadata array.
    let resultMetadata = data.metadata.filter(metadataObj => metadataObj.id == sample)[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let resultOtuIds = resultSample.otu_ids;
    let resultOtuLabels = resultSample.otu_labels;
    let resultSampleValues = resultSample.sample_values;

    // Deliverable 3
    // 3. Create a variable that holds the washing frequency.
    let resultWashFreq = parseFloat(resultMetadata.wfreq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    let yticks = resultOtuIds.map(OtuId => `OTU ${OtuId}`).slice(0,10);

    // 8. Create the trace for the bar chart. 
    let barData = [{
      x: resultSampleValues.slice(0,10),
      y: yticks,
      text: resultOtuLabels.slice(0,10),
      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {autorange: "reversed"},
      height: 387,
      margin: {
        t: 50,
        b: 50
      }
    };

    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout)

    // Deliverable 2 Bubble Chart
    // 1. Create the trace for the bubble chart.
    let bubbleData = [{
      x: resultOtuIds,
      y: resultSampleValues,
      text: resultOtuLabels,
      mode: "markers",
      marker: {
        size: resultSampleValues,
        color: resultOtuIds,
        colorscale: "Earth"
      }
    }];

    // 2. Create the layout for the bubble chart.
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      height: 450,
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4
      },
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Deliverable 3
    // 4. Create the trace for the gauge chart.
    let gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: resultWashFreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "limegreen"},
          {range: [8, 10], color: "green"}
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    let gaugeLayout = { 
      width: 456,
      height: 387,
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
  });
}
