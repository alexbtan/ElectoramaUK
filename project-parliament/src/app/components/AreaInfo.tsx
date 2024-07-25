'use client';

import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { partyColours, ethColours, ageColours} from '../constants/index.js';
import Constituency from './Constituency';
import seatData from '../../../public/2024election.json';
import allEthData from '../../../public/ethnicity2021.json';
import allAgeData from '../../../public/age2022.json';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const MyPieChart = ({ data, colours }) => {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx={200}
        cy={100}
        //labelLine={false}
        //label={({ name, value }) => `${name}: ${(value).toFixed(0)}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
      {data.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colours[entry.name]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="bottom" align="center" className="mt-10"/>
    </PieChart>
  );
};

const AreaInfo = ({seatName}) => {

    //3989
    //
    const mapData = seatData[seatName];
    const ethData = allEthData[seatName];
    const ageData = allAgeData[seatName];
    var chartData = [];
    var ethChartData = [];
    var ageChartData = [];
    if(mapData != null){
        for(const [key, value] of Object.entries(mapData.partyInfo)){
          chartData.push({ name: key, value: value.total});
        }
        for(let i = 0; i < 5; i++){
          ethChartData.push({ name: ethData[i].groups,value: Math.round(ethData[i].con_pc * 100)});
        }
        for(let i = 0; i < 6; i++){
          ageChartData.push({ name: ageData[i].age,value: Math.round(ageData[i].con_pc * 100)});
        }
    }
    console.log(ethChartData);

    return (
      <div className="w-full">
        {mapData != null ? 
        <div className="w-full flex items-center flex-col">
          <h1 className="font-bold mt-8 text-5xl">{seatName}</h1>
          <div className="flex flex-row justify-between">
            <div className="flex items-center flex-col">
              <h2>Electoral Data</h2>
              <MyPieChart data={chartData} colours={partyColours} />
            </div>
            <div>
              <h2>Ethnicity Data</h2>
              <MyPieChart data={ethChartData} colours={ethColours} />
            </div>
          </div>
          <div>
            <h2>Age Data</h2>
            <MyPieChart data={ageChartData} colours={ethColours} />
          </div>
        </div>
        :
        <div className="flex items-center flex-col">
          <h1 className="font-bold mt-8 text-5xl">Clacton</h1>
          <div className="flex flex-row">
            <div className="w-full md:w-2/5 lg:w-1/2 px-4 text-center md:text-left lg:pl-12">
              <h3 className="font-bold mt-16 text-xl md:mt-0 sm:text-2xl">
                  Nigel Farage
              </h3>
              <p className="sm:text-lg mt-6">
                  Use the LocaleData gem to download translations directly into your Ruby on Rails
                  projects using the provided command line interface. Just create a project and follow
                  the step-by-step instructions.
              </p>
            </div>
            <img className="block select-none mx-auto bg-gray-300 transition-colors duration-300 rounded-full w-[240px]" src="https://members-api.parliament.uk/api/Members/5091/Thumbnail" alt={'MP Photo not found'}/>
          </div>
        </div>
        }
      </div>
    );
}

export default AreaInfo