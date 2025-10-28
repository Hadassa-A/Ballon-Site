import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { BsBalloon } from "react-icons/bs";

function Home() {
  const title = "חגיגה באוויר";

  const [animate, setAnimate] = useState(true);

  // אפקט כדי להפעיל את האנימציה מחדש כל 5 שניות
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 50); // אפס שניות כדי לאתחל את האנימציה
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const style = `
    .dancing-title span {
      display: inline-block;
      animation: ${animate ? "dance 0.6s ease-in-out" : "none"};
      animation-fill-mode: forwards;
    }

    @keyframes dance {
      0% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px) rotate(-5deg);
      }
      60% {
        transform: translateY(5px) rotate(5deg);
      }
      100% {
        transform: translateY(0) rotate(0);
      }
    }

    .space {
      display: inline-block;
      width: 0.5em; /* רווח בין המילים */
    }
  `;

  return (
    <>
      <style>{style}</style>
      <Header />

      <main className="container text-center my-5 ">
        <h1 className="display-5 fw-bold dancing-title">
          {title.split("").map((letter, i) =>
            letter === " " ? (
              <span key={i} className="space">&nbsp;</span>
            ) : (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                {letter}
              </span>
            )
          )}
        </h1>
        <h2 className="h4 mb-3">ברוכים הבאים לעולם הבלונים שלנו</h2>
        <BsBalloon className="fs-3 fs-md-4 fs-lg-5 mb-4" />
        <div id="main_banners">
          <img id="text_main_banners" src="./images/Feel-free-to-lick.png" alt="" />
          <div className="banner"></div>
          <div className="banner"></div>
          <div className="banner"></div>
          <div className="banner"></div>
          <div className="banner"></div>
        </div>

        <h3 className="balloon-animation"> בואו להעיף את החגיגה שלכם לאוויר</h3>

      </main>
      <Footer />
    </>
  );
}

export default Home;
