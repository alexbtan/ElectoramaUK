'use client';

import { useEffect, useRef, useState } from 'react';
import { Select, Option } from "@material-tailwind/react";
import { initializeMap } from '../utils/mapUtils';

const ElectoralMap = ({onMapClick} : {onMapClick : (seatName : string) => void}) => {
  const svgRef = useRef(null);
  const [selectedMapType, setSelectedMapType] = useState('winners');
  const [selectedPartyType, setSelectedPartyType] = useState('labour');
  const [selectedAgeType, setSelectedAgeType] = useState('0');
  const [selectedEthType, setSelectedEthType] = useState('White');
  const mapHeight = 770;
  const mapWidth = 750;
  
  useEffect(() => {
    initializeMap( svgRef,
      mapHeight,
      mapWidth,
      selectedMapType,
      selectedPartyType,
      selectedAgeType,
      selectedEthType,
      onMapClick);
  }, [selectedMapType, selectedPartyType, selectedAgeType, selectedEthType]);

  const handleMapChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    value: string | undefined
  ) => {
    if (value !== undefined) {
      setter(value);
    } else {
      setter('');
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