import Vue, { createVNode, render } from 'vue';

/** 动态创建组件 */
function createComponent(args: {
    /** 组件对象 */
    component: any;
    /** 组件参数 */
    params?: any;
    /** 组件要挂载到的实例对象 */
    app?: any;
    /** 组件要挂载到的Dom */
    container?: HTMLElement;
}) {
    const hasHost = !!args.container,
        container = args.container || document.createElement('div');

    // 创建虚拟节点
    let vNode: Vue.VNode | null = createVNode(args.component, args.params);

    /**
     * render using existing app context
     * https://github.com/vuejs/vue-next/issues/2097#issuecomment-707975628
     */
    if (args.app?._context) {
        vNode.appContext = args.app._context;
    }
    // 渲染为真实节点并挂载到宿主节点
    render(vNode, container);
    if (!hasHost) {
        document.body.appendChild(container);
    }

    const destroy = () => {
        render(null, container);
        if (!hasHost) {
            document.body.removeChild(container);
        }
        vNode = null;
    };

    return { vNode, destroy };
}

export { createComponent };
