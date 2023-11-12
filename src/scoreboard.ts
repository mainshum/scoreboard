type Team = string;
type Teams = {
  home: Team;
  away: Team;
};

type Game = {
  home: { name: Team; score: number };
  away: { name: Team; score: number };
};

type GameUpdate = (game: Game) => Game;

export const createNewGame = (home: Team, away: Team): Game => ({
  home: { name: home, score: 0 },
  away: { name: away, score: 0 },
});

export const updateGame = {
  incrementHome: (g: Game) => {
    g.home.score++;
    return g;
  },
  incrementAway: (g: Game) => {
    g.away.score++;
    return g;
  },
  setScore: (g: Game, homeScore: number, awayScore: number) => {
    g.home = { ...g.home, score: homeScore };
    g.away = { ...g.away, score: awayScore };
    return g;
  },
};

export const createGame = (home: Team, away: Team, scoreHome?: number, scoreAway?: number): Game => ({
  home: { name: home, score: scoreHome || 0 },
  away: { name: away, score: scoreAway || 0 },
});

export const createScoreboard = () => {
  const games: Game[] = [];
  const teamsPlaying = new Set<Team>();

  const startGame = (game: Game) => {
    const { home, away } = game;
    const found = teamsPlaying.has(home.name) || teamsPlaying.has(away.name);

    if (found) throw new Error(`${home} or ${away} already playing`);

    games.push(game);
    teamsPlaying.add(home.name);
    teamsPlaying.add(away.name);

    return game;
  };

  const updateScore = (gameToUpdate: Game, update: GameUpdate) => update(gameToUpdate);

  const gamePending = (game: Game) => games.includes(game);

  const finishGame = (game: Game) => {
    const index = games.findIndex((g) => g === game);
    if (index === -1) return;

    games.splice(index, 1);

    teamsPlaying.delete(game.home.name);
    teamsPlaying.delete(game.away.name);
  };

  const getSummary = () => {
    return games;
  };

  return {
    startGame,
    updateScore,
    finishGame,
    gamePending,
    getSummary,
  };
};
