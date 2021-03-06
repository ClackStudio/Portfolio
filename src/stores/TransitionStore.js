import create from 'zustand'
import { immer } from './middleware'

const transitionStore = (state) => ({
  currentPath: '/',
  lastPath: '/',
  toSlug: null,
  introAnimationDone: false,
  setCurrentHoveredBar: (key) => {
    state.currentHoveredBar = key
    state.animating = true
  },
  setAnimatingDone: () => {
    state.animating = false
    state.toSlug = null
  },
  setCanvasTransition: (slug) => {
    state.toSlug = slug
    state.animating = true
  },
  setIntroAnimationDone: () => {
    state.introAnimationDone = true
  },
})

export const useTransitionStore = create(immer(transitionStore))
