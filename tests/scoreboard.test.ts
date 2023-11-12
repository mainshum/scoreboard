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

      sb.startGame(createNewGame('Mexico', 'Poland'));

      expect(() => {
        sb.startGame(createNewGame('Mexico', 'Poland'));
      }).toThrowError();

      expect(() => {
        sb.startGame(createNewGame('Mexico', 'x'));
      }).toThrowError();
      expect(() => {
        sb.startGame(createNewGame('x', 'Poland'));
      }).toThrowError();
    });
  });
  describe('updateScore', () => {
    it('equals 2-1 for home team if home team scores twice and away once', () => {
      const sb = createScoreboard();

      const game = sb.startGame(createNewGame('Mexico', 'Poland'));

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
      const g = sb.startGame(createNewGame('Mexico', 'Poland'));

      expect(sb.getSummary().length).toBe(1);

      sb.finishGame(g);

      expect(sb.getSummary().length).toBe(0);
    });

    it('has no effect on summary if if game not started', () => {
      const sb = createScoreboard();
      sb.startGame(createNewGame('Mexico', 'Poland'));

      const cnt = sb.getSummary().length;

      sb.finishGame(createNewGame('a', 'b'));

      expect(sb.getSummary().length).toBe(cnt);
    });
    it('has no effect if game finished twice', () => {
      const sb = createScoreboard();
      const game = sb.startGame(createNewGame('Mexico', 'Poland'));
      const game2 = sb.startGame(createNewGame('Mexico2', 'Poland2'));

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
    it('returns in score order if all total scores differ', () => {
      const sb = createScoreboard();

      const in0 = sb.startGame(createNewGame('Mexico', 'Canada', 0, 5)); // 5
      const in1 = sb.startGame(createNewGame('Spain', 'Brazil', 10, 2)); //12
      const in2 = sb.startGame(createNewGame('Germany', 'France', 2, 2)); // 4

      const summary = sb.getSummary();
      expect(summary.length).toBe(3);
      const [out0, out1, out2] = summary;

      expect(out0.gameStats).toEqual(in1.gameStats);
      expect(out1.gameStats).toEqual(in0.gameStats);
      expect(out2.gameStats).toEqual(in2.gameStats);
    });
    it('returns in score order and recency order, if total scores for multiple games are equal, ', () => {
      const sb = createScoreboard();

      const in0 = sb.startGame(createNewGame('Mexico', 'Canada', 0, 5)); // 5
      const in1 = sb.startGame(createNewGame('Spain', 'Brazil', 10, 2)); //12
      const in2 = sb.startGame(createNewGame('Germany', 'France', 2, 2)); // 4
      const in3 = sb.startGame(createNewGame('Uruguay', 'Italy', 6, 6)); // 12
      const in4 = sb.startGame(createNewGame('Argentina', 'Australia', 3, 1)); // 4

      const summary = sb.getSummary();
      expect(summary.length).toBe(5);

      const [out0, out1, out2, out3, out4] = summary;

      expect(out0.gameStats).toEqual(in3.gameStats);
      expect(out1.gameStats).toEqual(in1.gameStats);
      expect(out2.gameStats).toEqual(in0.gameStats);
      expect(out3.gameStats).toEqual(in4.gameStats);
      expect(out4.gameStats).toEqual(in2.gameStats);
    });
  });
});
