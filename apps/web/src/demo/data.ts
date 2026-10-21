import type { MessageKey } from "@/i18n/messages/en";

export type RequestStatus = "open" | "inProgress" | "scheduled" | "completed" | "onHold";
export type ElevatorStatus = "operational" | "maintenance" | "outOfService";
export type TechnicianStatus = "available" | "busy" | "offDuty";
export type Priority = "low" | "medium" | "high" | "critical";

export interface DemoRequest {
  readonly id: string; readonly subjectKey: MessageKey; readonly customerKey: MessageKey;
  readonly buildingKey: MessageKey; readonly status: RequestStatus; readonly priority: Priority;
  readonly technicianId?: string; readonly openedAt: string; readonly updatedAt: string;
  readonly timeline: readonly { readonly key: MessageKey; readonly at: string }[];
}
export interface DemoElevator {
  readonly id: string; readonly buildingKey: MessageKey; readonly customerKey: MessageKey;
  readonly status: ElevatorStatus; readonly model: string; readonly serial: string;
  readonly floors: number; readonly lastService: string; readonly nextService: string;
}
export interface DemoCustomer {
  readonly id: string; readonly nameKey: MessageKey; readonly buildings: number;
  readonly elevators: number; readonly contact: string; readonly email: string;
}
export interface DemoTechnician {
  readonly id: string; readonly nameKey: MessageKey; readonly status: TechnicianStatus;
  readonly specializationKey: MessageKey; readonly activeJobs: number;
}
export interface DemoVisit {
  readonly id: string; readonly date: string; readonly startTime: string; readonly endTime: string;
  readonly elevatorId: string; readonly buildingKey: MessageKey; readonly technicianId: string;
}

export const demoCustomers: readonly DemoCustomer[] = [
  { id: "CUS-DEMO-01", nameKey: "data.customer.atlas", buildings: 2, elevators: 4, contact: "+20 000 000 0001", email: "atlas@example.test" },
  { id: "CUS-DEMO-02", nameKey: "data.customer.nile", buildings: 2, elevators: 3, contact: "+20 000 000 0002", email: "nile@example.test" },
  { id: "CUS-DEMO-03", nameKey: "data.customer.horizon", buildings: 1, elevators: 2, contact: "+20 000 000 0003", email: "horizon@example.test" },
];

export const demoTechnicians: readonly DemoTechnician[] = [
  { id: "TECH-DEMO-01", nameKey: "data.technician.one", status: "available", specializationKey: "data.specialization.electrical", activeJobs: 1 },
  { id: "TECH-DEMO-02", nameKey: "data.technician.two", status: "busy", specializationKey: "data.specialization.mechanical", activeJobs: 3 },
  { id: "TECH-DEMO-03", nameKey: "data.technician.three", status: "available", specializationKey: "data.specialization.controls", activeJobs: 1 },
  { id: "TECH-DEMO-04", nameKey: "data.technician.four", status: "offDuty", specializationKey: "data.specialization.general", activeJobs: 0 },
];

export const demoElevators: readonly DemoElevator[] = [
  { id: "ELV-DEMO-201", buildingKey: "data.building.central", customerKey: "data.customer.atlas", status: "operational", model: "LX-20 Demo", serial: "SER-DEMO-2001", floors: 18, lastService: "2026-09-18", nextService: "2026-10-21" },
  { id: "ELV-DEMO-202", buildingKey: "data.building.central", customerKey: "data.customer.atlas", status: "operational", model: "LX-20 Demo", serial: "SER-DEMO-2002", floors: 18, lastService: "2026-09-18", nextService: "2026-10-21" },
  { id: "ELV-DEMO-203", buildingKey: "data.building.garden", customerKey: "data.customer.atlas", status: "operational", model: "MV-12 Demo", serial: "SER-DEMO-2003", floors: 9, lastService: "2026-09-25", nextService: "2026-10-24" },
  { id: "ELV-DEMO-204", buildingKey: "data.building.riverside", customerKey: "data.customer.nile", status: "maintenance", model: "CX-16 Demo", serial: "SER-DEMO-2004", floors: 14, lastService: "2026-10-10", nextService: "2026-10-19" },
  { id: "ELV-DEMO-205", buildingKey: "data.building.harbor", customerKey: "data.customer.nile", status: "outOfService", model: "FX-08 Demo", serial: "SER-DEMO-2005", floors: 7, lastService: "2026-10-02", nextService: "2026-10-20" },
  { id: "ELV-DEMO-206", buildingKey: "data.building.north", customerKey: "data.customer.horizon", status: "operational", model: "LX-20 Demo", serial: "SER-DEMO-2006", floors: 12, lastService: "2026-09-29", nextService: "2026-10-27" },
];

