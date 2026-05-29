import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyForm } from './journey-form';

describe('JourneyForm', () => {
  let component: JourneyForm;
  let fixture: ComponentFixture<JourneyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyForm],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
