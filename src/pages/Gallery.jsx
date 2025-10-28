import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GalleryItem from "./GalleryItem";
import { SlMagicWand } from "react-icons/sl";

function Gallery() {
  const images = [
    { id: 1, src: "/images/01.jpg", title: "ימי הולדת" },
    { id: 2, src: "/images/02.jpg", title: "חתונות" },
    { id: 3, src: "/images/04.jpg", title: "תינוקות" },
    { id: 4, src: "/images/logo.jpg", title: "רקעים" },
    { id: 5, src: "/images/06.jpg", title: "מרכזי שולחן" },
    { id: 6, src: "/images/07.jpg", title: "אירועים" },
    { id: 7, src: "/images/08.jpg", title: "שערים" },
  ];

  return (
    <>
      <Header />

      <main className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">גלריית העבודות שלנו</h1>
          <h2 className="h4 mb-3">קצת מהקסם שיצרנו באירועים שונים </h2>
          <SlMagicWand className="fs-3 fs-md-4 fs-lg-5" />
        </div>

        <div className="row g-4">
          {images.map((img) => (
            <GalleryItem key={img.id} image={img} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Gallery;
