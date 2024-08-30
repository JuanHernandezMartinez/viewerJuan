import { useEffect, useState } from "react";
import {
  getSeries,
  getInstances,
  buildWADOURL,
  findData,
} from "./api/StudyData";
function App() {
  const [urls, setUrls] = useState<string[]>([]);
  // const [patient, setPatient] = useState<any>();
  const images: string[] = [];
  const studyInstanceUID: string = "1.3.12.2.1107.5.1.7.111185.30000022110506341503700000012";

  // const masto: string =
  //   "https://viewerv2.diagnocons.com/viewer/1.2.250.202406141030.55400";

  useEffect(() => {
    async function init() {
      setUrls(await findData(studyInstanceUID));
    }
    init();
  }, []);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "100%",
          justifyContent: "space-between",
        }}
      >
        {urls.map((i, index) => (
          <div key={index}>
            <p>imagen {index}</p>
            <img src={i} alt="imagen del estudio" width="90%" height="90%" />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
