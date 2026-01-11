import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatierePremiereListComponent } from './matiere-premiere-list.component';

describe('MatierePremiereListComponent', () => {
  let component: MatierePremiereListComponent;
  let fixture: ComponentFixture<MatierePremiereListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatierePremiereListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatierePremiereListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
