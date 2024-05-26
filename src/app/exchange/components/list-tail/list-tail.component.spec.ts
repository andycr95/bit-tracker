import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTailComponent } from './list-tail.component';

describe('ListTailComponent', () => {
  let component: ListTailComponent;
  let fixture: ComponentFixture<ListTailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListTailComponent]
    });
    fixture = TestBed.createComponent(ListTailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
