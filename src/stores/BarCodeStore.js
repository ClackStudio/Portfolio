import create from "zustand";
import { immer } from './middleware'
import { NUM_BARS } from "./BarCodeConfig";
import { getNormalisedWidth } from "../components/CssBarcode/getImageRatio";

const barCodeStore = state => ({
    normalisedImageWidth: 0,
    getNormalisedImageWidth: (height, isMobile) => {
        const normalisedImageWidth = getNormalisedWidth(height, isMobile)
        if(normalisedImageWidth !== state.normalisedImageWidth) state.normalisedImageWidth = normalisedImageWidth
    }
});

const backgroundStore = state => ({
    animating: false,
    currentHoveredBar: 1,
    setCurrentHoveredBar: (index) => {
        state.currentHoveredBar = index;
    },
    setAnimatingDone: () => {state.animating = false}
});

export const useBarCodeStore = create(immer(barCodeStore));
export const useBackgroundStore = create(immer(backgroundStore));
