// mapUtils.ts
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
//import { Topology } from 'topojson-specification';
import mapGeography from '../../../public/650map_new.json';
import seatData from '../../../public/2024election.json';
import ethData from '../../../public/ethnicity2021.json';
import ageData from '../../../public/age2022.json';
import { partyColours } from '../constants/index.js';

export const initializeMap = (
  svgRef,
  mapHeight,
  mapWidth,
  selectedMapType,
  selectedPartyType,
  selectedAgeType,
  selectedEthType,
  onMapClick
) => {
  // Select the SVG element and set its attributes
  const svg = d3.select(svgRef.current)
    .attr('height', mapHeight)
    .attr('width', mapWidth)
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `00 0 ${1000} ${1000}`); 

  // CLears fixed map, stopping duplication when moving map
  svg.selectAll('*').remove();

  // Append a group element to the SVG
  const mapGroup = svg.append('g')

  // Set up the projection and path generator
  const projection = d3.geoMercator()
    .scale(3500)

  const path = d3.geoPath()
    .projection(projection);

  // Sets inital position and scale of map
  const initialTransform = d3.zoomIdentity.translate(300, 4300).scale(1);
    
  // Fetch and process the GeoJSON data
  const geoData = topojson.feature(mapGeography, mapGeography.objects.map).features;

  const handleClick = (event, feature) => {
    // Remove highlight from all paths
    d3.selectAll('.map-path').classed('highlight', false);

    // Highlight the clicked path
    d3.select(event.target).classed('highlight', true);
    onMapClick(feature.properties.name);
    path.bounds(feature);
    zoomToFeature(feature);
  };

  // Bind data and create path elements
  const paths = mapGroup.selectAll('path')
  .data(geoData)
  .enter().append('path')
  .attr('d', path)
  .attr('class', 'map-path') // Add a class for styling
  .attr('fill', (d) => mapColours(d, selectedMapType=selectedMapType, selectedPartyType, selectedAgeType, selectedEthType))
  .on('click', function(event, feature) {
    handleClick(event, feature);
  });

  // Zoom function to handle the zoom and pan transformations
  const zoomed = (event) => {
    mapGroup.attr('transform', event.transform);
  };

  // Set up zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([1, 8]) // Define zoom scale extent
    .on('zoom', zoomed);

  // Apply zoom behavior to the SVG
  svg.call(zoom);

  svg.call(
    zoom.transform,
    initialTransform
  );
  // Function to zoom to a specific feature
  const zoomToFeature = (feature ) => {
    const bounds = path.bounds(feature);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = Math.max(1, Math.min(4, 0.9 / Math.max(dx / 1000, dy / 1000)));
    const translate = [1000 / 2 - scale * x, 1000 / 2 - scale * y];
    svg.transition()
      .duration(750)
      .call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
  };
};

// Adds opacity values to colours for choropleth
const addOpacityToRgb = (rgb, opacity) => {
  // Extract the RGB values from the input string
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return rgb; // If input is not a valid RGB string, return it as-is

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  // Return the RGBA string with the specified opacity
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Decides map colours depending on types
const mapColours = (
  feature,
  selectedMapType,
  selectedPartyType,
  selectedAgeType,
  selectedEthType,
) => {
  if (selectedMapType === 'choroplethparty') {
    var partyVotes = 0;
    try{
      partyVotes = seatData[feature.properties.name].partyInfo[selectedPartyType].total;
    }
    catch(err) {
      partyVotes = 0;
    }
    const electorate = seatData[feature.properties.name].seatInfo.electorate * seatData[feature.properties.name].seatInfo.turnout / 100;
    return addOpacityToRgb(partyColours[selectedPartyType], partyVotes / electorate);
  } else if (selectedMapType === 'choroplethage') {
    var opacity = 0;
    try{
      opacity = ageData[feature.properties.name][Number(selectedAgeType)].con_pc;
    }
    catch(err) {
      opacity = 0;
    }
    return addOpacityToRgb('rgb(228, 0, 59)', opacity);
  } else if (selectedMapType === 'choropletheth') {
    var opacity = 0;
    try{
      for(let i = 0; i < 5; i++){
        if (ethData[feature.properties.name][i].groups == selectedEthType){
          opacity = ethData[feature.properties.name][i].con_pc;
          break;
        }
      }
    }
    catch(err) {
      opacity = 0;
    }
    return addOpacityToRgb('rgb(228, 0, 59)', opacity);
  } else {
    return partyColours[seatData[feature.properties.name].seatInfo.current];
  }
};