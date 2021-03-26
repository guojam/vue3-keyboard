import { touchEvent } from '../utils';

const longpressDirective = {
    beforeMount(el: Element, binding: any, vNode: any) {
        // 定义变量
        let pressTimer: any = null,
            pressInterval: any = null;

        // 默认延迟700ms
        const delay = 700;
        // 每隔100ms触发一次
        const interval = 100;

        const start = () => {
            if (pressTimer === null) {
                pressTimer = setTimeout(handler, delay);
            }
        };

        // 取消计时器
        const cancel = () => {
            // 检查计时器是否有值
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
            if (pressInterval !== null) {
                clearInterval(pressInterval);
                pressInterval = null;
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
    },
};

export default longpressDirective;
