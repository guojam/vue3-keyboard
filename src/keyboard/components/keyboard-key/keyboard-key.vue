<template>
    <span
        :class="[{ active: isActive }, currentClasses]"
        @click="onClick"
        @touchstart="onTouchstart"
        @touchend.prevent="onTouchend"
        @contextmenu.prevent
        v-keyboard-press="onLongPress"
    >
        {{ currentKey.keyText }}
    </span>
</template>
<script lang="ts">
import {
    defineComponent,
    computed,
    reactive,
    toRaw,
    PropType,
    toRefs,
} from 'vue';
import { KeyInterface, KeyPressInterface } from '../../keyboard.model';
import longpressDirective from '../../directives/longpress.directive';
export default defineComponent({
    name: 'app-keyboard-key',
    directives: {
        keyboardPress: longpressDirective,
    },
    props: {
        /** 按键数据 */
        keyData: {
            type: Object as PropType<KeyPressInterface>,
            required: true,
        },
    },
    setup(props, context) {
        const state = reactive({
            /** 当前按键对象 */
            currentKey: props.keyData,
            /** 是否激活 */
            isActive: false,

            /** 删除键被长按 */
            delIsPressed: false,

            /** 当前按键element */
            // keyEl: HTMLElement,
        });

        /** 按键样式 */
        const currentClasses = computed(() => {
            let style = 'btn';
            if (!state.currentKey.special) {
                style += ' btn-num';
            }

            const keyValue = state.currentKey.keyValue;
            if (keyValue) {
                style += ' btn-' + keyValue.toLowerCase();
            }
            return style;
        });

        const onClick = (ev) => {
            const key = state.currentKey;
            console.log('click', key.keyValue);
        };

        const onTouchstart = (ev) => {
            // 设置当前按键为激活状态
            state.isActive = true;
            const key = state.currentKey;
            console.log('onTouchstart', key.keyValue);
        };

        const onTouchend = (ev) => {
            const key = toRaw(state.currentKey);
            console.log('onTouchend', ev.target);

            // 取消当前激活按键
            state.isActive = false;

            // 如已长按删除键
            if (state.delIsPressed) {
                // 清除长按标志，不传递按键事件
                state.delIsPressed = false;
            } else {
                // 弹射按键数据
                context.emit('key-press', {
                    key,
                    type: 'tap',
                });
            }
        };

        const onLongPress = () => {
            const key = toRaw(state.currentKey);
            const keyValue = state.currentKey.keyValue;
            console.log(keyValue + '被长按');
            if (keyValue === 'backspace') {
                // 标识删除按键被长按，在touchend触发时如有该标识，不再次执行删除
                state.delIsPressed = true;
                // 弹射按键数据
                context.emit('key-press', {
                    key,
                    type: 'press',
                });
            }
        };

        return {
            ...toRefs(state),
            currentClasses,
            onClick,
            onTouchstart,
            onTouchend,
            onLongPress,
        };
    },
});
</script>

<style scoped lang="scss" src="./keyboard-key.scss"></style>
