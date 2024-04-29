"use client";

import React, { useEffect, useState } from "react";
import parseCSV from "../../utils/csvParser";
import RealEstateItem, { RealEstate } from "../RealEstateItem/RealEstateItem";
import Pagination from "../Pagination/Pagination";

const RealEstateList = () => {
  const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const data = await parseCSV();
      setRealEstates(data);
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = realEstates.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {currentItems.map((realEstate) => (
          <RealEstateItem key={realEstate.Id} realEstate={realEstate} />
        ))}
      </div>
      <Pagination
        totalItems={realEstates.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default RealEstateList;
