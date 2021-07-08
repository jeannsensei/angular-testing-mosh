import { TodosComponent } from './todos.component';
import { TodoService } from './todo.service';
import { from, Observable, of, throwError } from 'rxjs';

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
