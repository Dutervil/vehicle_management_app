import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionReportFormComponent } from './consumption-report-form.component';

describe('ConsumptionReportFormComponent', () => {
  let component: ConsumptionReportFormComponent;
  let fixture: ComponentFixture<ConsumptionReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionReportFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumptionReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
