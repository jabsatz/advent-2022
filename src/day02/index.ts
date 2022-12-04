import run from "aocrunner";

type RockPaperScissor = "A" | "B" | "C";
type PlayerPick = "X" | "Y" | "Z";

const points = {
  A: 1,
  B: 2,
  C: 3,
};

const matchup: Record<RockPaperScissor, Record<RockPaperScissor, 0 | 3 | 6>> = {
  A: {
    A: 3,
    B: 0,
    C: 6,
  },
  B: {
    A: 6,
    B: 3,
    C: 0,
  },
  C: {
    A: 0,
    B: 6,
    C: 3,
  },
};

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => line.split(" ") as [RockPaperScissor, PlayerPick]);

const play = (
  enemyPick: RockPaperScissor,
  playerPick: RockPaperScissor,
): number => {
  return matchup[playerPick][enemyPick];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pick: Record<PlayerPick, RockPaperScissor> = {
    X: "A",
    Y: "B",
    Z: "C",
  };

  return input.reduce((total, [enemyPick, playerPick]) => {
    const finalPlayerPick = pick[playerPick];
    return total + play(enemyPick, finalPlayerPick) + points[finalPlayerPick];
  }, 0);
};

const getMatchup = (
  enemyPick: RockPaperScissor,
  playerPick: PlayerPick,
): RockPaperScissor => {
  const possibleEnemyResults = Object.entries(matchup[enemyPick]) as [
    RockPaperScissor,
    0 | 3 | 6,
  ][];

  const result = possibleEnemyResults.find(([_, pointsForEnemy]) => {
    return (
      (pointsForEnemy === 6 && playerPick === "X") ||
      (pointsForEnemy === 3 && playerPick === "Y") ||
      (pointsForEnemy === 0 && playerPick === "Z")
    );
  });

  // a veces te odio typescript
  if (!result)
    throw new Error(
      `Cannot decide matchup between ${enemyPick} and ${playerPick}`,
    );

  return result[0];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((total, [enemyPick, playerPick]) => {
    const finalPlayerPick = getMatchup(enemyPick, playerPick);
    return total + play(enemyPick, finalPlayerPick) + points[finalPlayerPick];
  }, 0);
};

run({
  part1: {
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          A Y
          B X
          C Z
        `,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
