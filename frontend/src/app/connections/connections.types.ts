export interface Location {
  id: string;
  name: string;
}

export interface Stop {
  station: Location;
  departure: string | null;
  arrival: string | null;
  platform: string | null;
}

export interface Journey {
  name: string;
  category: string;
  number: string;
  to: string;
}

export interface Section {
  journey: Journey | null;
  departure: Stop;
  arrival: Stop;
}

export interface Connection {
  from: Stop;
  to: Stop;
  duration: string;
  products: string[];
  sections: Section[];
}

export interface ConnectionsResponse {
  connections: Connection[];
}
