import { create } from 'zustand';

export type ModeType = 'USER' | 'DOCTOR';

type UserState = {
  username: string | null;
  isDoctor: boolean; // 의사 계정 보유 여부
  email: string | null; // 사용자 이메일
  currentMode: ModeType; // 현재 앱 모드
  matchId: number | null; // 매칭된 병원 ID,

  // actions
  setUser: (data: {
    username: string;
    isDoctor: boolean;
    email: string | null;
    matchId: number | null;
  }) => void;
  switchMode: (mode: ModeType) => void;
  clearUserData: () => void;
};

export const useUserStore = create<UserState>(set => ({
  username: null,
  isDoctor: false,
  email: null,
  currentMode: 'USER',
  matchId: null,

  setUser: (data: {
    username: string;
    isDoctor: boolean;
    email: string | null;
    matchId: number | null;
  }) =>
    set({
      username: data.username,
      isDoctor: data.isDoctor,
      email: data.email,
      currentMode: data.isDoctor ? 'DOCTOR' : 'USER',
      matchId: data.matchId,
    }),

  switchMode: mode =>
    set(state => {
      // 의사 계정 없으면 DOCTOR 모드 진입 불가
      if (mode === 'DOCTOR' && !state.isDoctor) {
        return state;
      }
      return { currentMode: mode };
    }),

  clearUserData: () =>
    set({
      username: null,
      isDoctor: false,
      email: null,
      currentMode: 'USER',
      matchId: null,
    }),
}));
