import { describe, it, expect } from 'vitest';

import { Scoreboard } from '../src/scoreboard';

const getRandomInteger = (max: number) => Math.floor(Math.random() * max);

describe('Scoreboard', () => {
  describe('startGame', () => {
    it.only('summary returns K 0-0 scores for teams if K distinct games started and no updates', () => {
      const sb = Scoreboard();

      const K = getRandomInteger(20);

      for (let k = 0; k < K; k++) {
        sb.startGame({ home: `home${k}`, away: `away${k}` });
      }

      const summary = sb.getSummary();

      expect(summary.length).toBe(K);

      summary.forEach((game) => {
        expect(game.score).toBe(0);
      });
    });
    it('throws an error if a game is started with the same team twice', () => {
      const sb = Scoreboard();

      sb.startGame({ home: 'steven', away: 'seagal' });

      expect(() => {
        sb.startGame({ home: 'steven', away: 'seagal' });
      }).toThrowError();

      expect(() => {
        sb.startGame({ home: 'x', away: 'steven' });
      }).toThrowError();
      expect(() => {
        sb.startGame({ home: 'steven', away: 'x' });
      }).toThrowError();
    });
  });
  describe('finishhGame', () => {
    it('has no effect if unpresent game passed', () => {
      const sb = Scoreboard();
      sb.startGame({ home: 'steven', away: 'seagal' });

      const cnt = sb.countGames();

      sb.finishGame({ home: 'x', away: 'y' });

      expect(sb.countGames()).toBe(cnt);
    });
  });
});
