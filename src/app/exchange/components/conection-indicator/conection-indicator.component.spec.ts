import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConectionIndicatorComponent } from './conection-indicator.component';

describe('ConectionIndicatorComponent', () => {
  let component: ConectionIndicatorComponent;
  let fixture: ComponentFixture<ConectionIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConectionIndicatorComponent]
    });
    fixture = TestBed.createComponent(ConectionIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
