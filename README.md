# Scoreboard

Set of utilities to track scores for a set of games ⚽️

## Api

### Game initialization

- `createNewGame: (home: Team, away: Team, scoreHome?: number, scoreAway?: number) => Game`

  Creates a new `Game` instance. If `scoreHome` or `scoreAway` are not passed, they default to 0.

### Game tracking

Start by initializing a new Scoreboard using `createScoreboard` factory method, which returns a new instance of `Scoreboard` with the following methods:

- `startGame: (g: Game) => Game`

  Inits new game. If any of the teams is already at play it throws an exception.

- `gamePending: (g: Game) => boolean`

  Check if game is on (`g` passed by reference)

- `finishGame: (g: Game) => void`

  Remove `g` from the scoreboard (`g` passed by reference). If no match found this method does nothing.

- `getSummary: () => Game[]`

  Get a summary of games in progress ordered by their total score. The games with the same total score will be returned ordered by the most recently started match in the scoreboard.
