const desktopImageSize = {
    w: 720,
    h: 1080
}
const mobileImageSize = {
    w: 1080,
    h: 720
}

const getImageRatio = (isMobile) => {
    const imageSize = isMobile ? mobileImageSize : desktopImageSize
    const width = imageSize.w
    const height = imageSize.h
    return width / height
}

const getNormalisedWidth = (height, isMobile) => {
    return getImageRatio(isMobile) * height
}

export { getNormalisedWidth }