import {
    PriorityQueue,
    MinPriorityQueue,
    MaxPriorityQueue,
    ICompare,
    IGetCompareValue,
  } from '@datastructures-js/priority-queue';



export function dijistras(nodes, startRow, startCol, targetRow, targetCol) {

    console.log("Running dijistras");
    
    nodes[startRow][startCol].distance = 0;

    var visited = [];

    const pq = new PriorityQueue((a, b) => { //construct prioritiy queue with comparator
        if (a.distance < b.distance) {
            return -1;
        } else if (a.distance > b.distance) {
            return 1;
        }
        return 0;
    });

    pq.enqueue(nodes[startRow][startCol]);

    //while priority queue is not empty
    while (pq.isEmpty() === false) {
        var temp = pq.dequeue();
        visited.push(temp);


        nodes[temp.row][temp.col].explored = true;
        var n = getNeighbors(nodes, temp.row, temp.col);
        //iterate through the neighbors
        for (let i = 0; i < n.length; i++) {
            //check to see if it is unexplored
            var adjacent = nodes[n[i].row][n[i].col];
            if (adjacent.explored === false && adjacent.type === false) {
                var dist = temp.distance + adjacent.weight;
                //if the new dist is less than the current, than we update it
                if (dist < adjacent.distance) {
                    console.log(dist);
                    adjacent.distance = dist;
                    adjacent.previous = temp; //set its previous
                    pq.enqueue(adjacent);
                }
            }

        }
    }


    //See if there is actually a path
    if (nodes[targetRow][targetCol].distance !== Infinity) {
        console.log("THERE IS A PATH");
    }
    return visited;

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
