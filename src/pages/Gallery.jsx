import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GalleryItem from "./GalleryItem";
import { SlMagicWand } from "react-icons/sl";
import { PiSmileyNervousThin } from "react-icons/pi";

function Gallery() {
  const [searchCategory, setSearchCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, src: "/images/01.jpg", thumbnail: "/images/01-thumb.jpg", title: "ימי הולדת", category: "אירועים", price: 100, modelNumber: "A101", views: 52 },
    { id: 2, src: "/images/02.jpg", thumbnail: "/images/02-thumb.jpg", title: "חתונות", category: "אירועים", price: 200, modelNumber: "B202", views: 34 },
    { id: 3, src: "/images/04.jpg", thumbnail: "/images/04-thumb.jpg", title: "תינוקות", category: "צילום", price: 150, modelNumber: "C303", views: 21 },
    { id: 4, src: "/images/logo.jpg", thumbnail: "/images/logo-thumb.jpg", title: "רקעים", category: "עיצוב", price: 50, modelNumber: "D404", views: 17 },
    { id: 5, src: "/images/06.jpg", thumbnail: "/images/06-thumb.jpg", title: "מרכזי שולחן", category: "קישוטים", price: 80, modelNumber: "E505", views: 45 },
    { id: 6, src: "/images/07.jpg", thumbnail: "/images/07-thumb.jpg", title: "אירועים", category: "אירועים", price: 120, modelNumber: "F606", views: 29 },
    { id: 7, src: "/images/08.jpg", thumbnail: "/images/08-thumb.jpg", title: "שערים", category: "קישוטים", price: 130, modelNumber: "G707", views: 38 },
  ];

  // רשימת קטגוריות ייחודית מתוך התמונות
  const categories = [...new Set(images.map(img => img.category))];

  // סינון תמונות
  const filteredImages = images.filter(img => {
    const matchesCategory = searchCategory ? img.category === searchCategory : true;
    const matchesMinPrice = minPrice ? img.price >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? img.price <= Number(maxPrice) : true;
    return matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <>
      <Header />

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
              className="form-control w-100 "
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <option value="">הכל</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat} >{cat}</option>
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
          {filteredImages.length > 0 ? (
            filteredImages.map((img) => (
              <GalleryItem key={img.id} image={img} openModal={setSelectedImage} />
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

      {/* Modal Inline */}
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
          
          onClick={() =>  setSelectedImage(null)}
        >
          <div
            className="modal-content d-flex flex-column bg-white rounded p-3"
            style={{
              position: "relative",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90%",
              overflow: "auto",
              animation: "fadeIn 0.3s"
            }}
            onClick={(e) => e.stopPropagation()}

          >
            {/* תמונה ראשית */}
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              style={{ width: "100%", objectFit: "contain", marginBottom: "1rem" }}
            />

            {/* כותרת התמונה */}
            <h5 className="text-center mb-3">{selectedImage.title}</h5>

            {/* פרטי הדגם בשורה אחת */}
            <div
              className="d-flex justify-content-between mb-3"
              style={{ fontSize: "0.95rem" }}
            >
              <span>#{selectedImage.modelNumber}</span>
              <span>{selectedImage.category}</span>
              <span>{selectedImage.price} ₪</span>
              <span>צפיות: {selectedImage.views}</span>
            </div>

            {/* כפתור הזמנה בתחתית */}
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

      <Footer />
    </>
  );
}

export default Gallery;
