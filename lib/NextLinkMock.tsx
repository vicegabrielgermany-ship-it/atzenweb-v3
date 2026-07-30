import React from 'react';

export default function Link({ href, children, className, ...props }: any) {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
}
