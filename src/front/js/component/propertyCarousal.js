import React from 'react';
import { Carousel } from 'react-bootstrap';
import {PropertyListing} from './propertyListing';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export const PropertyCarousal = ({ properties, categories, onSaveToCategory, onAddCategory }) => {
  return (
    <div className="vertical-carousel">
      <Carousel interval={null} indicators={false} controls={true} direction="vertical">
        {properties.map((property, index) => (
          <Carousel.Item key={index}>
            <PropertyListing
              property={property}
              categories={categories}
              onSaveToCategory={onSaveToCategory}
              onAddCategory={onAddCategory}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default PropertyCarousal;