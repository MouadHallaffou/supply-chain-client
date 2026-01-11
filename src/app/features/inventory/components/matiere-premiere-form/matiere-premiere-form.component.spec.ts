import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatierePremiereFormComponent } from './matiere-premiere-form.component';

describe('MatierePremiereFormComponent', () => {
  let component: MatierePremiereFormComponent;
  let fixture: ComponentFixture<MatierePremiereFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatierePremiereFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatierePremiereFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
