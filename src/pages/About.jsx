import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoPeopleOutline } from "react-icons/io5";

function About() {
  return (
    <>
      <Header />

      <main className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">קצת עלינו</h1>
          <h2 className="h4 mb-3">
            חגיגה באוויר! מעיפים לכם את האירוע לגבהים!!!
          </h2>
          <IoPeopleOutline className="fs-3 fs-md-4 fs-lg-5" />
        </div>

        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/images/04.jpg"
              alt="עיצוב בלונים"
              className="img-fluid rounded shadow-sm"
            />
          </div>

          <div className="col-md-6">
            <h2 className="h4 mb-3">החזון שלנו</h2>
            <p className="mb-3">
              אנו מאמינים שכל אירוע יכול להפוך לבלתי נשכח עם נגיעת הצבע, הצורה והשמחה 
              שמביאים הבלונים. בעזרת היצירתיות, הדיוק והשירות האישי שלנו — אנחנו מגשימים 
              חלומות צבעוניים.
            </p>

            <h2 className="h4 mt-4 mb-3">למה לבחור בנו?</h2>
            <ul className="list-group list-group-flush">
              <li className="list-group-item"> ניסיון רב באירועים פרטיים ועסקיים</li>
              <li className="list-group-item"> עיצובים מקוריים בהתאמה אישית</li>
              <li className="list-group-item"> הדפסות על בלונים</li>
              <li className="list-group-item"> שירות מקצועי עם חיוך</li>
              <li className="list-group-item"> הובלה והתקנה לכל הארץ</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default About;
