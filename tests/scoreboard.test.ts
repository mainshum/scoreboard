import { describe, it, expect } from 'vitest';

import { createScoreboard, createNewGame } from '../src/scoreboard';

const getRandomInteger = (max: number) => Math.floor(Math.random() * max);

describe('Scoreboard', () => {
  describe('startGame', () => {
    it('summary returns K 0-0 scores for teams if K distinct games started and no updates', () => {
      const sb = createScoreboard();

      const K = getRandomInteger(20);

      for (let k = 0; k < K; k++) {
        sb.startGame(createNewGame(`home${k}`, `away${k}`));
      }

      const summary = sb.getSummary();

      expect(summary.length).toBe(K);

      summary.forEach(({ gameStats }) => {
        expect(gameStats.home.score).toBe(0);
        expect(gameStats.away.score).toBe(0);
      });
    });
    it('throws an error if a game is started with the same team twice', () => {
      const sb = createScoreboard();

      sb.startGame(createNewGame('steven', 'seagal'));

      expect(() => {
        sb.startGame(createNewGame('steven', 'seagal'));
      }).toThrowError();

      expect(() => {
        sb.startGame(createNewGame('steven', 'x'));
      }).toThrowError();
      expect(() => {
        sb.startGame(createNewGame('x', 'seagal'));
      }).toThrowError();
    });
  });
  describe('updateScore', () => {
    it('equals 2-1 for home team if home team scores twice and away once', () => {
      const sb = createScoreboard();

      const game = sb.startGame(createNewGame('steven', 'seagal'));

      game.incrementHome();
      game.incrementHome();
      game.incrementAway();

      const { gameStats } = game;

      expect(gameStats.home.score).toBe(2);
      expect(gameStats.away.score).toBe(1);

      const summary = sb.getSummary();
      expect(summary.length).eq(1);
    });
  });
  describe('finishGame', () => {
    it('removes the game from the summary if started', () => {
      const sb = createScoreboard();
      const g = sb.startGame(createNewGame('steven', 'seagal'));

      expect(sb.getSummary().length).toBe(1);

      sb.finishGame(g);

      expect(sb.getSummary().length).toBe(0);
    });

    it('has no effect on summary if if game not started', () => {
      const sb = createScoreboard();
      sb.startGame(createNewGame('steven', 'seagal'));

      const cnt = sb.getSummary().length;

      sb.finishGame(createNewGame('a', 'b'));

      expect(sb.getSummary().length).toBe(cnt);
    });
    it('has no effect if game finished twice', () => {
      const sb = createScoreboard();
      const game = sb.startGame(createNewGame('steven', 'seagal'));
      const game2 = sb.startGame(createNewGame('steven2', 'seagal2'));

      const cnt0 = sb.getSummary().length;

      sb.finishGame(game);
      const cnt1 = sb.getSummary().length;
      sb.finishGame(game);

      expect(cnt0).toBe(2);
      expect(cnt1).toBe(1);

      expect(sb.gamePending(game)).toBe(false);
      expect(sb.gamePending(game2)).toBe(true);
    });
  });
  describe('getSummary', () => {
    it('returns a copy of the summary', () => {
      const sb = createScoreboard();

      const in0 = sb.startGame(createNewGame('Mexico', 'Canada', 0, 5)); //0
      const in1 = sb.startGame(createNewGame('Spain', 'Brazil', 10, 2)); // 1
      const in2 = sb.startGame(createNewGame('Germany', 'France', 2, 2)); // 2
      const in3 = sb.startGame(createNewGame('Uruguay', 'Italy', 6, 6)); // 3
      const in4 = sb.startGame(createNewGame('Argentina', 'Australia', 3, 1)); // 4

      const summary = sb.getSummary();
      expect(summary.length).toBe(5);

      const [out0, out1, out2, out3, out4] = summary;

      expect(out0.gameStats).toEqual(in3.gameStats);
    });
  });
});
