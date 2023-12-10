import React from "react"
import { IconType } from "react-icons"

const colors = {
  danger: "text-red-600",
}

type IconProps = {
  isActive: boolean
  Icon: IconType
  color?: keyof typeof colors
  children?: React.ReactNode
}

export const IconBtn: React.FC<
  IconProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ Icon, children, color, isActive, ...otherProps }) => {
  return (
    <button
      className={` relative flex items-center p-1 ${
        color ? colors[color] : isActive ? "btn-before-style text-red-500" : "text-indigo-500"
      } flex cursor-pointer rounded`}
      {...otherProps}
    >
      <span className={`${children != null ? "mr-1" : ""}`}>
        <Icon />
      </span>
      {children && <span>{children}</span>}
    </button>
  )
}
