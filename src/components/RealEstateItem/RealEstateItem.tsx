import React, { useState, useEffect } from "react";
import Copy from "/public/svg/Copy.svg";

export interface RealEstate {
  City: string;
  Id: string;
  Latitude: string;
  Longitude: string;
  Name: string;
  NbRoomsMax: string;
  NbRoomsMin: string;
  Picture: string;
  PostalCode: string;
  Price: string;
}

interface RealEstateItemProps {
  realEstate: RealEstate;
}

const RealEstateItem: React.FC<RealEstateItemProps> = ({ realEstate }) => {
  const { Id, Name, Picture, City, PostalCode, Price, Latitude, Longitude } =
    realEstate;

  const getTransportData = async (latitude: string, longitude: string) => {
    const url = `https://preprod.kitlenid.fr/api/transport?lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const [transportData, setTransportData] = useState<any>(null);

  useEffect(() => {
    const fetchTransportData = async () => {
      const data = await getTransportData(Latitude, Longitude);
      setTransportData(data);
    };

    fetchTransportData();
  }, [Latitude, Longitude]);

  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex justify-start items-start gap-4 w-full py-4 px-3 relative cursor-pointer overflow-hidden bg-off-white border-2 border-stroke rounded-xl">
      <div className="bg-off-white rounded-xl min-w-32 w-1/3 max-h-32 h-full  flex-shrink-0">
        <img
          src={
            imageError ? "/medias/default-property.jpeg" : `/medias/${Picture}`
          }
          alt={Name}
          className="w-full h-full object-cover transition rounded-xl"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="text-xs font-title truncate">
        <h3 className="text-blue-dark text-lg font-bold truncate">{Name}</h3>
        <h3 className="text-blue-light text-foreground mb-1">
          {PostalCode} {City}
        </h3>
        {transportData && transportData.nearest_station && (
          <p className="text-gray-700">
            {transportData.nearest_station.name} -{" "}
            {transportData.nearest_station.distance}m
          </p>
        )}
        <p className="text-primary-title text-xs font-normal">
          <img src={Copy} alt="Copy" className="w-4 h-4 inline-block" />
          <span className="text-blue-dark ml-2">kekw</span>
        </p>
        <p className="font-semibold">
          <img src={Copy} alt="Copy" className="w-4 h-4 inline-block" />
          <span className="text-blue-light text-foreground ml-2 mr-1">
            à partir de
          </span>
          <span className="text-blue-dark whitespace-nowrap">{Price} €</span>
        </p>
      </div>
    </div>
  );
};

export default RealEstateItem;
