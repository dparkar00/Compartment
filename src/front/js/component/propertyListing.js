import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Modal, Button, Form, InputGroup, FormControl, Carousel } from 'react-bootstrap';

export const PropertyListing = ({ property, categories, onSaveToCategory, onAddCategory }) => {
  const {store, actions} = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSaveListing = () => {
    if (selectedCategory) {
      const response =  fetch('/api/addListingToCategory', {
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
      });
      if (!response.ok) {
        throw new Error('Failed to add listing to category');
      }
      const result =  response.json();
      // If the API call was successful, then call onSaveToCategory
      onSaveToCategory(property, selectedCategory);
      // Optionally, you can show a success message here
      console.log('Listing added to category successfully:', result);
    }
    setShowModal(false);
  };

  const getBedsDescription = (beds, bedsMax) => {
    const bedCount = beds !== null ? beds : bedsMax;
    return bedCount === 0 ? 'Studio' : `${bedCount} beds`;
  };
  
  const handleAddCategory = () => {
    // Get the token from sessionStorage
    const token = sessionStorage.getItem('token');

    // Make an API call to Flask backend
    fetch(process.env.BACKEND_URL + "api/create_category", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Ensure there's a space after 'Bearer'
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then(response => {
        if (response.ok) {
          // Category created successfully
          console.log('Category created successfully');
          // Reset the input field
          onAddCategory(data.name || newCategory);
          setSelectedCategory(data.name || newCategory);
          setNewCategory('');
        } else {
          // Handle error response from server
          console.error('Failed to create category');
        }
      })
      .catch(error => {
        console.error('Error creating category:', error);
      });
  }; // Close the handleAddCategory function here

  return (
    <div>
      <h3>{property.location.address.line}, {property.location.address.city}, {property.location.address.state_code} {property.location.address.postal_code}</h3>
      <p>Price: ${property.list_price || property.list_price_max}</p>
      <p>{getBedsDescription(property.description.beds, property.description.beds_max)}, {property.description.baths || property.description.baths_max} baths</p>
      {property.photos && property.photos.length > 0 && (
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
      )}
      <Button onClick={() => setShowModal(true)}>Add to Category</Button>

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
                {store.categories?.map((category, index) => (
                  <option key={index} value={category.id}>
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
              <Button variant="outline-secondary" onClick={() => actions.handleCreateCategory(newCategory)}>
                Add
              </Button>
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveListing}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};