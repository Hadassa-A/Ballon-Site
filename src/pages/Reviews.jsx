import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RiChatSmileLine } from "react-icons/ri";
import { handleRipple } from "../components/Ripple";
function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "נועה צ.",
      text: "בלונים מהממים! עיצוב מושלם ויחס חם. שדרגו את כל האירוע!",
    },
    {
      id: 2,
      name: "דני כהן",
      text: "ממש התרשמתי מהמקצועיות והיצירתיות. מההתחלה ועד הסוף, הכל היה מתואם בצורה חלקה, והאווירה הייתה בדיוק כמו שחלמנו.",

    },
    {
      id: 3,
      name: "הדס",
      text: "יצירתיות ללא גבולות! הבלונים היו פשוט יצירת אמנות.",
    },
    {
      id: 4,
      name: "נועם יקיר",
      text: "מרוצה מאוד! כל הפרטים הקטנים טופלו בצורה מושלמת, והאווירה הייתה פשוט קסומה. אין לי ספק שאחזור לשירות שלהם גם באירועים הבאים.",

    },
    
    {
      id: 5,
      name: "מיכל שקד",
      text: "חוויתי שירות יוצא מן הכלל! הצוות היה סבלני והקשיב לכל בקשה, והאירוע שלי באמת הפך למיוחד בזכותם. ממליצה בחום לכל מי שמחפש איכות ואמינות.",
    },
    {
      id: 6,
      name: "יונתן ר.",
      text: "דייקנות בזמן, אין דברים כאלה!!!",

    },
    {
      id: 7,
      name: "שרון בן חמו",
      text: "שירות מקצועי, מהיר ואדיב. אני מרגישה שיש כאן דגש אמיתי על איכות ודיוק, וזה ניכר בכל שלב בתהליך.",
    },
    {
      id: 8,
      name: "רועי ד.",
      text: "חוויה בלתי נשכחת! הצוות נתן מעל ומעבר כדי לוודא שהכל יראה מושלם. קיבלנו המון מחמאות מהאורחים, ואני לא יכולה להמליץ מספיק!",
    },
    {
      id: 9,
      name: "נעה ש.",
      text: "שירות מקצועי ואדיב. הכל הגיע בזמן ונראה מדהים!",

    },
    {
      id: 10,
      name: "תמר א.",
      text: "שירות יוצא דופן! הצוות היה קשוב, מקצועי ויצירתי. הבלונים היו פשוט מדהימים!",
    },
    {
      id: 11,
      name: "מיכל ר.",
      text: " הבלונים היו פשוט להיט! כל האורחים התפעלו.",
    },
  ];

  return (
    <>
      <Header />

      <main className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">חוות דעת של לקוחות</h1>
          <h2 className="h4 mb-3">מה הלקוחות שלנו מספרים עלינו </h2>
          <RiChatSmileLine className="fs-3 fs-md-4 fs-lg-5" />
        </div>

        <div className="row g-4" >
          {reviews.map((r) => (
            <div key={r.id} className="col-md-4" onClick={handleRipple}>
              <div className="card h-100 text-center shadow-sm border-0">
                <div
                  className="card-body d-flex flex-column justify-content-between"
                >
                  <p className="card-text">"{r.text}"</p>
                  <h6 className="card-subtitle mt-3 text-muted">- {r.name}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </>
  );
}

export default Reviews;
