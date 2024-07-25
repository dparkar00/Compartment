import React, { useState, useEffect } from 'react';
import CatImageUrl from "../../img/CHitchEN winGs.png";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const CategoryFavorites = () => {
  const [categories, setCategories] = useState([]);
  const { category } = useParams();

  const fetchCategories = async () => {
    const response = await fetch(process.env.BACKEND_URL + "api/categories");
    if (response.ok) {
      const data = await response.json();
      const thisCategory = data.find((cat) => cat.id == category);
      if (thisCategory) {
        setCategories([thisCategory]);
      }
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
              <div className="card mb-3" key={category.id}>
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/categories/${category.id}`}>
                      <img src={CatImageUrl} alt="Category" />
                    </Link>
                  </h5>
                </div>
                <div className="card-footer">
                  <ul className="list-unstyled">
                    {category.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

