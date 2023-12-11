/* complexCode.js */

// This code generates a maze using the Depth-First Search algorithm and then solves it using the A* algorithm.

// Define the size of the maze
const rows = 15;
const columns = 15;

// Create a grid to represent the maze
const grid = new Array(rows);
for (let i = 0; i < rows; i++) {
  grid[i] = new Array(columns);
}

// Define the structure of a cell in the grid
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.visited = false;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }
}

// Initialize the grid with cells
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < columns; col++) {
    grid[row][col] = new Cell(row, col);
  }
}

// Generate the maze using the Depth-First Search algorithm
const stack = [];
let currentCell = grid[0][0];
currentCell.visited = true;

function getRandomNeighbor(cell) {
  const neighbors = [];

  // Top neighbor
  if (cell.row > 0 && !grid[cell.row - 1][cell.col].visited) {
    neighbors.push(grid[cell.row - 1][cell.col]);
  }

  // Right neighbor
  if (cell.col < columns - 1 && !grid[cell.row][cell.col + 1].visited) {
    neighbors.push(grid[cell.row][cell.col + 1]);
  }

  // Bottom neighbor
  if (cell.row < rows - 1 && !grid[cell.row + 1][cell.col].visited) {
    neighbors.push(grid[cell.row + 1][cell.col]);
  }

  // Left neighbor
  if (cell.col > 0 && !grid[cell.row][cell.col - 1].visited) {
    neighbors.push(grid[cell.row][cell.col - 1]);
  }

  if (neighbors.length > 0) {
    const randomIndex = Math.floor(Math.random() * neighbors.length);
    return neighbors[randomIndex];
  }

  return null;
}

function removeWalls(currentCell, neighborCell) {
  if (currentCell.row === neighborCell.row && currentCell.col < neighborCell.col) {
    currentCell.walls.right = false;
    neighborCell.walls.left = false;
  } else if (currentCell.row === neighborCell.row && currentCell.col > neighborCell.col) {
    currentCell.walls.left = false;
    neighborCell.walls.right = false;
  } else if (currentCell.col === neighborCell.col && currentCell.row > neighborCell.row) {
    currentCell.walls.top = false;
    neighborCell.walls.bottom = false;
  } else if (currentCell.col === neighborCell.col && currentCell.row < neighborCell.row) {
    currentCell.walls.bottom = false;
    neighborCell.walls.top = false;
  }
}

while (true) {
  const nextCell = getRandomNeighbor(currentCell);

  if (nextCell) {
    stack.push(currentCell);
    removeWalls(currentCell, nextCell);
    currentCell = nextCell;
    currentCell.visited = true;
  } else if (stack.length > 0) {
    currentCell = stack.pop();
  } else {
    break;
  }
}

// Solve the maze using the A* algorithm
class Node {
  constructor(row, col, parent) {
    this.row = row;
    this.col = col;
    this.parent = parent;
    this.g = 0; // Cost from start node to current node
    this.h = 0; // Heuristic (estimated cost from current node to end node)
    this.f = 0; // Total cost (g + h)
  }
}

const startNode = new Node(0, 0, null);
const endNode = new Node(rows - 1, columns - 1, null);

const openSet = [startNode];
const closedSet = [];

function calculateHeuristic(node) {
  return Math.abs(node.row - endNode.row) + Math.abs(node.col - endNode.col);
}

function isValidPosition(row, col) {
  return row >= 0 && row < rows && col >= 0 && col < columns;
}

function isValidNeighbor(row, col, parent) {
  if (!isValidPosition(row, col)) {
    return false;
  }

  const cell = grid[row][col];

  if (cell.walls.top && parent.row > row) {
    return false;
  }

  if (cell.walls.right && parent.col < col) {
    return false;
  }

  if (cell.walls.bottom && parent.row < row) {
    return false;
  }

  if (cell.walls.left && parent.col > col) {
    return false;
  }

  return true;
}

function getValidNeighbors(node) {
  const { row, col } = node;
  const neighbors = [];

  if (isValidNeighbor(row - 1, col, node)) {
    neighbors.push(new Node(row - 1, col, node));
  }

  if (isValidNeighbor(row, col + 1, node)) {
    neighbors.push(new Node(row, col + 1, node));
  }

  if (isValidNeighbor(row + 1, col, node)) {
    neighbors.push(new Node(row + 1, col, node));
  }

  if (isValidNeighbor(row, col - 1, node)) {
    neighbors.push(new Node(row, col - 1, node));
  }

  return neighbors;
}

function isNodeInSet(node, set) {
  for (const n of set) {
    if (node.row === n.row && node.col === n.col) {
      return true;
    }
  }

  return false;
}

function updateCosts(node, neighborNode) {
  const newG = node.g + 1;

  if (newG < neighborNode.g) {
    neighborNode.parent = node;
    neighborNode.g = newG;
    neighborNode.f = newG + neighborNode.h;
  }
}

function reconstructPath() {
  const path = [];
  let node = endNode;

  while (node !== null) {
    path.unshift([node.row, node.col]);
    node = node.parent;
  }

  return path;
}

let solutionFound = false;

while (openSet.length > 0) {
  let currentNode = openSet[0];
  let currentIndex = 0;

  // Find the node with the lowest f value
  for (let i = 1; i < openSet.length; i++) {
    if (openSet[i].f < currentNode.f) {
      currentNode = openSet[i];
      currentIndex = i;
    }
  }

  // Move the current node from the open set to the closed set
  openSet.splice(currentIndex, 1);
  closedSet.push(currentNode);

  // Check if the current node is the goal node
  if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
    solutionFound = true;
    break;
  }

  const neighbors = getValidNeighbors(currentNode);

  for (const neighbor of neighbors) {
    if (isNodeInSet(neighbor, closedSet)) {
      continue;
    }

    updateCosts(currentNode, neighbor);

    if (!isNodeInSet(neighbor, openSet)) {
      neighbor.h = calculateHeuristic(neighbor);
      neighbor.f = neighbor.g + neighbor.h;
      openSet.push(neighbor);
    }
  }
}

if (solutionFound) {
  const path = reconstructPath();
  console.log(path); // Output the path from start to end
} else {
  console.log("No solution found!");
}