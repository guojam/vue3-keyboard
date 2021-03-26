const hasTouchEvent = 'ontouchstart' in window;

export const touchEvent = {
    start: hasTouchEvent ? 'touchstart' : 'mousedown',
    move: hasTouchEvent ? 'touchmove' : 'mousemove',
    end: hasTouchEvent ? 'touchend' : 'mouseup',
};
