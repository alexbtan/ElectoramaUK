'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { partyColours, ethColours, ageColours} from '../constants/index.js';
import seatDataJson from '../../../public/2024election.json';
import ethDataJson from '../../../public/ethnicity2021.json';
import ageDataJson from '../../../public/age2022.json';

const MyPieChart = ({ chartData, colours } :  { chartData : ChartData[], colours : Colours}) => {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        cx={200}
        cy={100}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={colours[entry.name]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="bottom" align="center" className="mt-10"/>
    </PieChart>
  );
};

const AreaInfo = ({ seatName } : { seatName : string}) => {

    //3989
    // Cast the imported JSON to the correct type
    const seatData: SeatDataCollection = seatDataJson as SeatDataCollection;
    const allEthData: EthDataCollection = ethDataJson as EthDataCollection;
    const allAgeData: AgeDataCollection = ageDataJson as AgeDataCollection;

    const mapData: SeatData | undefined = seatData[seatName];
    const ethData: EthData[] | undefined = allEthData[seatName]; 
    const ageData: AgeData[] | undefined = allAgeData[seatName];

    var electoralData = [];
    var ethChartData = [];
    var ageChartData = [];
    if(mapData != null){
        for(const [key, value] of Object.entries(mapData.partyInfo)){
          electoralData.push({ name: key, value: value.total});
        }
        for(let i = 0; i < 5; i++){
          ethChartData.push({ name: ethData[i].groups,value: Math.round(ethData[i].con_pc * 100)});
        }
        for(let i = 0; i < 6; i++){
          ageChartData.push({ name: ageData[i].age,value: Math.round(ageData[i].con_pc * 100)});
        }
    }

    return (
      <div className="w-full">
        {mapData != null ? 
        <div className="w-full flex items-center flex-col">
          <div className="flex flex-row justify-between">
            <div className="flex items-center flex-col">
              <h2>Electoral Data</h2>
              <MyPieChart chartData={electoralData} colours={partyColours} />
            </div>
            <div className="flex items-center flex-col">
              <h2>Ethnicity Data</h2>
              <MyPieChart chartData={ethChartData} colours={ethColours} />
            </div>
          </div>
          <div className="flex items-center flex-col">
            <h2>Age Data</h2>
            <MyPieChart chartData={ageChartData} colours={ageColours} />
          </div>
        </div>
        :
        <h1>Select a Constituency on the map to view electoral and demographic data</h1>
        }
      </div>
    );
}

export default AreaInfo