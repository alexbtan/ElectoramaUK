'use client';

import { useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import ElectoralMap from "./components/ElectoralMap";
import NavBar from "./components/NavBar";
import AreaInfo from "./components/AreaInfo";
import Constituency from "./components/Constituency";

export default function Home() {

  const [selectedSeatName, setSelectedSeatName] = useState("Select a Constituency");
  
  const handleMapClick = (seatName : string) => {
    setSelectedSeatName(seatName);
  };

  return (
    <main className="h-screen bg-[#F7DCB9]">
      <NavBar />
      <div className="w-full flex flex-row">
       <ElectoralMap onMapClick={handleMapClick}/>
       <div className="w-full flex flex-col items-center">
          <h1 className="font-bold my-8 text-5xl">{selectedSeatName}</h1>
          <Tabs className="w-full" value="html">
            <TabsHeader>
              <Tab key="data" value="data">
                Constituency Data
              </Tab>
              <Tab key="info"  value="info">
                Constituency Information
              </Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel key="data" value="data">
                <AreaInfo seatName={selectedSeatName}/>
              </TabPanel>
              <TabPanel  key="info"  value="info">
                {/* <Constituency seatName={selectedSeatName}/> */}
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
