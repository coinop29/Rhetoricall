import { create } from "zustand";
import produce from "immer";
import config from "./config/environment";

const useAppStore = create((set) => ({
  backgroundUri: `${config.APP_URL}1.mp4`,
  history: [],
  // explode: [],
  explode: "",
  cube: [],
  reset: false,
  allBackgrounds: [],
  setBackgroundUri: (val) => set({ backgroundUri: val }),

  addHistory: (val) =>
    set(
      produce((state) => {
        state.history.push(val);
      })
    ),

  setExplode: (val) =>
    set(
      produce((state) => {
        if (state.explode) state.cube.push(state.explode);
        state.explode = val;
      })
    ),

  clearExplode: () => set({ explode: "" }),

  convertCube: () =>
    set(
      produce((state) => {
        state.cube.push(state.explode);
        state.explode = "";
      })
    ),

  setAllBackgrounds: (val) => set({ allBackgrounds: val }),
  clearCube: () => set({ cube: [] }),

  setReset: (val) => set({ reset: val }),

  clearAll: () => set({ explode: "", cube: [] }),
}));

export default useAppStore;
