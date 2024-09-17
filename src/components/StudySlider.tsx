import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./StudySlider.css";
import { useState } from "react";

export default function StudySlider(
  props: Studyslider = { data: [], onDataFromChild: Function }
) {
  const urls = props.data;
  const [touched, setTouched] = useState<number>(0);
  function sendDataToParent(data: string[]): void {
    props.onDataFromChild(data);
    return;
  }

  return (
    <>
      <Swiper
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {urls.map((i: any, index: number) => (
          <SwiperSlide
            key={index}
            className={`${index === touched ? "touched" : null}`}
          >
            <img
              className="preview"
              src={i[0]}
              onClick={() => {
                setTouched(index);
                sendDataToParent(i);
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

class Studyslider {
  data!: any[];
  onDataFromChild!: Function;
}
