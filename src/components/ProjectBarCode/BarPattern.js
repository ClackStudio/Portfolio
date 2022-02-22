const BarPattern = () => {

    return (
    <group visible={isHovering !== index} opacity={isHovering !== index ? 1 : 0}>

    <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
      <Box width="13%" height="100%">

        <InnerBarCodeNumber on></InnerBarCodeNumber>
      </Box>
      <Box width="13%" height="100%">

        <InnerBarCodeNumber on></InnerBarCodeNumber>
      </Box>
      <Box width="13%" height="100%">

        <InnerBarCodeNumber off></InnerBarCodeNumber>
      </Box>
      <Box width="13%" height="100%">

        <InnerBarCodeNumber off></InnerBarCodeNumber>
      </Box>
      <Box width="13%" height="100%">

        <InnerBarCodeNumber on></InnerBarCodeNumber>
      </Box>
      <Box width="13%" height="100%">

        <InnerBarCodeNumber off></InnerBarCodeNumber>
      </Box>
      <Box width="13%" height="100%">

        <InnerBarCodeNumber on></InnerBarCodeNumber>
      </Box>

      <Box width="13%" height="100%">

        <InnerBarCodeNumber on></InnerBarCodeNumber>
      </Box>

    </Flex>
  </group>
    )
}

export default BarPattern