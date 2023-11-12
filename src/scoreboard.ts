type Team = string;

export const createNewGame = (home: Team, away: Team, scoreHome?: number, scoreAway?: number) => ({
  gameStats: { home: { name: home, score: scoreHome || 0 }, away: { name: away, score: scoreAway || 0 } },
  incrementHome() {
    this.gameStats.home.score++;
    return this;
  },
  incrementAway() {
    this.gameStats.away.score++;
    return this;
  },
  totalScore() {
    return this.gameStats.home.score + this.gameStats.away.score;
  },
  containsTeam(team: Team) {
    return this.gameStats.home.name === team || this.gameStats.away.name === team;
  },
});

type Game = ReturnType<typeof createNewGame>;

export const createScoreboard = () => {
  const games: Game[] = [];

  const startGame = (game: Game): Game => {
    const {
      gameStats: { home, away },
    } = game;

    const found = games.find((g) => g.containsTeam(home.name) || g.containsTeam(away.name));

    if (found) throw new Error(`${found.gameStats} already started`);

    games.push(game);

    return game;
  };

  const gamePending = (game: Game) => games.includes(game);

  const finishGame = (game: Game) => {
    const index = games.findIndex((g) => g === game);
    if (index === -1) return;

    games.splice(index, 1);
  };

  const getSummary = () => {
    return games;
  };

  return {
    startGame,
    finishGame,
    gamePending,
    getSummary,
  };
};
