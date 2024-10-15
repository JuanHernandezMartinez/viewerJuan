import { useEffect, useState } from "react";
import { findData } from "./api/StudyData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";
import { Navigation } from "swiper/modules";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { MetaData } from "./models/Metadata";
import StudySlider from "./components/StudySlider";

export default function App() {
  const params = useParams();
  const studyInstanceUID: string = params.studyUID || "";
  const [urls, setUrls] = useState<any[]>([]);
  const [select, setSelect] = useState<string[]>([]);
  const [area, setArea] = useState<string>();
  const [metaData, setMetadata] = useState<MetaData>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleDataFromChild = (childData: any[]) => {
    setLoading(true);
    console.log(loading)
    setSelect(childData);
  };
  const handleImageLoad = () => {
    setLoading(false);
    console.log(loading)
  };

  useEffect(() => {
    async function init() {
      const data: { found: any[]; area: string; metaData: MetaData } =
        await findData(studyInstanceUID);
      setUrls(data.found);
      setArea(data.area);
      setSelect(data.found[0]);
      setMetadata(data.metaData);
    }

    init();

    Swal.fire({
      icon: "info",
      title: "!!Aviso importante¡¡",
      text: "Las imágenes en este sistema son solo para verificación rápida de los estudios y no están calibradas para análisis clínicos ni diagnósticos.",
      showCancelButton: true,
      cancelButtonText: "Salir",
      confirmButtonText: "Continuar",
      reverseButtons: true,
    }).then((result) => {
      if (result.isDenied) {
        window.location.href = "https://blog.diagnocons.com";
      }
      if (result.dismiss) {
        window.location.href = "https://blog.diagnocons.com";
      }
      if (result.isConfirmed) {
        Swal.close();
      }
    });
  }, []);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "2%",
          left: "3%",
          zIndex: 1000,
        }}
      >
        <h1 className="metaData">{metaData?.patientName}</h1>
        <h1 className="metaData">{metaData?.concept}</h1>
      </div>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        {select.map((i, index) => (
          <SwiperSlide key={index}>
            {loading ? (
              <div className="loading-container">
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
                <p style={{color:"whitesmoke"}}>Cargando imagen...</p>
              </div>
            ) : null}
            <img
              className={area}
              src={i}
              alt="No se pudo mostrar la imagen, recargué la pagina."
              onLoad={handleImageLoad}
              onError={() => setLoading(false)}
              style={{ display: loading ? "none" : "block", color:"whitesmoke" }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <StudySlider data={urls} onDataFromChild={handleDataFromChild} />
    </>
  );
}
