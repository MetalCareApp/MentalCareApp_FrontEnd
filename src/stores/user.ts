import { create } from 'zustand';

export type ModeType = 'USER' | 'DOCTOR';

type UserState = {
  username: string | null;
  isDoctor: boolean; // 의사 계정 보유 여부
  currentMode: ModeType; // 현재 앱 모드

  // actions
  setUser: (username: string, isDoctor: boolean) => void;
  switchMode: (mode: ModeType) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>(set => ({
  username: null,
  isDoctor: false,
  currentMode: 'USER',

  setUser: (username, isDoctor) =>
    set({
      username,
      isDoctor,
      currentMode: isDoctor ? 'DOCTOR' : 'USER',
    }),

  switchMode: mode =>
    set(state => {
      // 의사 계정 없으면 DOCTOR 모드 진입 불가
      if (mode === 'DOCTOR' && !state.isDoctor) {
        return state;
      }
      return { currentMode: mode };
    }),

  logout: () =>
    set({
      username: null,
      isDoctor: false,
      currentMode: 'USER',
    }),
}));
