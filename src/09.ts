interface Action {
  type: string;
}

interface ListNode09<T> {
  value: T;
  next: ListNode09<T>;
  prev: ListNode09<T>;
}

class BackwardsActionIterator implements IterableIterator<Action> {
  constructor(private _currentActionNode: ListNode09<Action>) {}

  [Symbol.iterator](): IterableIterator<Action> {
    return this;
  }

  next(): IteratorResult<Action> {
    const curr = this._currentActionNode;

    /**
     * if we have no current node, or the current node does not have a value,
     * then we're at the end of the chain
     *
     * Either we're at the beginning if we're travelling backwatds, or we got to
     * the last action
     */
    if (!curr || !curr.value) {
      /**
       * ES6 protocol requires that when you reach the end of an iterable, you return
       * a value of null, and done of true
       */
      return {value: null, done: true};
    }

    /**
     * move through each item in the list
     */
    this._currentActionNode = curr.prev;

    /**
     * return each item
     */
    return {value: curr.value, done: false};
  }

  // return(value?: any): IteratorResult<Action> {
  //   throw new Error('Metehod not implemented')
  // }

  // throw(value?: any): IteratorResult<Action> {
  //   throw new Error('Metehod not implemented')
  // }
}

const actionA = {type: 'ACTIONA'};
const actionB = {type: 'ACTIONB'};
const actionC = {type: 'ACTIONC'};
const actionD = {type: 'ACTIOND'};

const actionNodeA: ListNode09<Action> = {
  value: actionA,
  next: undefined,
  prev: undefined,
};
const actionNodeB: ListNode09<Action> = {
  value: actionB,
  next: undefined,
  prev: actionNodeA,
};
const actionNodeC: ListNode09<Action> = {
  value: actionC,
  next: undefined,
  prev: actionNodeB,
};
const actionNodeD: ListNode09<Action> = {
  value: actionD,
  next: undefined,
  prev: actionNodeC,
};

const backwardsActionsList = new BackwardsActionIterator(actionNodeD);

for (let action of backwardsActionsList) {
  console.log(action.type);
}
