import React from 'react';

const Card = React.forwardRef(
  ({ children, className = '', onClick, style = {}, ...rest }, ref) => {
    const clickable = typeof onClick === 'function';

    return (
      <div
        ref={ref}
        className={`${
          clickable
            ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300'
            : ''
        } ${className}`}
        onClick={onClick}
        style={style}
        role={clickable ? 'button' : rest.role}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault(); // prevent page scroll on Space
                  onClick?.(e);
                }
              }
            : undefined
        }
        {...rest}
      >
        {children}
      </div>
    );
  }
);

export default Card;