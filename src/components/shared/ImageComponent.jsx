import React from 'react';
import { ImagePath } from '../utility/ImagesPath'

const ImageComponent = ({ name, className }) => {
  return (
    <img src={ImagePath[name]} alt={name} className={className} />
  );
};
export default ImageComponent;