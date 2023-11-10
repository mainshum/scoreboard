type Team = string;
type TeamScore = { name: Team; score: number };
type Game = {
  home: TeamScore;
  away: TeamScore;
};

export const Scoreboard = () => {
  const games: Game[] = [];

  const startGame = (home: Team, away: Team) => {
    games.push({
      home: { name: home, score: 0 },
      away: { name: away, score: 0 },
    });
  };

  const updateScore = (team: Team, amount: number) => {
    return this;
  };

  const finishGame = () => {};

  const getSummary = () => {
    return games;
  };

  return {
    startGame,
    updateScore,
    finishGame,
    getSummary,
  };
};
