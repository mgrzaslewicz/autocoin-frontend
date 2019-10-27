import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ExchangeUserCreateComponent} from './exchange-user-create.component';


describe('ExchangeUserCreateComponent', () => {
  let component: ExchangeUserCreateComponent;
  let fixture: ComponentFixture<ExchangeUserCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeUserCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
