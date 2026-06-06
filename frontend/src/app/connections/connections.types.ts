export interface Stop {
  departure: string | null;
  arrival: string | null;
  platform: string | null;
}

export interface Section {
  journey: unknown | null;
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
}

export interface Connection {
  from: Stop;
  to: Stop;
  duration: Duration | null;
  products: string[];
  sections: Section[];
}

export interface ConnectionsResponse {
  connections: Connection[];
}
