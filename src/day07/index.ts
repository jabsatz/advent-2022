import run from "aocrunner";
import lodash from "lodash";

type File = { type: "file"; size: number };

type Folder = {
  type: "dir";
  content: Tree;
};

type SizedFolder = Folder & {
  size: number;
  content: SizedTree;
};

type Tree = {
  [key: string]: File | Folder;
};

type SizedTree = {
  [key: string]: File | SizedFolder;
};

const parseInput = (rawInput: string) => {
  const input = rawInput.split("\n");

  const structure: Tree = {};
  const path: string[] = [];

  input.forEach((line) => {
    const match = line.match(/\S+$/);
    if (!match) {
      throw new Error(`no match for last param in line ${line}`);
    }
    if (line.startsWith("$ cd")) {
      if (match[0] === "..") {
        path.pop();
        path.pop();
      } else {
        path.push(match[0]);
        lodash.set(structure, path, { type: "dir", content: {} });
        path.push("content");
      }
    } else if (line.match(/^\d+/)) {
      const size = Number(line.match(/^\d+/)?.[0]);
      if (isNaN(size)) {
        throw new Error(`cannot parse size for line ${line}`);
      }
      lodash.set(structure, [...path, match[0]], { type: "file", size });
    }
  });

  return structure;
};

const isFolder = (node: File | Folder): node is Folder | SizedFolder =>
  node.type === "dir";

const calculateSizes = (structure: Tree): SizedTree => {
  let newStructure: SizedTree = {};
  Object.entries(structure).forEach(([key, value]) => {
    if (isFolder(value)) {
      if (!value.content) {
        throw new Error(
          `no content in key ${key} in the structure ${structure}`,
        );
      }
      const sizedContent = calculateSizes(value.content);
      newStructure[key] = {
        type: "dir",
        content: sizedContent,
        size: lodash.sum(Object.values(sizedContent).map((val) => val.size)),
      };
    } else {
      newStructure[key] = value;
    }
  });
  return newStructure;
};

const getTotalSize = (structure: SizedTree) => {
  const MAX_SIZE = 100000;
  let totalSize = 0;

  Object.values(structure).forEach((node) => {
    if (node.type === "dir" && node.size <= MAX_SIZE) {
      totalSize += node.size;
    }
    if (node.type === "dir") {
      totalSize += getTotalSize(node.content);
    }
  });

  return totalSize;
};

const part1 = (rawInput: string) => {
  const structure = parseInput(rawInput);

  const structureWithSizes = calculateSizes(structure);

  return getTotalSize(structureWithSizes);
};

const listAllFolders = (structure: SizedTree): SizedFolder[] => {
  return (
    Object.values(structure).filter((node) => isFolder(node)) as SizedFolder[]
  ).flatMap((folder) => [folder, ...listAllFolders(folder.content)]);
};

const part2 = (rawInput: string) => {
  const structure = parseInput(rawInput);

  const structureWithSizes = calculateSizes(structure);

  const rootSize = structureWithSizes["/"].size;
  const freeSpace = 70000000 - rootSize;
  const requiredSpace = 30000000 - freeSpace;
  const allFolders = listAllFolders(structureWithSizes);

  return allFolders
    .filter((folder) => folder.size >= requiredSpace)
    .sort((a, b) => (a.size > b.size ? 1 : -1))[0].size;
};

run({
  part1: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k
        `,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          $ cd /
          $ ls
          dir a
          14848514 b.txt
          8504156 c.dat
          dir d
          $ cd a
          $ ls
          dir e
          29116 f
          2557 g
          62596 h.lst
          $ cd e
          $ ls
          584 i
          $ cd ..
          $ cd ..
          $ cd d
          $ ls
          4060174 j
          8033020 d.log
          5626152 d.ext
          7214296 k
        `,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
