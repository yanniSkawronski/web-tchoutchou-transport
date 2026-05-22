import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service.js';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  private getHello(): string {
    return this.appService.getHello();
  }
}
