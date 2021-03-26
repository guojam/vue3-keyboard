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

/** trigger focus input */
export const focusInput = (input: HTMLInputElement) => {
    const len = input.value.length;
    if (isIOS) {
        // ios下通过input click来触发focus弹出键盘
        input.click();
    }
    input.focus();
    input.setSelectionRange(len, len);
};
