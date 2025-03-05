import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTechComponent } from './all-tech.component';

describe('AllTechComponent', () => {
  let component: AllTechComponent;
  let fixture: ComponentFixture<AllTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
