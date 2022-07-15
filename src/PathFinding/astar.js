import {
    PriorityQueue,
    MinPriorityQueue,
    MaxPriorityQueue,
    ICompare,
    IGetCompareValue,
  } from '@datastructures-js/priority-queue';

export function astar(nodes, startRow, startCol, targetRow, targetCol) {

}


function getNeighbors(nodes, row, col) {
    var neighbors = [];

    //left
    if (col - 1 >= 0) {
        neighbors.push(nodes[row][col - 1]);
    }

    //right
    if (col + 1 < nodes[row].length) {
        neighbors.push(nodes[row][col + 1]);
    }

    //down
    if (row + 1 < nodes.length) {
        neighbors.push(nodes[row + 1][col]);
    }

    //up
    if (row -1 >= 0) {
        neighbors.push(nodes[row - 1][col]);
    }
    return neighbors;
}