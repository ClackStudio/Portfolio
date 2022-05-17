import create from 'zustand'
import { immer } from './middleware'
import { getNormalisedWidth } from '../components/CssBarcode/getImageRatio'
import { createCompleteBarcodePattern } from '../components/CssBarcode/createBarcodePattern'

const barCodeStore = (state) => ({
  normalisedImageWidth: 0,
  barcodePattern: [],
  getNormalisedImageWidth: (height, isMobile) => {
    const normalisedImageWidth = getNormalisedWidth(height, isMobile)
    if (normalisedImageWidth !== state.normalisedImageWidth)
      state.normalisedImageWidth = normalisedImageWidth
  },
  requestBarcodePattern: (numberOfBars) => {
    if (state.barcodePattern.length === 0) {
      state.barcodePattern = createCompleteBarcodePattern(numberOfBars)
    }
  },
})

const backgroundStore = (state) => ({
  animating: false,
  currentHoveredBar: null,
  setCurrentHoveredBar: (index) => {
    state.currentHoveredBar = index
  },
  setAnimatingDone: () => {
    state.animating = false
  },
})

export const useBarCodeStore = create(immer(barCodeStore))
export const useBackgroundStore = create(immer(backgroundStore))
