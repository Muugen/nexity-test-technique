import React, { useState, useEffect } from "react";

export interface RealEstate {
  City: string;
  Id: string;
  Latitude: string;
  Longitude: string;
  Name: string;
  NbRoomsMax: number;
  NbRoomsMin: number;
  Picture: string;
  PostalCode: string;
  Price: number;
}

interface RealEstateItemProps {
  realEstate: RealEstate;
}

const RealEstateItem: React.FC<RealEstateItemProps> = ({ realEstate }) => {
  const {
    Name,
    Picture,
    City,
    PostalCode,
    Price,
    Latitude,
    Longitude,
    NbRoomsMin,
    NbRoomsMax,
  } = realEstate;

  const [imageError, setImageError] = useState(false);
  const [transportIcon, setTransportIcon] = useState<string>("");
  const [transportData, setTransportData] = useState<{ ligne: string } | null>(
    null
  );
  const [isFavorited, setIsFavorited] = useState(false);

  const handleHeartClick = () => {
    setIsFavorited(!isFavorited);
  };

  const getTransportData = async (latitude: string, longitude: string) => {
    const url = `https://preprod.kitlenid.fr/api/transport?lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      // Extract the ligne value from the data
      const ligne = data[0]?.ligne;
      // Return an object that only includes the ligne value
      return { ligne };
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const determineTransportIcon = (ligne: string | undefined) => {
    let icon = "";
    if (ligne && ligne.startsWith("M")) {
      icon = `svg/transports/Paris_transit_icons_-_Métro_${ligne.replace(
        "M",
        ""
      )}.svg`;
    } else if (ligne && ligne.startsWith("RER")) {
      icon = `svg/transports/Paris_transit_icons_-_RER_${ligne.replace(
        "RER ",
        ""
      )}.svg`;
    } else if (ligne && ligne.startsWith("Transilien")) {
      icon = `svg/transports/Paris_transit_icons_-_Train_${ligne.replace(
        "Transilien ",
        ""
      )}.svg`;
    } else if (ligne && ligne.startsWith("T")) {
      icon = `svg/transports/Paris_transit_icons_-_Tram_${ligne.replace(
        "T ",
        ""
      )}.svg`;
    } else {
      icon = "svg/transports/Paris_transit_icons_-_Train.svg";
    }

    return icon;
  };

  useEffect(() => {
    const fetchTransportData = async () => {
      const data = await getTransportData(Latitude, Longitude);
      setTransportData(data);
    };

    fetchTransportData();
  }, [Latitude, Longitude]);

  useEffect(() => {
    if (transportData) {
      const icon = determineTransportIcon(transportData.ligne);
      setTransportIcon(icon);
    }
  }, [transportData]);

  const determineLoans = (Price: number) => {
    let loans = Price / 250;
    return loans;
  };

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
        <div className="flex overflow-auto no-scrollbar gap-4 my-2">
          {transportData && (
            <div className="flex flex-col items-center flex-shrink-0">
              <img
                alt="Transport Icon"
                className="size-6"
                src={transportIcon}
              />
            </div>
          )}
        </div>
        <p className="text-primary-title text-xs font-normal">
          <img src="svg/Copy.svg" alt="Copy" className="w-4 h-4 inline-block" />
          <span className="text-blue-dark ml-2">
            {NbRoomsMin === NbRoomsMax && NbRoomsMin === 1
              ? "studio"
              : `de ${NbRoomsMin} à ${NbRoomsMax} pièces`}
          </span>
        </p>
        <p className="text-primary-title text-xs font-normal">
          <img src="svg/Crop.svg" alt="Crop" className="w-4 h-4 inline-block" />
          <span className="text-blue-light text-foreground ml-2 mr-2">
            à partir de{" "}
            <span className="text-blue-dark">
              <b>{`${Price} €`}</b>
            </span>
          </span>
        </p>
        <p className="text-primary-title text-xs font-normal">
          <img
            src="svg/Money.svg"
            alt="Money"
            className="w-4 h-4 inline-block"
          />
          <span className="text-blue text-foreground ml-2 mr-2">
            soit <b>{determineLoans(Price)} €/mois</b>
          </span>
        </p>
      </div>
      <div className="absolute bottom-1.5 right-2">
        <button
          className="relative hover:opacity-80 transition z-10 cursor-pointer"
          onClick={handleHeartClick}
        >
          <img
            className="inline-block w-8 h-8"
            src={isFavorited ? "svg/CoeurPlein.svg" : "svg/CoeurVide.svg"}
            alt={isFavorited ? "CoeurPlein" : "CoeurVide"}
          />
        </button>
      </div>
    </div>
  );
};

export default RealEstateItem;
