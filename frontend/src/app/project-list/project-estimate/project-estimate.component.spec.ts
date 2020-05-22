import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEstimateComponent } from './project-estimate.component';

describe('ProjectEstimateComponent', () => {
  let component: ProjectEstimateComponent;
  let fixture: ComponentFixture<ProjectEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
