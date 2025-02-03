import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionReportListComponent } from './consumption-report-list.component';

describe('ConsumptionReportListComponent', () => {
  let component: ConsumptionReportListComponent;
  let fixture: ComponentFixture<ConsumptionReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumptionReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
