import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HealthCheckComponent } from './health-check.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config.service';
import { ApiService } from '../../services/api.service';

describe('HealthCheckComponent', () => {
  let component: HealthCheckComponent;
  let fixture: ComponentFixture<HealthCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HealthCheckComponent,
        HttpClientTestingModule
      ],
      providers: [
        ApiService,
        {
          provide: ConfigService,
          useValue: { apiUrl: 'https://test.example.com' }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
