import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditForm } from './task-edit-form';

describe('TaskEditForm', () => {
  let component: TaskEditForm;
  let fixture: ComponentFixture<TaskEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskEditForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
