import { VoteComponent } from './vote.component';

describe('VoteComponent', () => {
  // Arrange - where we initialize the system for the test
  let component: VoteComponent;
  // To have each suite of testing isolated from the other
  // we use beforeEach to clear the data used
  // beforeEach -> set up
  // afterEach -> tear down
  // beforeAll ->
  // afterAll ->
  beforeEach(() => {
    component = new VoteComponent();
  });
  it('should increment totalVotes when upvoted', () => {
    // Act - calling a function
    component.upVote();
    // Assertion
    expect(component.totalVotes).toBe(1);
  });

  it('should decrement totalVotes when downvoted', () => {
    // Act - calling a function
    component.downVote();
    // Assertion
    expect(component.totalVotes).toBe(-1);
  });
});
