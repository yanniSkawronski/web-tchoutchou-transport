import { Routes } from '@angular/router';
import { Connections } from './connections/connections';
import { Authentication } from './authentication/authentication';
import { Timetable } from './timetable/timetable';

export const routes: Routes = [
  {
    path: '',
    component: Connections,
  },
  {
    path: 'auth',
    component: Authentication,
  },
  {
    path: 'timetable',
    component: Timetable,
  },
];
