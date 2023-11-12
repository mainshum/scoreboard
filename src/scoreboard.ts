type Team = string;
type Teams = {
  home: Team;
  away: Team;
};
type Game = Teams & {
  score: number;
};

export const Scoreboard = () => {
  const games: Game[] = [];

  const startGame = ({ home, away }: Teams) => {
    const found = games.find((g) => g.home === home || g.away === away);

    if (found) throw new Error(`${home} or ${away} already playing}`);

    games.push({
      home,
      away,
      score: 0,
    });
  };

  const updateScore = (updated: Game) => {
    return this;
  };

  const finishGame = (teams: Teams) => {};

  const getSummary = () => {
    return games;
  };

  const countGames = () => games.length;

  return {
    startGame,
    updateScore,
    finishGame,
    getSummary,
  };
};
