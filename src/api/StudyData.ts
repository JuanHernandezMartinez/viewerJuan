import { dicomwebBaseURL } from "../config/default";
import { MetaData } from "../models/Metadata";

export async function findData(studyInstanceUID: string): Promise<any> {
  const foundedSeries: any[] = [];
  let area = "";

  try {
    const seriesList = await getSeries(studyInstanceUID);
    if (seriesList.length > 0) {
      area = seriesList[0]["00080060"].Value[0];

      // Si el área es MR, redirigir a /notfound
      if (area === "MR") {
        window.location.href = "/notfound";
        return;
      }

      for (const series of seriesList) {
        const seriesInstanceUID = series["0020000E"].Value[0]; // Series Instance UID
        const instancesList = await getInstances(
          studyInstanceUID,
          seriesInstanceUID
        );

        if (instancesList.length > 0) {
          const inst: any[] = instancesList.map((instance: any) => {
            const instanceUID = instance["00080018"].Value[0]; // Instance UID
            return buildWADOURL(
              studyInstanceUID,
              seriesInstanceUID,
              instanceUID
            );
          });

          // Si el área es MG, separa las imágenes en diferentes instancias
          if (area === "MG") {
            inst.forEach((singleImageURL) => {
              foundedSeries.push([singleImageURL]); // Cada imagen como una instancia separada
            });
          } else {
            foundedSeries.push(inst); // Todas las imágenes de la serie como un solo conjunto
          }
        }
      }

      console.log(area);
      var metaData: MetaData = await getStudyMetaData(
        dicomwebBaseURL + "/studies/" + studyInstanceUID + "/metadata",
        area
      );
      console.log("metadata", metaData);
      return {
        found: foundedSeries,
        area: area,
        metaData,
      };
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/notfound";
  }
}

export async function getStudyMetaData(
  url: string,
  area: string
): Promise<any> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/dicom+json",
    },
  });

  const cto = getCtoArea(area);
  console.log("Numero cto: ", cto);
  if (!cto) {
    return;
  }
  var data = await response.json();
  console.log(data);
  var patientName = data[0]["00100010"].Value[0].Alphabetic; // nombre del paciente
  console.log("Concepto: ", data[0][cto]?.Value);
  var concept = data[0][cto]?.Value;
  var metaData: MetaData = new MetaData(patientName, concept);
  return metaData;
}

function getCtoArea(area: string): string | null {
  //ultrasonido 00081030
  //tomografia 00400254
  //mastografia 00081030
  enum ctoArea {
    US = "00081030",
    MG = "00081030",
    CT = "00081030",
    DX = "00180015",
  }
  // Comprobar si el área existe en el enum
  if (area in ctoArea) {
    console.log("se encontro el concepto");
    return ctoArea[area as keyof typeof ctoArea];
  } else {
    console.log("No se encontro el concepto");
    return null; // O cualquier valor que quieras devolver si no existe
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