export const demoRequests: readonly DemoRequest[] = [
  { id: "REQ-DEMO-1042", subjectKey: "data.request.doorSensor", customerKey: "data.customer.atlas", buildingKey: "data.building.central", status: "inProgress", priority: "high", technicianId: "TECH-DEMO-02", openedAt: "2026-10-17T08:30:00Z", updatedAt: "2026-10-18T09:15:00Z", timeline: [{ key: "data.timeline.created", at: "2026-10-17T08:30:00Z" }, { key: "data.timeline.reviewed", at: "2026-10-17T09:00:00Z" }, { key: "data.timeline.assigned", at: "2026-10-17T09:20:00Z" }] },
  { id: "REQ-DEMO-1043", subjectKey: "data.request.leveling", customerKey: "data.customer.nile", buildingKey: "data.building.riverside", status: "scheduled", priority: "medium", technicianId: "TECH-DEMO-03", openedAt: "2026-10-16T12:10:00Z", updatedAt: "2026-10-18T07:40:00Z", timeline: [{ key: "data.timeline.created", at: "2026-10-16T12:10:00Z" }, { key: "data.timeline.visitScheduled", at: "2026-10-18T07:40:00Z" }] },
  { id: "REQ-DEMO-1044", subjectKey: "data.request.noise", customerKey: "data.customer.nile", buildingKey: "data.building.harbor", status: "onHold", priority: "critical", openedAt: "2026-10-15T15:35:00Z", updatedAt: "2026-10-17T16:20:00Z", timeline: [{ key: "data.timeline.created", at: "2026-10-15T15:35:00Z" }, { key: "data.timeline.reviewed", at: "2026-10-17T16:20:00Z" }] },
  { id: "REQ-DEMO-1045", subjectKey: "data.request.panel", customerKey: "data.customer.horizon", buildingKey: "data.building.north", status: "open", priority: "high", openedAt: "2026-10-18T10:05:00Z", updatedAt: "2026-10-18T10:05:00Z", timeline: [{ key: "data.timeline.created", at: "2026-10-18T10:05:00Z" }] },
  { id: "REQ-DEMO-1041", subjectKey: "data.request.lighting", customerKey: "data.customer.atlas", buildingKey: "data.building.garden", status: "completed", priority: "low", technicianId: "TECH-DEMO-01", openedAt: "2026-10-12T09:00:00Z", updatedAt: "2026-10-16T11:30:00Z", timeline: [{ key: "data.timeline.created", at: "2026-10-12T09:00:00Z" }, { key: "data.timeline.assigned", at: "2026-10-12T10:00:00Z" }] },
];

export const demoVisits: readonly DemoVisit[] = [
  { id: "VISIT-DEMO-301", date: "2026-10-19", startTime: "09:00", endTime: "10:30", elevatorId: "ELV-DEMO-204", buildingKey: "data.building.riverside", technicianId: "TECH-DEMO-03" },
  { id: "VISIT-DEMO-302", date: "2026-10-20", startTime: "11:00", endTime: "12:30", elevatorId: "ELV-DEMO-205", buildingKey: "data.building.harbor", technicianId: "TECH-DEMO-02" },
  { id: "VISIT-DEMO-303", date: "2026-10-21", startTime: "08:30", endTime: "11:00", elevatorId: "ELV-DEMO-201", buildingKey: "data.building.central", technicianId: "TECH-DEMO-01" },
  { id: "VISIT-DEMO-304", date: "2026-10-21", startTime: "11:30", endTime: "13:00", elevatorId: "ELV-DEMO-202", buildingKey: "data.building.central", technicianId: "TECH-DEMO-01" },
  { id: "VISIT-DEMO-305", date: "2026-10-24", startTime: "10:00", endTime: "11:30", elevatorId: "ELV-DEMO-203", buildingKey: "data.building.garden", technicianId: "TECH-DEMO-03" },
];

export const demoActivity: readonly { readonly key: MessageKey; readonly at: string }[] = [
  { key: "data.activity.requestOpened", at: "2026-10-18T10:05:00Z" },
  { key: "data.activity.technicianAssigned", at: "2026-10-18T09:15:00Z" },
  { key: "data.activity.statusChanged", at: "2026-10-18T08:40:00Z" },
  { key: "data.activity.visitCompleted", at: "2026-10-17T15:20:00Z" },
];

export function findTechnician(id?: string): DemoTechnician | undefined { return demoTechnicians.find((item) => item.id === id); }
