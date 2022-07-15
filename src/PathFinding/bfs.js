

export function bfs(nodes, startRow, startCol, targetRow, targetCol) {

    console.log("Running bfs");
    nodes[startRow][startCol].explored = true;
    
    var queue = [];
    var visited = [];

    queue.unshift(nodes[startRow][startCol]);

    while (queue.length > 0) {
        var temp = queue.pop();
        visited.push(temp);
        if (temp.row === targetRow && temp.col === targetCol) {
            return visited;
        }

        var n = getNeighbors(nodes, temp.row, temp.col);
        for (let i = 0; i < n.length; i++) {
            if (n[i].type === false && n[i].explored === false) {
                n[i].explored = true;
                n[i].previous = temp;
                queue.unshift(n[i]);
            }
        }
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