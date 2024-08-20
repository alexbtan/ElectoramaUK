'use client';

import { useEffect, useRef, useState } from 'react';
import { Select, Option } from "@material-tailwind/react";
import mapGeographyJson from '../../../public/650map_new.json';
import seatDataJson from '../../../public/2024election.json';
import ethDataJson from '../../../public/ethnicity2021.json';
import ageDataJson from '../../../public/age2022.json';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { GeometryObject, Topology } from 'topojson-specification';
import { partyColours } from '../constants/index.js';

const ElectoralMap = ({onMapClick} : {onMapClick : (seatName : string) => void}) => {
  const svgRef = useRef(null);
  const refContainer = useRef();
  const [selectedMapType, setSelectedMapType] = useState('winners');
  const [selectedPartyType, setSelectedPartyType] = useState('labour');
  const [selectedAgeType, setSelectedAgeType] = useState('0');
  const [selectedEthType, setSelectedEthType] = useState('White');
  const mapHeight = 770;
  const mapWidth = 750;

  const seatData: SeatDataCollection = seatDataJson as SeatDataCollection;
  const ethData: EthDataCollection = ethDataJson as EthDataCollection;
  const ageData: AgeDataCollection = ageDataJson as AgeDataCollection;
  const colours: Colours = partyColours as Colours;
  const mapGeography: MapData = mapGeographyJson as MapData;
  
  useEffect(() => {
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

    const handleClick = (event: MouseEvent, feature: MapData) => {
      // Remove highlight from all paths
      d3.selectAll('.map-path').classed('highlight', false);
    
      // Highlight the clicked path
      d3.select(event.target as SVGPathElement).classed('highlight', true);
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
    .attr('fill', mapColours)
    .on('click', function(event : MouseEvent, feature : MapData) {
      handleClick(event, feature);
    });

    // Zoom function to handle the zoom and pan transformations
    const zoomed = (event: d3.D3ZoomEvent<SVGGElement, unknown>) => {
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
     const zoomToFeature = (feature : MapData) => {
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


  }, [selectedMapType, selectedPartyType, selectedAgeType, selectedEthType]); // Empty dependency array to run the effect only once
  
  // MAP OPTIONS #####################################################################

  const handleMapChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    value: string | undefined
  ) => {
    if (value !== undefined) {
      setter(value);
    } else {
      setter(''); // or handle this case as you see fit
    }
  };

  // Adds opacity values to colours for choropleth
  const addOpacityToRgb = (rgb : string, opacity : number) => {
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
  const mapColours = (feature : MapData) => {
    if (selectedMapType === 'choroplethparty') {
      var partyVotes = 0;
      try{
        partyVotes = seatData[feature.properties.name].partyInfo[selectedPartyType].total;
      }
      catch(err) {
        partyVotes = 0;
      }
      const electorate = seatData[feature.properties.name].seatInfo.electorate * seatData[feature.properties.name].seatInfo.turnout / 100;
      return addOpacityToRgb(colours[selectedPartyType], partyVotes / electorate);
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
      return colours[seatData[feature.properties.name].seatInfo.current];
    }
  };

  return (
    <div>
      <div className="flex w-72 flex-row gap-6 mt-4 mx-4">
        <div >
          <Select variant="static" label="Select Map Type:" id="dropdown" value={selectedMapType} onChange={(value) => handleMapChange(setSelectedMapType)(value)}>
            <Option value="winners">Winners</Option>
            <Option value="choroplethparty">Choropleth by vote share</Option>
            <Option value="choroplethage">Choropleth by age</Option>
            <Option value="choropletheth">Choropleth by ethnicity</Option>
          </Select>
        </div>
        {selectedMapType === "choroplethparty" && (
        <div>
          <Select variant="static" label="Select Party:" id="dropdown" value={selectedPartyType} onChange={(value) => handleMapChange(setSelectedPartyType)(value)}>
            <Option value="labour">Labour</Option>
            <Option value="conservative">Conservatives</Option>
            <Option value="libdems">Liberal Democrats</Option>
            <Option value="plaidcymru">Plaid Cymru</Option>
            <Option value="snp">SNP</Option>
            <Option value="other">Indepedent</Option>
            <Option value="dup">DUP</Option>
            <Option value="sinnfein">Sinn Fein</Option>
            <Option value="alliance">Alliance</Option>
            <Option value="green">Greens</Option>
            <Option value="sdlp">SDLP</Option>
            <Option value="reform">Reform UK</Option>
            <Option value="uu">Ulster Unionists</Option>
          </Select>
        </div>)}
        {selectedMapType === "choroplethage" && (
        <div>
          <Select variant="static" label="Select Age Group:" id="dropdown" value={selectedAgeType} onChange={(value) => handleMapChange(setSelectedAgeType)(value)}>
            <Option value="0">0 to 17</Option>
            <Option value="1">18 to 24</Option>
            <Option value="2">25 to 34</Option>
            <Option value="3">35 to 49</Option>
            <Option value="4">50 to 64</Option>
            <Option value="5">65 and over</Option>
          </Select>
        </div>)}
        {selectedMapType === "choropletheth" && (
        <div>
          <Select variant="static" label="Select Ethnicitiy Group:" id="dropdown" value={selectedEthType} onChange={(value) => handleMapChange(setSelectedEthType)(value)}>
            <Option value="White">White</Option>
            <Option value="Mixed or Multiple ethnic groups">Mixed or Multiple ethnic groups</Option>
            <Option value="Asian">Asian</Option>
            <Option value="Black, African or Caribbean">Black, African or Caribbean</Option>
            <Option value="Other">Other</Option>
          </Select>
        </div>)}
      </div>
      <svg className="max-h-full" ref={svgRef}></svg>
    </div>
  );
}

export default ElectoralMap