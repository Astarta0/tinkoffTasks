class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}

function multiplyListByNumber(headNode, num, carry = 0) {
    //…
}

function shiftListByZeros(headNode, digitsСounter) {
    //…
}

function sumLists(headNode1, headNode2, carry = 0) {
    //…
}

function multiplyLists(headNode1, headNode2) {
    //…
}

const headNodeOfList1 = new Node(7, new Node(1, new Node(6, new Node(2))));
const headNodeOfList2 = new Node(5, new Node(9, new Node(2)));

const multipliedHeadNode = multiplyLists(headNodeOfList1, headNodeOfList2);
// Node {value: 5, next: Node {value: 1, next: Node {value: 0, next: Node {value: 2, next: Node {value: 7, next: Node {value: 7, next: null}}}}}
