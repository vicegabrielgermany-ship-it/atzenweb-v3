import React from 'react';

type Props = {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  text: string
  src: string
  className?: string
}

export function IllustratedHeading({ level = 2, text, src, className = '' }: Props) {
  const Tag = `h${level}` as React.ElementType
  return (
    <Tag aria-label={text} className={`${className} overflow-hidden`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="block h-auto w-full"
      />
    </Tag>
  )
}
