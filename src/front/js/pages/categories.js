import React, { useState, useEffect } from 'react';
import CatImageUrl from "../../img/CHitchEN winGs.png";

import { Link } from 'react-router-dom';

import { CreateCategory } from '../component/createCategory';

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
            </div>
        </div>
        <CreateCategory/>
    </div>
    );
};