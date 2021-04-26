import Vue, { createVNode, render } from 'vue';

/** 动态创建组件 */
function createComponent(Component: any, params: any, app?: any) {
    let container: HTMLElement | null = document.createElement('div');
    let vNode: Vue.VNode | null = createVNode(Component, params);

    /**
     * render using existing app context
     * https://github.com/vuejs/vue-next/issues/2097#issuecomment-707975628
     */
    if (app?._context) {
        vNode.appContext = app._context;
    }
    render(vNode, container);
    document.body.appendChild(container);

    const destroy = () => {
        render(null, container!);
        document.body.removeChild(container!);
        container = null;
        vNode = null;
    };

    return { vNode, destroy };
}

export default createComponent;
