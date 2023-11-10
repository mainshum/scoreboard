import { describe, it, expect } from 'vitest';

import { Scoreboard } from '../src/scoreboard';

describe('Scoreboard', () => {
  describe('startGame', () => {
    it('returns 0-0 score for two teams if only one game started and no updates', () => {
      const sb = Scoreboard();

      sb.startGame('Team 1', 'Team 2');

      const [{ home, away }] = sb.getSummary();

      expect(home.score).toBe(0);
      expect(away.score).toBe(0);
    });
  });
});
