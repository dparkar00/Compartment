import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, FormControl, Carousel } from 'react-bootstrap';
import '../../styles/propertyListing.css';

export const PropertyListing = ({ property, categories, onSaveToCategory, onAddCategory }) => {
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSave = () => {
    if (selectedCategory) {
    // try {
    //   // First, call the API to add the listing to the category
    //   const response = await fetch('/api/addListingToCategory', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       propertyId: property.id, // Assuming property has an id
    //       categoryId: selectedCategory.id, // Assuming selectedCategory has an id
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to add listing to category');
    //   }

    //   const result = await response.json();

    //   // If the API call was successful, then call onSaveToCategory
    //   onSaveToCategory(property, selectedCategory);

    //   // Optionally, you can show a success message here
    //   console.log('Listing added to category successfully:', result);

    // // } catch (error) {
    // //   // Handle any errors here
    // //   console.error('Error adding listing to category:', error);
    // //   // Optionally, you can show an error message to the user
    // }
    }
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

  // const addToCategory = () => {
  //   const token = sessionStorage.getItem('token'); // Retrieve the JWT token from sessionStorage

  //   return fetch(process.env.BACKEND_URL + "api/categories", {
  //       method: 'GET',
  //       headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}` // Include the JWT token in the Authorization header
  //       }
  //   })
  //   .then(response => {
  //       if (!response.ok) {
  //           return response.json().then(data => {
  //               throw new Error(data.error || 'Failed to fetch categories');
  //           });
  //       }
  //       return response.json();
  //   })
  //   .then(data => {
  //       setPropertyCategories(data);
  //       console.log('Fetched categories:', data);
  //       return data; // Return the fetched categories data
  //   })
  //   .catch(error => {
  //       console.error('Error fetching categories:', error.message);
  //       // Optionally, you can handle the error by displaying a message to the user
  //   });
  // };

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
      <div className='property-price'>
        <p>Price: ${property.list_price || property.list_price_max}</p>
      </div>

      <div className='property-meta'>
            
    <h3>{property.location.address.line}, {property.location.address.city}, {property.location.address.state_code} {property.location.address.postal_code}</h3>
    
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
              <Button variant="outline-secondary" onClick={handleAddCategory}>
                Add
              </Button>
            </InputGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};