import { DoseAvailability } from "./dose-availability";

export interface VaccineInfo {
    name: string;
    selected: boolean,
    id:number,
    availability: DoseAvailability
}
