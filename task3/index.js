/**
 * Task 3
 * https://github.com/Astarta0/tinkoffTasks/tree/master/task3
 *
 * Демо на codepen:
 *   https://codepen.io/astarta0/pen/PeBOKo?editors=0010
 *
 * Задача:
 *   Два числа представлены в виде связных списков, где каждый узел содержит одну цифру.
 *   Цифры хранятся в списке в обратном порядке. Необходимо перемножить такие списки.
 *
 *   Пример:
 *     Вход: (7 → 1 → 6 → 2)×(5 → 9 → 2), то есть 2617×295
 *     Выход: (5 → 1 → 0 → 2 → 7 → 7), то есть 772015
 *
 *   Реализуйте функцию multiplyLists(headNode1, headNode2), которая в качестве аргументов
 *   принимает головы двух списков и возвращает голову третьего списка, который является
 *   произведением первых двух. Чтобы реализовать эту функцию, необходимо реализовать еще
 *   несколько вспомогательных функций: сложение, умножение на цифру, а также сдвиг по разрядам.
 *   Конвертировать список в число и обратно не разрешается. Оперировать можно только узлами.
 *
 */

class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }

    getLength() {
        let length = 0;
        length = this.countLength(length);
        return length;
    }

    countLength(length) {
        if (this.next === null) {
            return ++length;
        }

        length++;
        return this.countLength.call(this.next, length);
    }
}

function makeEmptyList(size) {
    let resultList = new Node(0);
    --size;
    while (size > 0) {
        resultList = new Node(0, resultList);
        --size;
    }
    return resultList;
}

function multiplyListByNumber(list, num, carry = 0) {
    let mul = 0;
    let resultList, headOfResult = null;

    while (list) {
        mul = num * list.value + carry;

        if (resultList) {
            resultList.next = new Node(mul % 10);
            resultList = resultList.next;
        } else {
            headOfResult = new Node(mul % 10);
            resultList = headOfResult;
        }
        carry = Math.floor(mul / 10);
        list = list.next;
    }

    if (carry > 0) {
        resultList.next = new Node(carry);
    }

    return headOfResult;
}

function shiftListByZeros(headNode, digitsCounter) {
    if (digitsCounter > 0) {
        while (digitsCounter > 0) {
            headNode = new Node(0, headNode);
            --digitsCounter;
        }
    }
    return headNode;
}

function sumLists(headNode1, headNode2, carry = 0) {
    let sum = 0;
    let summaryList, newSummaryListHead = null;

    while (headNode1 || headNode2) {
        if (headNode1) {
            sum = sum + headNode1.value;
            headNode1 = headNode1.next;
        }
        if (headNode2) {
            sum = sum + headNode2.value;
            headNode2 = headNode2.next;
        }

        sum += carry;

        if (summaryList) {
            summaryList.next = new Node(sum % 10);
            summaryList = summaryList.next;
        } else {
            newSummaryListHead = new Node(sum % 10);
            summaryList = newSummaryListHead;
        }
        carry = Math.floor(sum / 10);
        sum = 0;
    }
    return newSummaryListHead;
}

function multiplyLists(headNode1, headNode2) {
    let multListsArr = [];

    while (headNode2) {
        multListsArr.push(multiplyListByNumber(headNode1, headNode2.value));
        headNode2 = headNode2.next;
    }

    multListsArr.forEach((list, index) => {
        multListsArr[index] = shiftListByZeros(list, index);
    });

    return multListsArr.reduce((accumulator, currentList) => {
        return sumLists(accumulator, currentList);
    });

}

const headNodeOfList1 = new Node(7, new Node(1, new Node(6, new Node(2))));
const headNodeOfList2 = new Node(5, new Node(9, new Node(2)));
const multipliedHeadNode = multiplyLists(headNodeOfList1, headNodeOfList2);

// result
console.log(multipliedHeadNode);


