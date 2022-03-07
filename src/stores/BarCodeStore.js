import create from "zustand";
import { immer } from './middleware'
import { NUM_BARS } from "./BarCodeConfig";

const barCodeStore = state => ({
    numberOfBars: NUM_BARS,
});

const backgroundStore = state => ({
    animating: false,
    currentHoveredBar: null,
    setCurrentHoveredBar: (index) => {
        state.currentHoveredBar = index;
    },
    setAnimatingDone: () => {state.animating = false}
});

export const useBarCodeStore = create(immer(barCodeStore));
export const useBackgroundStore = create(immer(backgroundStore));
