import create from "zustand";
import { immer } from './middleware'

const transitionStore = state => ({
    currentPath: '/',
    lastPath: '/',
    toSlug: null,
    setCurrentHoveredBar: (key) => {
        state.currentHoveredBar = key;
        state.animating = true;
    },
    setAnimatingDone: () => {
        state.animating = false;
        state.toSlug = null;
    },
    setCanvasTransition: (slug) => {
        console.log("STORE SLUG", slug)
        state.toSlug = slug;
        state.animating = true;
    }
});

export const useTransitionStore = create(immer(transitionStore));
