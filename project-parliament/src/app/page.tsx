'use client';

import Image from "next/image";
import ElectoralMap from "./components/ElectoralMap";
import TestMap from "./components/TestMap";
import NavBar from "./components/NavBar";
import AreaInfo from "./components/AreaInfo";
import { useState } from "react";

export default function Home() {

  const [selectedMapData, setSelectedMapData] = useState(null);
  const [selectedSeatName, setSelectedSeatName] = useState(null);
  
  const handleMapClick = (data) => {
    console.log(data);
    setSelectedSeatName(data);
  };

  return (
    <main className="h-screen bg-[#F7DCB9]">
      <NavBar />
      <div className="w-full flex flex-row">
       <ElectoralMap onMapClick={handleMapClick}/>
       <AreaInfo seatName={selectedSeatName}/>
      </div>
    </main>
  );
}
