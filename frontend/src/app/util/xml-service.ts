import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class XmlService {
  xml2js = require('xml2js');
  async parseXml(xml: string): Promise<any> {}
}
