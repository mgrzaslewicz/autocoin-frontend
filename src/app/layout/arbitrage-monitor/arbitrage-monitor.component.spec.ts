import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ArbitrageMonitorComponent} from "./arbitrage-monitor.component";


describe('ArbitrageMonitorComponent', () => {
  let component: ArbitrageMonitorComponent;
  let fixture: ComponentFixture<ArbitrageMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArbitrageMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArbitrageMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
