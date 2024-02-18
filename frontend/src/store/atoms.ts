import { atom, selector, useSetRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

// 브라우저 정보
export const browserState = atom({
  key: "browserState",
  default: {},
});

// 유저 정보 (persist)
export const userAtom = atom({
  key: "userAtom",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 시스템 정보 (persist)
export const sysInfoAtom = atom({
  key: "sysInfoAtom",
  default: {},
  effects_UNSTABLE: [persistAtom],
});
