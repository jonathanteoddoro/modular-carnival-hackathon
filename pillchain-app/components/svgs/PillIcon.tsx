import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function PillIcon(props: SvgProps) {
  return (
    <Svg
      width={61}
      height={60}
      viewBox="0 0 61 60"
      fill="none"
      {...props}
    >
      <Path
        d="M48.773 48.275a13.75 13.75 0 000-19.45l-17.1-17.1A13.75 13.75 0 008.197 21.45a13.81 13.81 0 004.026 9.725l17.1 17.1a13.75 13.75 0 0019.45 0zM31.097 46.5l-8.55-8.55 15.9-15.9L47 30.6a11.25 11.25 0 01-7.925 19.2 11.072 11.072 0 01-7.978-3.3z"
        fill="#E61717"
      />
    </Svg>
  )
}

export default PillIcon
