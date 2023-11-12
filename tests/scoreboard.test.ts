import { describe, it, expect } from 'vitest';

import { createGame, createScoreboard, updateGame } from '../src/scoreboard';

const getRandomInteger = (max: number) => Math.floor(Math.random() * max);

describe('Scoreboard', () => {
  describe('startGame', () => {
    it('summary returns K 0-0 scores for teams if K distinct games started and no updates', () => {
      const sb = createScoreboard();

      const K = getRandomInteger(20);

      for (let k = 0; k < K; k++) {
        sb.startGame(createGame(`home${k}`, `away${k}`));
      }

      const summary = sb.getSummary();

      expect(summary.length).toBe(K);

      summary.forEach((game) => {
        expect(game.home.score).toBe(0);
        expect(game.away.score).toBe(0);
      });
    });
    it('throws an error if a game is started with the same team twice', () => {
      const sb = createScoreboard();

      sb.startGame(createGame('steven', 'seagal'));

      expect(() => {
        sb.startGame(createGame('steven', 'seagal'));
      }).toThrowError();

      expect(() => {
        sb.startGame(createGame('steven', 'x'));
      }).toThrowError();
      expect(() => {
        sb.startGame(createGame('x', 'seagal'));
      }).toThrowError();
    });
  });
  describe('updateScore', () => {
    it('equals 2-1 for home team if home team scores twice and away once', () => {
      const sb = createScoreboard();

      const game = sb.startGame(createGame('steven', 'seagal'));

      sb.updateScore(game, updateGame.incrementHome);
      sb.updateScore(game, updateGame.incrementHome);
      sb.updateScore(game, updateGame.incrementAway);

      expect(game.home.score).toBe(2);
      expect(game.away.score).toBe(1);

      const summary = sb.getSummary();

      expect(summary.length).eq(1);
      expect(summary[0]).toEqual({ home: { name: 'steven', score: 2 }, away: { name: 'seagal', score: 1 } });
    });
  });
  describe('finishGame', () => {
    it('removes the game from the summary if started', () => {
      const sb = createScoreboard();
      const g = sb.startGame(createGame('steven', 'seagal'));

      expect(sb.getSummary().length).toBe(1);

      sb.finishGame(g);

      expect(sb.getSummary().length).toBe(0);
    });

    it('has no effect on summary if if game not started', () => {
      const sb = createScoreboard();
      sb.startGame(createGame('steven', 'seagal'));

      const cnt = sb.getSummary().length;

      sb.finishGame({ home: { name: 'x', score: 0 }, away: { name: 'y', score: 0 } });

      expect(sb.getSummary().length).toBe(cnt);
    });
    it('has no effect if game finished twice', () => {
      const sb = createScoreboard();
      const game = sb.startGame(createGame('steven', 'seagal'));
      const game2 = sb.startGame(createGame('steven2', 'seagal2'));

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
});
