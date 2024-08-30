import { useEffect, useState } from "react";
import { findData } from "./api/StudyData";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "./styles.css";
import { Navigation } from "swiper/modules";
import { useParams } from "react-router-dom";
import StudySlider from "./components/StudySlider";

export default function App() {
  const params = useParams();
  console.log(params);
  const [urls, setUrls] = useState<any[]>([]);
  const [select, setSelect] = useState<string[]>([]);
  const [area, setArea] = useState<string>();

  const studyInstanceUID: string = params.studyUID || "";

  const handleDataFromChild = (childData: any[]) => {
    setSelect(childData);
  };

  useEffect(() => {
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
            <img className={area} src={i} alt="Imagen del estudio" />
          </SwiperSlide>
        ))}
      </Swiper>

      <StudySlider data={urls} onDataFromChild={handleDataFromChild} />

      {/* <div className="button-area">
        <div className="botones">
          {urls.map((i, index) => (
            <div key={index}  className={`${index === touched ? "touched" : null}`}>
              <img
                className={`button-img`}
                src={i[0]}
                alt=""
                onClick={() => {
                  setSelect(i);
                  setTouched(index);
                  console.log(select);
                }}
              />
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
}
