import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { IoPeopleOutline } from "react-icons/io5";
import { PiHeartStraightThin } from "react-icons/pi";
import  { useEffect } from "react";

function About() {
 const features = [
  "ניסיון רב באירועים פרטיים ועסקיים",
  "עיצובים מקוריים בהתאמה אישית",
  "הדפסות על בלונים באיכות גבוהה",
  "שירות מקצועי עם חיוך",
  "הובלה והתקנה לכל חלקי הארץ",
  "ליווי אישי צמוד לכל לקוח",
  "שימוש בחומרים איכותיים ובטיחותיים",
  "תשומת לב מדויקת לכל פרט קטן",
  "יצירת אווירה ייחודית ומרגשת בכל אירוע",
  "אפשרויות עיצוב מגוונות לכל גיל וסגנון",
  "עמידה מלאה בלוחות זמנים",
  "התאמה לתקציב הלקוח ולצרכיו",
  "חדשנות ויצירתיות בכל עיצוב",
  "מענה מהיר וזמינות גבוהה",
  "תוצאה סופית שמייצרת אפקט וואו אמיתי"
];

 useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const img = document.querySelector(".img_logo");
      if (img) {
        // סיבוב לפי הגלילה
        img.style.transform = `rotate(${scrollY * -0.20}deg)`; // אפשר לשנות את ה־0.25 למהירות שונה
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>

      <main className="container my-5">
        {/* כותרת */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">קצת עלינו</h1>
          <h2 className="h4 mb-3">
            חגיגה באוויר! מעיפים לכם את האירוע לגבהים!!!
          </h2>
          <IoPeopleOutline className="fs-3 fs-md-4 fs-lg-5" />
        </div>

        {/* תוכן עם תמונה וטקסט */}
        <div className="row align-items-center mb-4">
          <div className="col-md-5 mb-4 mb-md-0 cover_to_logo">
            <img
              src="/images/logo_no_background.png"
              alt="עיצוב בלונים"
              className="img-fluid img_logo"
            />
          </div>
          <div className="col-md-7">
            <h2 className="h4 mb-3">החזון שלנו</h2>
            <hr className="border-t-2 border-gray-300 mb-4" />
            <p className="mb-3">
              אנו מאמינים שכל אירוע, בין אם מדובר במסיבה קטנה ואינטימית, יום הולדת מלא שמחה, ברית או בת מצווה, או אירוע גדול ומרשים, יכול להפוך לבלתי נשכח ומיוחד במינו כאשר מוסיפים לו נגיעת צבע, צורה ושמחה שמביאים הבלונים. הבלונים אינם רק פריט דקורטיבי – הם יוצרים אווירה ייחודית, מעוררים חיוכים, משמחים את הלב ומסמנים רגעים חשובים בדרך בלתי רגילה.
              בכל אירוע שאנו מעצבים, אנו משקיעים מחשבה רבה ביצירת קומבינציות צבעים מקוריות, עיצובים שמותאמים למיקום ולסגנון האירוע, וליווי אישי שמבטיח שהכל יתבצע בצורה חלקה ומדויקת. היצירתיות שלנו משולבת עם תשומת לב לפרטים הקטנים ביותר, כדי שכל לקוח ירגיש שהאירוע שלו באמת ייחודי ושונה מכל מה שכבר ראה.
            </p>
          </div>
        </div>

        {/* סליידר קוביות גלילה אופקית */}
        <div className="mb-5">
          <h2 className="h4 mt-4 mb-3">למה לבחור בנו?</h2>
          <hr className="border-t-2 border-gray-300 mb-4" />

          <div className="slider-container">
            {features.map((feature, idx) => (

              <div key={idx} className="slider-item">
                <PiHeartStraightThin className=" fs-md-4 fs-lg-5 "
                style={{ color: "var(--color-bg-base-pink)" }} />

                <p>{feature}</p>
              </div>
            ))}
          </div>
        </div>


      </main>


    </>
  );
}

export default About;
