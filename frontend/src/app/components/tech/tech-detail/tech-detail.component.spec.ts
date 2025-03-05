import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechDetailComponent } from './tech-detail.component';

describe('TechDetailComponent', () => {
  let component: TechDetailComponent;
  let fixture: ComponentFixture<TechDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
