import React, { useState, useEffect } from 'react';
import CatImageUrl from "../../img/CHitchEN winGs.png";

import { Link } from 'react-router-dom';

export const Category = () => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const response = await fetch(process.env.BACKEND_URL + "api/categories");
        if (response.ok) {
            const data = await response.json();
            setCategories(data);
        } else {
            console.error('Failed to fetch categories:', response.status);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    
    return (
    <div>
        <div className="App">
            <div className="container mt-5">
                <div className="card-deck">
                    {categories.map(category => (
                        <a href={`/categories/${category.id}`}>
                            <div className="card mb-3" key={category.id}>
                                <div className="card-body">
                                    <img src={CatImageUrl}/>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
                
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
        modal body
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-success">Create Category</button>
      </div>
    </div>
  </div>
</div>
                {/* <div className="mt-4">
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
                </div> */}
            </div>
        </div>
    </div>
    );
};