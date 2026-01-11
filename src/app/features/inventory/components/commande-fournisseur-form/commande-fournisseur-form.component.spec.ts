import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeFournisseurFormComponent } from './commande-fournisseur-form.component';

describe('CommandeFournisseurFormComponent', () => {
  let component: CommandeFournisseurFormComponent;
  let fixture: ComponentFixture<CommandeFournisseurFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeFournisseurFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeFournisseurFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
