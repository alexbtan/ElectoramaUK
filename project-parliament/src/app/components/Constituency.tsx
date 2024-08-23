"use client";

import React, { useEffect, useState } from 'react';

const Constituency = ({seatName} : {seatName : string}) => {
  const [data, setData] = useState<Data | null>(null);
  const [desc, setDesc] = useState<Desc | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var response = await fetch(`https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=${seatName}&skip=0&take=1`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });
        var conData = await response.json();
        var id = conData.items[0].value.id;
  
        response = await fetch(`https://members-api.parliament.uk/api/Location/Constituency/${id}/Representations`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        sessionStorage.setItem(seatName, JSON.stringify(result));
        setData(result);

        response = await fetch(`https://members-api.parliament.uk/api/Location/Constituency/${id}/Synopsis`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result2 = await response.json();
        sessionStorage.setItem(seatName + "desc", JSON.stringify(result));
        setDesc(result2);
      } catch (error) {
        console.error(error);
      }
    };
    if(seatName != "Select a Constituency"){
      const cachedData = sessionStorage.getItem(seatName);
      const cachedDesc = sessionStorage.getItem(seatName + "desc");
      if (cachedData && cachedDesc) {
        setData(JSON.parse(cachedData));
        setDesc(JSON.parse(cachedDesc));
      } else {
        fetchData();
      };
    }
  }, [seatName]);

  return (
    <div>
      {data != null && desc != null ? 
      <div className="flex items-center flex-col">
          <h1 className="font-bold mt-8 text-5xl">{seatName}</h1>
          <div className="flex flex-row">
            <div className="w-full md:w-2/5 lg:w-1/2 px-4 text-center md:text-left lg:pl-12">
              <h3 className="font-bold mt-16 text-xl md:mt-0 sm:text-2xl">
                {data.value[0].member.value.nameDisplayAs}
              </h3>
              <div className="sm:text-lg mt-6" dangerouslySetInnerHTML={{ __html: desc.value }}></div>
            </div>
            <img className="block select-none mx-auto bg-gray-300 transition-colors duration-300 rounded-full w-[240px]" src={data.value[0].member.value.thumbnailUrl} alt={'MP Photo not found'}/>
          </div>
        </div> :
        <div>Select a Constituency on the map to view constituency data</div>
      }
    </div>
  );
};

export default Constituency;