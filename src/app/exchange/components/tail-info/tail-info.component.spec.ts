import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailInfoComponent } from './tail-info.component';

describe('TailInfoComponent', () => {
  let component: TailInfoComponent;
  let fixture: ComponentFixture<TailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
