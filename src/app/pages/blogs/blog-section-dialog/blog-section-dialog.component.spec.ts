import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogSectionDialogComponent } from './blog-section-dialog.component';

describe('BlogSectionDialogComponent', () => {
  let component: BlogSectionDialogComponent;
  let fixture: ComponentFixture<BlogSectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogSectionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogSectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
