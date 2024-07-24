import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';

export const PropertyListing = () => {
    const [showModal, setShowModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');


    const handleSave = () => {
        if (selectedCategory) {
            onSaveToCategory(property, selectedCategory);
        }
        setShowModal(false);
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            onAddCategory(newCategory);
            setSelectedCategory(newCategory);
            setNewCategory('');
        }
    };

    return (
        <div>
            <h3>{property.location.address.line}, {property.location.address.city}, {property.location.address.state_code} {property.location.address.postal_code}</h3>
            <p>Price: ${property.list_price}</p>
            <p>{property.description.beds || property.description.beds_max} beds, {property.description.baths || property.description.baths_max} baths</p>
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
                                {categories?.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
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
                            <InputGroup.Append>
                                <Button onClick={handleAddCategory}>Add</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}