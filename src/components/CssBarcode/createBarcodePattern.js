const createBarcodePattern = (index, numberOfBars) => {
    const isFirst = index === 0
        const isLast = index === numberOfBars -1
        const random = () => Math.random() >0.5 ? 1 :0
        return [
        isFirst ? 1 : random(),
        isFirst ? 0 : random(),
        isFirst ? 1 : random(),
        isFirst ? 0 : random(),
        random(),
        random(),
        random(),
        random(),
        random(),
        random(),
        random(),
        isLast ? 0 : 1,
        isLast ? 1 : random(),
        isLast ? 0 : random(),
        isLast ? 1 : random(),
        ]
}


const createCompleteBarcodePattern = (numberOfBars) => {
    const patternArray = [...Array(numberOfBars).keys()].map((_, i, array) => {
        return createBarcodePattern(i, numberOfBars)
      });
    
    return patternArray
}


    export { createBarcodePattern, createCompleteBarcodePattern }
