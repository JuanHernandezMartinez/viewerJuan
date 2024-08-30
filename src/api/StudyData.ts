import { dicomwebBaseURL } from "../config/default";

export async function findData(studyInstanceUID: string): Promise<any> {
  var foundedSeries: any[] = [];
  var area: string = "";

  try {
    const seriesList = await getSeries(studyInstanceUID);
    if (seriesList.length > 0) {
      area = seriesList[0]["00080060"].Value[0];
      if (area === "MR") {
        window.location.href = "/notfound";
      }
      for (const series of seriesList) {
        const seriesInstanceUID = series["0020000E"].Value[0]; // Series Instance UID

        const instancesList = await getInstances(
          studyInstanceUID,
          seriesInstanceUID
        );

        // Crear un nuevo arreglo para cada serie
        var inst: any[] = [];

        if (instancesList.length > 0) {
          instancesList.forEach((instance: any) => {
            const instanceUID = instance["00080018"].Value[0]; // Instance UID
            const imageURL = buildWADOURL(
              studyInstanceUID,
              seriesInstanceUID,
              instanceUID
            );
            inst.push(imageURL);
          });
        }

        // Agregar las instancias de la serie al arreglo de series
        foundedSeries.push(inst);
      }
      console.log(area);
      var data = {
        found: foundedSeries,
        area: area,
      };
      return data;
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/notfound";
  }
}

export async function getSeries(studyInstanceUID: string) {
  const seriesURL = `${dicomwebBaseURL}/studies/${studyInstanceUID}/series`;
  const response = await fetch(seriesURL, {
    headers: {
      Accept: "application/dicom+json",
    },
  });
  const seriesData = await response.json();
  // console.log(seriesData);
  return seriesData;
}

export async function getInstances(
  studyInstanceUID: string,
  seriesInstanceUID: string
) {
  const instancesURL = `${dicomwebBaseURL}/studies/${studyInstanceUID}/series/${seriesInstanceUID}/instances`;
  const response = await fetch(instancesURL, {
    headers: {
      Accept: "application/dicom+json",
    },
  });
  const instancesData = await response.json();
  // console.log(instancesData);
  return instancesData;
}

export function buildWADOURL(
  studyInstanceUID: string,
  seriesInstanceUID: string,
  instanceUID: string
) {
  return `https://ris.diagnocons.com/dcm4chee-arc/aets/DCM4CHEE/wado?requestType=WADO&studyUID=${studyInstanceUID}&seriesUID=${seriesInstanceUID}&objectUID=${instanceUID}&contentType=image/jpeg`;
}
