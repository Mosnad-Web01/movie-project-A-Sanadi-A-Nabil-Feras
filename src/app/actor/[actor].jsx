import React, { useState, useEffect } from "react";
import moment from "moment";
import Link from "next/link"; 
import api from "../../services/api"; 
import { GetImage } from "../../functions/utils";

// مكون صفحة الممثل
export default async function ActorPage({ params }) {
  // حالة التحميل (true: جار التحميل، false: تم التحميل)
  const [loading, setLoading] = useState(true); 
  // حالة بيانات الممثل
  const [details, setDetails] = useState({}); 
  // معرف الممثل من الرابط 
  const id = params.id;

  // دالة تنفيذية عند تحميل الصفحة
  useEffect(() => {
    // دالة لطلب بيانات الممثل من الـ API
    const fetchActorDetails = async () => {
      try {
        // إرسال طلب GET إلى الـ API مع بعض الخيارات
        const response = await api.get(`/person/${id}`, {
          params: {
            append_to_response: "external_ids,combined_credits", // تحديد البيانات المراد إرجاعها
            language: "ar", // تحديد لغة الرد
          },
        });

        // في حال كان الرد ناجحًا (HTTP status code 200)
        if (response.status === 200) {
          // تعيين بيانات الممثل في حالة details 
          setDetails(response.data); 
        }
      } catch (error) {
        // في حال حدوث خطأ أثناء طلب البيانات
        console.log("Error fetching actor details:", error); 
      } finally {
        // إزالة حالة التحميل بعد انتهاء الطلب (ناجحًا أو بخطأ)
        setLoading(false); 
      }
    };

    // تنفيذ دالة طلب البيانات
    fetchActorDetails(); 
  }, [id]); // إعادة تشغيل الدالة عند تغير id


  return (
    <div>
      {/* شريط التنقل الرئيسي (NavBar) */}
      <div className="header-top">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link href="/"> 
              <a className="navbar-brand">Movies</a> 
            </Link>
            {/* ... باقي محتويات Navbar  */}
          </nav>
        </div>
      </div>

      {/* عرض رسالة التحميل لحين اكتمال عملية جلب البيانات */}
      {loading ? (
        <div className="text-center mt-5">
          <h1>جارٍ التحميل...</h1>
        </div>
      ) : (
        {/* عرض محتوى صفحة الممثل بعد جلب البيانات */}
        <div className="container mt-5">
          <div className="row">
            {/*  الجانب الأيسر من الصفحة (صورة الممثل وبياناته الأساسية)  */}
            <div className="col-md-4">
              <div className="text-center">
                <img
                  src={
                    details.profile_path 
                      ? GetImage("original", details.profile_path) 
                      : "/images/placeholder.png" 
                  }
                  alt={details.name}
                  className="img-fluid rounded-circle mb-3"
                  style={{ maxWidth: "150px" }}
                />

                <h1 className="mb-3">{details.name}</h1> 

                {/* عرض معلومات الممثل (الجنس، تاريخ الميلاد، مكان الميلاد) */}
                <div>
                  <p>
                    <b>الجنس:</b> {details.gender === 1 ? "أنثى" : "ذكر"}
                  </p>
                  {details.birthday && (
                    <p>
                      <b>تاريخ الميلاد:</b> {moment(details.birthday).format("DD/MM/YYYY")}
                    </p>
                  )}
                  {details.place_of_birth && (
                    <p>
                      <b>مكان الميلاد:</b> {details.place_of_birth}
                    </p>
                  )}
                </div>

                {/*  عرض روابط مواقع التواصل الاجتماعي  */}
                {details.external_ids && (
                  <div className="social-links mt-3">
                    {details.external_ids.imdb_id && (
                      <a
                        href={`https://www.imdb.com/name/${details.external_ids.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary mr-2"
                      >
                        IMDb
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/*  الجانب الأيمن من الصفحة (السيرة الذاتية والأفلام)  */}
            <div className="col-md-8">
              {/* عرض السيرة الذاتية للممثل  */}
              {details.biography && (
                <div className="mb-4">
                  <h3>السيرة الذاتية</h3>
                  <p>{details.biography}</p>
                </div>
              )}

              {/* عرض قائمة بأفلام الممثل  */}
              {details.combined_credits && details.combined_credits.cast && (
                <div>
                  <h3>أفلامه</h3>
                  <ul className="list-group">
                    {/* عرض أول 5 أفلام  */}
                    {details.combined_credits.cast.slice(0, 5).map((movie) => (
                      <li key={movie.id} className="list-group-item">
                        {/* إنشاء رابط إلى صفحة الفيلم  */}
                        <Link href={`/movie/${movie.id}`}>
                          {/* عرض اسم الفيلم */}
                          {movie.title || movie.name}
                        </Link> 
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/*  تذييل الصفحة (Footer) */}
      <div className="footer-bottom">
        <div className="container">
          {/* ... محتوى تذييل الصفحة  */}
          <p>© 2023 Movie Website</p> 
        </div>
      </div>
    </div>
  );
}

// دالة خاصة بجلب بيانات الممثل من خلال الـ API
export async function getServerSideProps(context) {
  // الحصول على معرف الممثل من الـ URL
  const { params } = context; 
  const id = params.id;

  // إرسال طلب GET إلى الـ API مع بعض الخيارات
  const response = await api.get(`/person/${id}`, {
    params: {
      append_to_response: "external_ids,combined_credits",
      language: "ar", 
    },
  });

  // في حال كان الرد ناجحًا (HTTP status code 200)
  if (response.status === 200) {
    return {
      props: {
        params: { id: id }, // إرجاع البيانات إلى مكون ActorPage 
      },
    };
  }
  // في حال حدوث خطأ أو عدم وجود الممثل 
  return {
    notFound: true, // إظهار رسالة "Not Found" للمستخدم
  };
}