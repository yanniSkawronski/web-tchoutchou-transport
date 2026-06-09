import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { z } from 'zod';

const OpenMeteoResponseSchema = z.object({
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
    weather_code: z.array(z.number()),
  }),
});

// due to the nature of the function, this function is AI generated. We gave to her the API so she could generate for us
// the binding between codes to human weather
function getWmoDescription(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Ciel dégagé', icon: '☀️' };
  if ([1, 2, 3].includes(code)) return { condition: 'Partiellement nuageux', icon: '⛅' };
  if ([45, 48].includes(code)) return { condition: 'Brumeux', icon: '🌫️' };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: 'Bruine', icon: '🌧️' };
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { condition: 'Pluie', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Neige', icon: '❄️' };
  if ([95, 96, 99].includes(code)) return { condition: 'Orage', icon: '⛈️' };
  return { condition: 'Inconnu', icon: '❓' };
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
}

@Injectable()
export class WeatherApiService {
  public constructor(private readonly httpService: HttpService) {}

  public getWeatherAt(lat: number, lon: number, isoDate: string): Observable<WeatherInfo> {
    const date = new Date(isoDate);
    const requestDate = date.toISOString().slice(0, 10);

    return this.httpService
      .get<unknown>('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'temperature_2m,weather_code',
          start_date: requestDate,
          end_date: requestDate,
          timezone: 'auto',
        },
      })
      .pipe(
        map((response) => {
          const parsed = OpenMeteoResponseSchema.safeParse(response.data);
          // this should never occur, but it's better to be safe than sorry
          if (!parsed.success) {
            throw new Error('Invalid response from weather API');
          }

          const { time: times, temperature_2m: temps, weather_code: codes } = parsed.data.hourly;
          const targetHour = date.getHours();
          const closestIndex = Math.min(targetHour, times.length - 1);

          const temp = temps[closestIndex] ?? 0;
          const code = codes[closestIndex] ?? -1;
          const { condition, icon } = getWmoDescription(code);

          return { temperature: temp, condition, icon };
        }),
      );
  }
}
