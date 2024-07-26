
import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { Context } from '../store/appContext';

import { Modal, Button, Form, InputGroup, FormControl, Carousel } from 'react-bootstrap';
import '../../styles/propertyListing.css';

export const PropertyListing = ({ property, categories, onSaveToCategory, onAddCategory }) => {
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [localCategories, setLocalCategories] = useState(categories);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleSaveListing = () => {
    if (selectedCategory) {
      fetch('/api/addListingToCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingName: {
            propertyId: property.id,
            categoryId: selectedCategory,
            propertyDetails: {
              address: `${property.location.address.line}, ${property.location.address.city}, ${property.location.address.state_code} ${property.location.address.postal_code}`,
              price: `${property.list_price || property.list_price_max}`,
              beds: `${getBedsDescription(property.description.beds, property.description.beds_max)}`,
              baths: `${property.description.baths || property.description.baths_max}`,
              photos: `${property.photos ? property.photos.map(photo => photo.href) : []}`,
            }
          }
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add listing to category');
        }
        return response.json();
      })
      .then(result => {
        onSaveToCategory(property, selectedCategory);
        console.log('Listing added to category successfully:', result);
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };

  const getBedsDescription = (beds, bedsMax) => {
    const bedCount = beds !== null ? beds : bedsMax;
    return bedCount === 0 ? 'Studio' : `${bedCount} beds`;
  };
  
  const handleAddCategory = () => {
    fetch(process.env.BACKEND_URL + "api/create_category", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create category');
        }
        return response.json();
      })
      .then(data => {
        console.log('Category created successfully', data);
        const newCategoryObject = { categoryName: newCategory };
        setLocalCategories([...localCategories, newCategoryObject]);
        onAddCategory(newCategory);
        setSelectedCategory(newCategory);
        setNewCategory('');
      })
      .catch(error => {
        console.error('Error creating category:', error);
      });
  };

  return (
    <div className="property-listing">
      <div className="property-info">
        {property.photos && property.photos.length > 0 && (
          <div className="property-photos">
            <Carousel>
              {property.photos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={photo.href}
                    alt={`Property photo ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}

        <div className='property-meta'>
          <h3>{property.location.address.line}, {property.location.address.city}, {property.location.address.state_code} {property.location.address.postal_code}</h3>
          <div className='property-price'>
            <p>Price: ${property.list_price || property.list_price_max}</p>
          </div>
          <p>{getBedsDescription(property.description.beds, property.description.beds_max)}, {property.description.baths || property.description.baths_max} baths</p>
        </div>
 
        <Button className="add-to-category-btn" onClick={() => setShowModal(true)}>Add to Category</Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategorySelect">
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories?.map((category, index) => (
                  <option key={category.id || index} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <hr />
            <InputGroup className="mb-3">
              <FormControl
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={() => handleAddCategory()}>
                Add
              </Button>
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => handleSaveListing()}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};