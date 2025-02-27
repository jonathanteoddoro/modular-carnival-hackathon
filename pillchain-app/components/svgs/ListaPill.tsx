import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function ListaPill(props: SvgProps) {
  return (
    <Svg
      width={61}
      height={60}
      viewBox="0 0 61 60"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.125 15c0-1.036.84-1.875 1.875-1.875h42.5a1.875 1.875 0 010 3.75H8A1.875 1.875 0 016.125 15zm0 12.5c0-1.035.84-1.875 1.875-1.875h15a1.875 1.875 0 010 3.75H8A1.875 1.875 0 016.125 27.5zm0 12.5c0-1.035.84-1.875 1.875-1.875h17.5a1.875 1.875 0 010 3.75H8A1.875 1.875 0 016.125 40z"
        fill="#E61717"
      />
      <Path
        d="M46.954 37.94a5.271 5.271 0 000-7.456l-6.555-6.555a5.27 5.27 0 00-9 3.728 5.294 5.294 0 001.544 3.728l6.555 6.555a5.27 5.27 0 007.456 0zm-6.776-.68l-3.277-3.278 6.095-6.095 3.278 3.278a4.313 4.313 0 01-4.695 7.038 4.243 4.243 0 01-1.4-.943z"
        fill="#E61717"
      />
    </Svg>
  )
}

export default ListaPill
