// pages/about.tsx
import React from 'react';

const Credits = () => {
  return (
    <div>
        <div className="px-5 xl:px-12 py-6 flex flex-col justify-start w-full">
            <h1 className="text-3xl px-4 font-semibold font-heading py-4">Credits</h1>
            <ul className="font-semibold font-heading space-y-6 px-4">
                <li>Inspiration and topojson files: <a className="hover:text-gray-200" href="https://github.com/principalfish/principalfish.github.io">https://github.com/principalfish/principalfish.github.io</a></li>
                <li>The UK Parliament API: <a className="hover:text-gray-200" href="https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence/">https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence/</a></li>
                <li>UK Census data for age (2022): <a className="hover:text-gray-200" href="https://commonslibrary.parliament.uk/constituency-statistics-population-by-age/">https://commonslibrary.parliament.uk/constituency-statistics-population-by-age/</a></li>
                <li>UK Census data for ethnicity (2021): <a className="hover:text-gray-200" href="https://commonslibrary.parliament.uk/constituency-statistics-ethnicity/">https://commonslibrary.parliament.uk/constituency-statistics-ethnicity/</a></li>
            </ul>
        </div>
    </div>
  );
};

export default Credits;