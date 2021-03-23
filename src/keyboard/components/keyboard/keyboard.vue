<template>
    <div class="ui-keyboard-wrapper" ref="wrapperRef" @click.stop>
        <div :class="['ui-keyboard', type]">
            <div class="ui-keyboard-top">
                <div class="ui-keyboard-title">安全键盘</div>
                <span
                    v-if="closeAble"
                    class="ui-keyboard-close"
                    @click="close()"
                ></span>
                <span
                    v-if="switchAble"
                    class="ui-keyboard-switch"
                    @click="changeInputMethod()"
                    >切换输入法</span
                >
            </div>
            <div class="ui-keyboard-pane">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr v-for="(row, index) in layout" :key="row.index">
                            <td
                                v-for="item in row"
                                :key="item.id"
                                :rowspan="item.row"
                                :colspan="item.col"
                            >
                                <app-keyboard-key
                                    :shift="shift"
                                    :keyData="item.key"
                                    :class="[
                                        shift ? 'shift' : '',
                                        'ui-keyboard-key',
                                        'ui-keyboard-key-' + item.key.keyValue,
                                    ]"
                                    @key-press="onKeyPress($event)"
                                ></app-keyboard-key>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./keyboard.ts"></script>

<style scoped lang="scss" src="./keyboard.scss"></style>
