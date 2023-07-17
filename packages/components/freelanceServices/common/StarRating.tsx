import React from "react";

import star from "../../../../assets/icons/yellow-star.svg";
import { SVG } from "../../SVG";

export const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <>
      {[...Array(Math.floor(rating))].map((x, i) => (
        <SVG key={i} source={star} width={24} height={24} />
      ))}
    </>
  );
};
