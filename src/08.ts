/**
 * TreeNode
 *
 * Interfaces can references themselves
 */
interface TreeNode<T> {
  value: T;
  left: TreeNode<T>;
  right: TreeNode<T>;
}

interface LinkedList<T> {
  value: T;
  next: LinkedList<T>;
}

/**
 * Create a node in a linked list
 *
 * This object can be deeply nested:
 * node.next.next.next.value
 */
let node: LinkedList<string>;

/**
 * If we wanted to build a structure that allows us to move back and forward in
 * time, a linked list would be a good basis for such a structure.
 *
 * Redux's actions are a good example of this
 *
 * e.g. action1/state1 --> action2/state2 --> action3/state3 --> etc.
 */
interface Action {
  type: string;
}

let action1: Action = {type: 'LOGIN'};
let action2: Action = {type: 'LOAD_POSTS'};

/**
 * To build the list, we store a reference to the previous and next item
 */
interface ListNode<T> {
  value: T;
  next?: ListNode<T>;
  prev?: ListNode<T>;
}

const actionNode1: ListNode<Action> = {
  value: action1,
  next: undefined,
  prev: undefined,
};

const actionNode2: ListNode<Action> = {
  value: action2,
  next: undefined,
  prev: actionNode1,
};

/**
 * Mark the next node of the previous actionNode as actionNode2
 *
 * This now allows us to traverse through iterations of actions being executed:
 *    actionNode1.next.next.next.next.value;
 *
 * The problem with this is that it's not type-safe - at some point we're going
 * to hit an undefined `next` but the compiler will have no way of knowing when
 * that'll be
 */
actionNode1.next = actionNode2;

/**
 * To address the issue of hitting an undefined `next` above, we can use a loop
 * to iterate over the list until we get an undefined value
 */
let currentNode: ListNode<Action> | undefined = actionNode2;

do {
  console.log(currentNode.value);
  currentNode = currentNode.prev;
} while (currentNode);
