import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidbareComponent } from './sidbare.component';

describe('SidbareComponent', () => {
  let component: SidbareComponent;
  let fixture: ComponentFixture<SidbareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidbareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidbareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
