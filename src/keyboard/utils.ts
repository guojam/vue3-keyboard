const hasTouchEvent = 'ontouchstart' in window;

export const touchEvent = {
    start: hasTouchEvent ? 'touchstart' : 'mousedown',
    move: hasTouchEvent ? 'touchmove' : 'mousemove',
    end: hasTouchEvent ? 'touchend' : 'mouseup',
};

const getIOSInfo = () => {
    return window.navigator.userAgent
        .toLowerCase()
        .match(/cpu iphone os (.*?) like mac os/);
};

export const isIOS = !!getIOSInfo();

export const iosVer = () => {
    const iosInfo = getIOSInfo();
    if (iosInfo) {
        return iosInfo[1].replace(/_/g, '.');
    }
    return;
};
