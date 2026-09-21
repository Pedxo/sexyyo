import type { ImgHTMLAttributes } from 'react'

interface SvgIconProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string
  alt?: string
}

function SvgIcon({
  src,
  alt = '',
  className = '',
  ...props
}: SvgIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      {...props}
    />
  )
}

export default SvgIcon