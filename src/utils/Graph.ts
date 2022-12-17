export type Edge = {
  from: string;
  to: string;
  weight: number;
};

export type Node = {
  key: string;
  edges: Edge[];
};

export class DirectedNodeGraph {
  nodes: Record<string, Node>;

  constructor() {
    this.nodes = {};
  }

  addNode(key: string) {
    this.nodes[key] = { key, edges: [] };
  }

  addEdge(from: string, to: string, weight = 1) {
    if (!this.nodes[from]) {
      this.addNode(from);
    }
    if (!this.nodes[to]) {
      this.addNode(to);
    }
    this.nodes[from].edges.push({ from: from, to: to, weight });
  }
}

export class BidirectedNodeGraph {
  nodes: Record<string, Node>;

  constructor() {
    this.nodes = {};
  }

  addNode(key: string) {
    this.nodes[key] = { key, edges: [] };
  }

  addEdge(node1: string, node2: string, weight = 1) {
    if (!this.nodes[node1]) {
      this.addNode(node1);
    }
    if (!this.nodes[node2]) {
      this.addNode(node2);
    }
    this.nodes[node1].edges.push({ from: node1, to: node2, weight });
    this.nodes[node2].edges.push({ from: node2, to: node1, weight });
  }
}
