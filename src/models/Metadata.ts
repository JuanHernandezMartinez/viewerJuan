export class MetaData {
  patientName: string;
  concept: string;

  constructor(name: string = "", con: string = "") {
    this.patientName = name;
    this.concept = con;
  }
}
