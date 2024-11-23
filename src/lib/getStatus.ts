const BASE_TO_BASE_ID = 849;
const MOUNTAIN_AREA_ID = 199;
// const STATUS_URL = "https://vicomap-cdn.resorts-interactive.com/api/maps/1446";
const STATUS_URL = "https://mtnpowder.com/feed?resortId=61";

interface ResponseData {
  // also has other stuff
  MountainAreas: MountainArea[];
}

interface MountainArea {
  // also has other stuff
  Id: number;
  Lifts: LiftStatus[];
}

interface LiftStatus {
  Id: 849;
  Name: string;
  MountainAreaName: string;
  StatusId: number;
  // Status is sentence case
  Status: String;
  // StatusEnglish is snake_case
  StatusEnglish: string;
  FirstTracks: string;
  UpdateDate: string;
  LiftType: string;
  LiftIcon: string;
  Hours: {
    Sunday: {
      Open: string;
      Close: string;
    };
    Monday: {
      Open: string;
      Close: string;
    };
    Tuesday: {
      Open: string;
      Close: string;
    };
    Wednesday: {
      Open: string;
      Close: string;
    };
    Thursday: {
      Open: string;
      Close: string;
    };
    Friday: {
      Open: string;
      Close: string;
    };
    Saturday: {
      Open: string;
      Close: string;
    };
  };
  NightHours: string;
  WaitTime: string;
  WaitTimeString: string;
  WaitTimeStatus: string;
}

export async function getStatus() {
  const response = await fetch(STATUS_URL, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch status: ${response.status} ${response.statusText}`
    );
  }

  const data: ResponseData = await response.json();

  const area = data.MountainAreas.find(
    (mountainArea: MountainArea) => mountainArea.Id === MOUNTAIN_AREA_ID
  );

  if (!area) throw new Error("mountain area not found");

  const baseToBaseStatus = area.Lifts.find(
    (liftStatus: LiftStatus) => liftStatus.Id === BASE_TO_BASE_ID
  );

  return baseToBaseStatus;
}
