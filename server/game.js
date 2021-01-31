export default class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.size = this.width * this.height;
    this.visited = new Array(this.size);
    this.adj = new Array(this.size); // max length = 4
    // 2d array: [[node, adjlist], ...]
  }

  get(x, y) {
    // x: row
    // y: column
    return x * this.height + this.width;
  }

  /*
  build() {
    // build adjacency list
    for (var i = 0; i < this.size; i++) { // each i represents a node
      var node_adj = [i, []];
      var neighbors = [i - this.width, i - 1, i + 1, i + this.width];
      for (var j = 0; j < neighbors.length; j++) {
        if (no black line between i and neighbors[i]) { // idk how to translate that to code
          node_adj[1].push(neighbors[i]);
        }
      }
      this.adj.push(node_adj);
    }



    var node_adj = [node(x, y), []];
    neighbors = [node(x + -1, y), node(x, y + -1)];
    for (var i = 0; i < neighbors.length; i++) {
      if (no black line between cur and neighbors[i]) {
        node_adj[1].push(n);
      }
    }
    this.adj.push(node_adj);
  }
  */

  gen() {
    const dx = [-1, 1, 0, 0];
    const dy = [0, 0, -1, 1];
    this.visited.fill(false);
    for (let i = 0; i < this.size; i++)
      this.adj[i] = [];

    let stack = [];
    this.visited[0] = true;
    stack.push({ x: 0, y: 0 });
    while (stack.length > 0) {
      let { ux, uy } = stack.pop();
      let neighbors = []
      for (let i = 0; i < 4; i++) {
        let vx = ux + dx[i];
        let vy = uy + dy[i];
        if (vx < 0 || vx >= this.height) continue;
        if (vy < 0 || vy >= this.width) continue;
        let v = get(vx, vy);
        if (this.visited[v]) continue;
        neighbors.push({ x: vx, y: vy });
      }
      if (neighbors.length > 0) {
        let {vx, vy} = randomChoice(neighbors);
        let v = get(vx, vy);
        this.visited[v] = true;
        stack.push({x : vx, y : vy});
      }
    }
  }

  static randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}