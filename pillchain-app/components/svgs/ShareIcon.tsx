import * as React from "react"
import Svg, { G, Path, Defs, ClipPath, SvgProps } from "react-native-svg"

function ShareIcon(props: SvgProps) {
  return (
    <Svg
      width={15}
      height={12}
      viewBox="0 0 15 12"
      fill="none"
      {...props}
    >
      <G clipPath="url(#clip0_6_1597)">
        <Path
          clipRule="evenodd"
          d="M9.645 9.742l4.306-3.61a.731.731 0 000-1.133L9.645 1.39a.79.79 0 00-1.303.567V3.38C2.296 2.332.78 7.743.78 10.797 2.183 8.47 5.817 4.252 8.342 7.743V9.17a.79.79 0 001.303.572z"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_6_1597">
          <Path fill="#fff" d="M0 0H15V12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default ShareIcon
