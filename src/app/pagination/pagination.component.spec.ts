import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pages array correctly', () => {
    component.totalPages = 5;
    component.ngOnChanges();
    expect(component.pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should emit pageChange event when goToPage is called with a valid page number', () => {
    component.totalPages = 5;
    component.currentPage = 3;
    spyOn(component.pageChange, 'emit');

    component.goToPage(4);

    expect(component.pageChange.emit).toHaveBeenCalledWith(4);
  });

  it('should not emit pageChange event when goToPage is called with an invalid page number', () => {
    component.totalPages = 5;
    component.currentPage = 3;
    spyOn(component.pageChange, 'emit');

    component.goToPage(0);

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should not emit pageChange event when goToPage is called with the current page number', () => {
    component.totalPages = 5;
    component.currentPage = 3;
    spyOn(component.pageChange, 'emit');

    component.goToPage(3);

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
