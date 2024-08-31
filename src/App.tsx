import { useEffect, useState, lazy } from "react";
import { findData } from "./api/StudyData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";
import { Navigation } from "swiper/modules";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

// import StudySlider from "./components/StudySlider";
const StudySlider = lazy(() => import("./components/StudySlider"));

export default function App() {
  const params = useParams();
  const [urls, setUrls] = useState<any[]>([]);
  const [select, setSelect] = useState<string[]>([]);
  const [area, setArea] = useState<string>();

  const studyInstanceUID: string = params.studyUID || "";

  const handleDataFromChild = (childData: any[]) => {
    setSelect(childData);
  };

  useEffect(() => {
    Swal.fire({
      icon: "info",
      title: "!!Aviso importante¡¡",
      text: "Las imágenes mostradas en este sistema son exclusivamente para la verificación rápida de la adquisición y existencia de los estudios. Estas imágenes no están diseñadas ni calibradas para análisis clínicos, diagnóstico, ni interpretaciones médicas. Para cualquier evaluación clínica o diagnóstico, por favor utilice las imágenes originales en formato DICOM u otro medio certificado.",
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

    async function init() {
      const data: { found: any[]; area: string } = await findData(
        studyInstanceUID
      );

      setUrls(data.found);
      setArea(data.area);
      setSelect(data.found[0]);
    }
    init();
  }, []);

  return (
    <>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        {select.map((i, index) => (
          <SwiperSlide key={index}>
            <img
              className={area}
              src={i}
              alt="Imagen del estudio"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <StudySlider data={urls} onDataFromChild={handleDataFromChild} />
    </>
  );
}
