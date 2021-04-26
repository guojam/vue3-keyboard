const hasTouchEvent = 'ontouchstart' in window;
const touchEvent = {
    start: hasTouchEvent ? 'touchstart' : 'mousedown',
    move: hasTouchEvent ? 'touchmove' : 'mousemove',
    end: hasTouchEvent ? 'touchend' : 'mouseup',
};

const getIOSInfo = () => {
    return window.navigator.userAgent
        .toLowerCase()
        .match(/cpu iphone os (.*?) like mac os/);
};

const isIOS = !!getIOSInfo();

const iosVer = () => {
    const iosInfo = getIOSInfo();
    if (iosInfo) {
        return iosInfo[1].replace(/_/g, '.');
    }
    return;
};

/** trigger focus input */
const focusInput = (input: HTMLInputElement) => {
    const len = input.value.length;
    if (isIOS) {
        // ios下通过input click来触发focus弹出键盘
        input.click();
    }
    input.focus();
    input.setSelectionRange(len, len);
};

/** 数组随机排序 */
const getRandomArray = <T>(arr: Array<T>) => {
    const newArr = [...arr];
    return newArr.sort(() => {
        return 0.5 - Math.random();
    });
};

export { touchEvent, isIOS, iosVer, focusInput, getRandomArray };
