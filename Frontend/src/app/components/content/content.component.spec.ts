import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppContentComponent } from './content.component';

describe('ContentComponent', () => {
  let component: AppContentComponent;
  let fixture: ComponentFixture<AppContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
