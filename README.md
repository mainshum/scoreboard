# Scoreboard

Set of utilities to track scores for a set of games ⚽️

## Api

### Game initialization

- `createNewGame: (home: Team, away: Team, scoreHome?: number, scoreAway?: number) => Game`

  Creates a new `Game` instance. If `scoreHome` or `scoreAway` are not passed, they default to 0.

#### Instance methods:

- `incrementHome: () => Game`

  Increment home team score by 1, returns modified `Game` instance.

- `incrementAway: () => Game`

  Increment away team score by 1, returns modified `Game` instance.

- `totalScore: () => number`

  Home score + away score

- `containsTeam: (t: Team) => boolean`

  Checks if team `t` is currently playing in this game

### Game tracking

- `createScoreboard: () => Scoreboard`

  Factory method which creates a new scoreboard instance and returns the game `g` that got passed.

#### Instance methods

- `startGame: (g: Game) => Game`

  Inits new game. If any of the teams is already at play it throws an exception.

- `gamePending: (g: Game) => boolean`

  Check if game is on (`g` passed by reference)

- `finishGame: (g: Game) => void`

  Remove `g` from the scoreboard (`g` passed by reference). If no match found this method does nothing.

- `getSummary: () => Game[]`

  Get a summary of games in progress ordered by their total score. The games with the same total score will be returned ordered by the most recently started match in the scoreboard.

## Example

```
npm i @mainshum/scoreboard
import {createScoreboard, createNewGame} from '@mainshum/scoreboard';

const scoreboard = createScoreboard();
const game = createNewGame('Claude', 'Van Damme');

scoreboard.startGame(game);

game.incrementHome();
game.incrementAway();

console.log(scoreboard.getSummary()[0].gameStats); // { home: { name: 'Claude', score: 1 }, away: { name: 'Van Damme', score: 1 } }
```
