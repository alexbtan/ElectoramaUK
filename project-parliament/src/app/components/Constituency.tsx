"use client";

import React, { useEffect, useState } from 'react';

const Constituency = ({name}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var response = await fetch(`https://members-api.parliament.uk/api/Location/Constituency/Search?searchText=${name}&skip=0&take=1`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });
        response = await fetch(`https://members-api.parliament.uk/api/Location/Constituency/3989/Representations`, {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        var p = 1;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>TEMP Constituency Search Results</h1>
      <h1>{data.value[0].member.value.nameDisplayAs}</h1>
      <img src={data.value[0].member.value.thumbnailUrl} alt={'MP Photo not found'} style={{ width: '100%', height: 'auto' }} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Constituency;