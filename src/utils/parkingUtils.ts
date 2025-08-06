export function getMarkerColor(status: string): string {
  return status === "Unoccupied" ? "green" : "red";
}
