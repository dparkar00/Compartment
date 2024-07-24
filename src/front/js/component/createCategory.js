import React, { useState } from 'react';

export const CreateCategory = () => {
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const handleCreateCategory = () => {
        // Make an API call to Flask backend
        fetch(process.env.BACKEND_URL + "api/create_category", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newCategory }),
        })
        .then(response => {
            if (response.ok) {
                // Category created successfully
                console.log('Category created successfully');
                // Reset the input field
                setNewCategory('');
            } else {
                // Handle error response from server
                console.error('Failed to create category');
            }
        })
        .catch(error => {
            console.error('Error creating category:', error);
        });

        fetch(process.env.BACKEND_URL + "api/categories")
            .then(response => {
                if (!response.ok) {
                    console.error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('reFetch error:', error);
            })
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
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="button" onClick={handleCreateCategory; window.location.reload()}>
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



// front end for creating new entry in database
// import React, { useState } from 'react';

// const AddListingForm = () => {
//     const [listingName, setListingName] = useState('');
//     const [cid, setCid] = useState('');

//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         try {
//             const response = await fetch('http://localhost:5000/add_listing', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     cid: cid,
//                     listingName: listingName
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to add listing');
//             }

//             const responseData = await response.json();
//             console.log(responseData.message);  // Success message

//         } catch (error) {
//             console.error('Error adding listing:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 value={listingName}
//                 onChange={(e) => setListingName(e.target.value)}
//                 placeholder="Listing Name"
//                 required
//             />
//             <input
//                 type="number"
//                 value={cid}
//                 onChange={(e) => setCid(e.target.value)}
//                 placeholder="Category ID"
//                 required
//             />
//             <button type="submit">Add Listing</button>
//         </form>
//     );
// };

// export default AddListingForm;