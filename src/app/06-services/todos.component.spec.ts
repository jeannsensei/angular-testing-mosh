import { TodoMockService } from './mock/todo-mock.service';
import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';
import { from, of, throwError } from 'rxjs';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

const dummyUserListResponse = {
  data: [
    {
      id: 1,
      first_name: 'George',
      last_name: 'Bluth',
      avatar:
        'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg',
    },
    {
      id: 2,
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar:
        'https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg',
    },
    {
      id: 3,
      first_name: 'Emma',
      last_name: 'Wong',
      avatar:
        'https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg',
    },
  ],
};

describe('TodosComponent', () => {
  let component: TodosComponent;
  let service: TodoService;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', {
      post: of({}),
      get: of({}),
    });
    service = new TodoService(spy);
    component = new TodosComponent(service);
  });

  // https://stackoverflow.com/questions/66941972/argument-of-type-null-is-not-assignable-to-parameter-of-type-httpclient-on-a
  it('should set todos property with the items returned from the server', () => {
    let todos = [1, 2, 3];
    // Spy on the function name
    spyOn(service, 'getTodos').and.callFake(() => {
      return from([todos]);
    });
    // Setup
    component.ngOnInit();
    // Assertion
    expect(component.todos).toBe(todos);
  });

  it('should call the server to save the changes when a new todo item is added', () => {
    const spy = spyOn(service, 'add').and.callFake((t) => {
      return from([true]);
    });

    component.add();

    expect(spy).toHaveBeenCalled();
  });

  it('should add the new todo returned from the server', () => {
    let todo = { id: 1 };
    const spy = spyOn(service, 'add').and.returnValue(from([todo]));

    component.add();

    expect(component.todos.indexOf(todo)).toBeGreaterThan(-1);
  });

  it('should set the message property if server returns an error, when adding a new todo', () => {
    const error = 'an error has happened';
    spyOn(service, 'add').and.returnValue(throwError(error));

    component.add();

    expect(component.message).toBe(error);
  });

  it('should call the server to delete a todo item if the user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const spy = spyOn(service, 'delete').and.returnValue(of());

    component.delete(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('shoult NOT call the server to delete a todo item if the user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const spy = spyOn(service, 'delete').and.returnValue(of());

    component.delete(1);

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('TodoService', () => {
  let injector: TestBed;
  let service: TodoMockService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoMockService],
    });

    injector = getTestBed();
    service = injector.inject(TodoMockService);
    httpMock = injector.inject(HttpTestingController);
    // https://www.thecodebuzz.com/angular-unit-test-and-mock-httpclient-get-request/
    // https://github.com/shashankvivek/angular-karma-playground/blob/master/karma-project/src/app/students/students.service.spec.ts
  });

  it('getUserList() should return data', () => {
    service.getUserList().subscribe((res) => {
      expect(res).toEqual(dummyUserListResponse);
    });

    const req = httpMock.expectOne('https://reqres.in/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUserListResponse);
  });
});
