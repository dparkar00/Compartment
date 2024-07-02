import React, { useState } from 'react';
import { Context } from '../store/appContext';

export const CreateCategory = () => {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleCreateCategory = () => {
        // Make an API call to Flask backend
        fetch('/api/create_category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryName: newCategoryName }),
        })
        .then(response => {
            if (response.ok) {
                // Category created successfully
                console.log('Category created successfully');
                // Optionally, reset the input field
                setNewCategoryName('');
            } else {
                // Handle error response from server
                console.error('Failed to create category');
            }
        })
        .catch(error => {
            console.error('Error creating category:', error);
        });
    };

    return (
        <div>
            {/* <!-- Button trigger modal --> */}
            <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
                Create New Category
            </button>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                            <button type="button" className="close btn btn-danger" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                            <div className="modal-body">
                                <div className="mt-4">
                                    <h5>Create New Category</h5>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Category Name"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="button" onClick={handleCreateCategory}>
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/* <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-success">Create Category</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}