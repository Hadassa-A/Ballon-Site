import React from "react";
import { useNavigate } from "react-router-dom";

function GalleryItem({ image, openModal }) {
  const navigate = useNavigate();

  const handleContactClick = (e) => {
    e.stopPropagation(); // מונע פתיחת מודאל

    // URL עם פרמטרים
    const params = new URLSearchParams({
      model: image.modelNumber,
      title: image.title,
      category: image.category,
      thumb: image.thumbnail // שם הקובץ בלבד!
    });

    navigate(`/contact?${params.toString()}`);
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div
        className="card h-100 shadow-sm d-flex flex-column"
        style={{
          cursor: "pointer",
          overflow: "hidden",
          transition: "transform 0.3s ease"
        }}
        onClick={() => openModal(image)}
      >
        {/* תמונה */}
        <img
          src={image.src}
          className="card-img-top"
          alt={image.title}
          loading="lazy"
          style={{
            objectFit: "cover",
            height: "250px",
            width: "100%",
            transition: "transform 0.3s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {/* כותרת */}
        <h5 className="text-center my-2">{image.title}</h5>

        {/* פרטים */}
        <div className="d-flex justify-content-between px-3 mb-3" style={{ fontSize: "0.9rem" }}>
          <span>{image.category}</span>
          <span>{image.modelNumber}</span>
          <span>{image.price} ₪</span>
          <span>{image.views} אנשים צפו בי</span>
        </div>

        {/* כפתור */}
        <div className="mt-auto px-3 pb-3">
          <button
            className="btn btn-primary w-100"
            onClick={handleContactClick}
          >
            כזה אני רוצה!!!
          </button>
        </div>
      </div>
    </div>
  );
}

export default GalleryItem;