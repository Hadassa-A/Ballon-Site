import React, { useState, useEffect } from "react";
import GalleryItem from "./GalleryItem";
import { SlMagicWand } from "react-icons/sl";
import { PiSmileyNervousThin } from "react-icons/pi";

const API_URL = "http://localhost:5000/api";

function Gallery() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [viewedIds, setViewedIds] = useState(new Set());

  // טעינת נתונים
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`)
        ]);

        const prods = prodRes.ok ? await prodRes.json() : [];
        const cats = catRes.ok ? await catRes.json() : [];

        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error("שגיאה בטעינה:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // סינון
  const filteredProducts = products.filter(p => {
    const matchesCategory = searchCategory ? p.CategoryID === parseInt(searchCategory) : true;
    const matchesMinPrice = minPrice ? p.Price >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? p.Price <= Number(maxPrice) : true;
    return matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  if (loading) {
    return (
      <>
        <main className="container my-5 text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">טוען גלריה...</p>
        </main>
      </>
    );
  }

  return (
    <>

      <main className="container my-5">
        <div className="text-center mb-3">
          <h1 className="display-5 fw-bold">גלריית העבודות שלנו</h1>
          <h2 className="h4 mb-3">קצת מהקסם שיצרנו באירועים שונים</h2>
          <SlMagicWand className="fs-3 fs-md-4 fs-lg-5" />
          <hr className="border-t-2 border-gray-300 mb-4" />
        </div>

        <div className="row mb-4 justify-content-center g-3">
          {/* קטגוריה */}
          <div className="col-12 col-md-3 position-relative">
            <select
              className="form-control w-100"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">הכל</option>
              {categories.map((cat) => (
                <option key={cat.CategoryID} value={cat.CategoryID}>
                  {cat.Name}
                </option>
              ))}
            </select>
            <label className={`input-label ${searchCategory ? "active" : ""}`}>קטגוריה</label>
          </div>

          {/* מחיר מינימום */}
          <div className="col-6 col-md-2 position-relative">
            <input
              type="number"
              className="form-control"
              placeholder=" "
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <label className={`input-label ${minPrice ? "active" : ""}`}>מחיר מינימום</label>
          </div>

          {/* מחיר מקסימום */}
          <div className="col-6 col-md-2 position-relative">
            <input
              type="number"
              className="form-control"
              placeholder=" "
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <label className={`input-label ${maxPrice ? "active" : ""}`}>מחיר מקסימום</label>
          </div>
        </div>

        <div className="row g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <GalleryItem
                key={p.ProductID}
                image={{
                  id: p.ProductID,
                  src: `http://localhost:5000/uploads/${p.Image}`,
                  thumbnail: p.Image,
                  title: p.Title,
                  category: p.CategoryName || "ללא קטגוריה",
                  price: p.Price,
                  modelNumber: p.ModelNumber,
                  views: p.ViewCount || 0
                }}
                openModal={(image) => {
                  if (!viewedIds.has(image.id)) {
                    setViewedIds(prev => new Set(prev).add(image.id));
                    fetch(`${API_URL}/products/${image.id}/view`, { method: "POST" }).catch(() => { });
                  }
                  setSelectedImage({ ...image, views: (image.views || 0) + 1 });
                }}
              />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <PiSmileyNervousThin className="fs-3 fs-md-4 fs-lg-5" />
              <p className="fs-5 text-muted">
                אופסס, אין לנו מוצרים תואמים לחיפוש...
              </p>
              <hr className="border-t-2 border-gray-300 mb-4" />
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedImage && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="modal-content d-flex flex-column bg-white rounded p-3"
            style={{
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90%",
              overflow: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              style={{ width: "100%", objectFit: "contain", marginBottom: "1rem" }}
            />

            <h5 className="text-center mb-3">{selectedImage.title}</h5>

            <div className="d-flex justify-content-between mb-3" style={{ fontSize: "0.95rem" }}>
              <span>#{selectedImage.modelNumber}</span>
              <span>{selectedImage.category}</span>
              <span>{selectedImage.price} ₪</span>
              <span>צפיות: {selectedImage.views}</span>
            </div>

            <button
              className="btn btn-primary w-100 mt-auto"
              onClick={() =>
                window.location.href = `/contact?model=${selectedImage.modelNumber}&title=${selectedImage.title}&category=${selectedImage.category}&thumb=${selectedImage.thumbnail}`
              }
            >
              כזה אני רוצה!!!
            </button>
          </div>
        </div>
      )}

    </>
  );
}

export default Gallery;