export function dfs(nodes, startRow, startCol, targetRow, targetCol) {
    console.log("running dfs");
    var stack = [];
    var visited = [];

    stack.push(nodes[startRow][startCol]);

    while (stack.length > 0) {
        var top = stack.pop();
        nodes[top.row][top.col].explored = true;
        visited.push(top);
        var neighbors = getNeighbors(nodes, top.row, top.col);
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i].explored === false && neighbors[i].type === false) {
                neighbors[i].previous = top;
                if (neighbors[i].row === targetRow && neighbors[i].col === targetCol) {
                    console.log("DFS found proper path");
                    neighbors[i].explored = true;
                    return visited;
                }
                stack.push(neighbors[i]);
            }
        }
    }

    console.log("DJS failed to find proper path");
    return visited;
}



function getNeighbors(nodes, row, col) {
    var neighbors = [];

    //left
    if (col - 1 >= 0) {
        neighbors.push(nodes[row][col - 1]);
    }

    //up
    if (row -1 >= 0) {
        neighbors.push(nodes[row - 1][col]);
    }

    //down
    if (row + 1 < nodes.length) {
        neighbors.push(nodes[row + 1][col]);
    }
    
    //right
    if (col + 1 < nodes[row].length) {
        neighbors.push(nodes[row][col + 1]);
    }


    return neighbors;
}
