const BASE_TO_BASE_ID = 12193;
const STATUS_URL = "https://vicomap-cdn.resorts-interactive.com/api/maps/1446";

interface ResponseData {
  // also has other stuff
  lifts: LiftStatus[];
}

interface LiftStatus {
  id: number;
  description: string;
  name: string;
  data: string;
  status: string;
  statusColour: string;
}

export async function getStatus() {
  const response = await fetch(STATUS_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch status: ${response.status} ${response.statusText}`
    );
  }

  const data: ResponseData = await response.json();

  const baseToBaseStatus = data.lifts.find(
    (liftStatus: LiftStatus) => liftStatus.id === BASE_TO_BASE_ID
  );

  return baseToBaseStatus;
}
