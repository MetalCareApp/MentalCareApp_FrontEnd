import { create } from 'zustand';
import { Match } from '../apis/matchApi';

type MatchState = {
  matches: Match[];
  // actions
  setMatches: (matches: Match[]) => void;
};

export const useMatchStore = create<MatchState>(set => ({
  matches: [],

  setMatches: matches =>
    set({
      matches,
    }),
}));
