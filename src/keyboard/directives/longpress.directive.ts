import { touchEvent } from '../utils';

const longpressDirective = {
    beforeMount(el: Element, binding: any) {
        // 定义变量
        let pressTimer: number | undefined, pressInterval: number | undefined;

        // 默认延迟700ms
        const delay = 700;
        // 每隔100ms触发一次
        const interval = 100;

        const start = () => {
            if (pressTimer === undefined) {
                pressTimer = setTimeout(handler, delay);
            }
        };

        // 取消计时器
        const cancel = () => {
            // 检查计时器是否有值
            if (pressTimer !== undefined) {
                clearTimeout(pressTimer);
                pressTimer = undefined;
            }
            if (pressInterval !== undefined) {
                clearInterval(pressInterval);
                pressInterval = undefined;
            }
        };

        // 运行函数
        const handler = () => {
            pressInterval = setInterval(binding.value, interval);
        };

        // 添加事件监听器
        el.addEventListener(touchEvent.start, start);

        // 取消计时器
        el.addEventListener(touchEvent.end, cancel);
        el.addEventListener('touchcancel', cancel);
        el.addEventListener('mouseleave', cancel);
    },
};

export default longpressDirective;
