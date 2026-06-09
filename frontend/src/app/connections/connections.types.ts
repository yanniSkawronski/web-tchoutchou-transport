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

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
}

export interface Connection {
  from: Stop;
  to: Stop;
  duration: string;
  products: string[];
  sections: Section[];
  weatherFrom?: WeatherInfo;
  weatherTo?: WeatherInfo;
}

export interface ConnectionsResponse {
  connections: Connection[];
}
