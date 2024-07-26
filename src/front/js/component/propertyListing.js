import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Modal, Button, Form, InputGroup, FormControl, Carousel } from 'react-bootstrap';
import '../../styles/propertyListing.css';

export const PropertyListing = ({ property, categories, onSaveToCategory, onAddCategory }) => {
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
          propertyId: property.id, // Assuming property has an id
          categoryId: selectedCategory.id, // Assuming selectedCategory has an id
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
  
  // JP added this
  const [listCategories, setListCategories] = useState([]);
  const fetchCategories = async () => {
    const response = await fetch(process.env.BACKEND_URL + "api/categories");
    if (response.ok) {
        const data = await response.json();
        console.log('Categories successfully gotten');
        setListCategories(data);
    } else {
        console.error('Failed to fetch categories:', response.status);
    }
  };

  

  const handleAddCategory = () => {
    // Get the token from sessionStorage
    // const token = sessionStorage.getItem('token');

    // Make an API call to Flask backend
    fetch(process.env.BACKEND_URL + "api/create_category", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // Ensure there's a space after 'Bearer'
      },
      body: JSON.stringify({ name: newCategory }),
    })
      .then(response => {
        if (response.ok) {
          // Category created successfully
          console.log('Category created successfully',response);
          // Reset the input field
          onAddCategory(newCategory);
          setSelectedCategory(newCategory);
          setNewCategory('');
          fetchCategories();
        } 
      })
      .catch(error => {
        console.log('Error creating category:', error);
      });
  }; // Close the handleAddCategory function here

  useLayoutEffect(() => {
    fetchCategories();
    handleAddCategory();
}, [categories]);

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
    </div >
  );
};