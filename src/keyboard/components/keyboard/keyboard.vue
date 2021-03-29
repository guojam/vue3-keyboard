<template>
    <div class="ui-keyboard-wrapper" ref="wrapperRef" @[touchEvent.end].stop>
        <div :class="['ui-keyboard', currentMethod]">
            <div class="ui-keyboard-top">
                <div class="ui-keyboard-title">安全键盘</div>
                <span
                    v-if="closeAble"
                    class="ui-keyboard-close"
                    @[touchEvent.end].stop="close()"
                ></span>

                <span v-if="inputMethods.length" class="ui-keyboard-methods">
                    <template
                        v-for="(item, index) in inputMethods"
                        :key="index"
                    >
                        <a
                            v-if="item !== currentMethod"
                            @[touchEvent.end].stop="changeInputMethod(item)"
                        >
                            {{ inputMethodsName[item] }}
                        </a></template
                    >
                </span>
            </div>
            <div class="ui-keyboard-pane">
                <div class="ui-keyboard-grid" :style="gridStyle">
                    <template
                        v-for="(row, rowIndex) in layout"
                        :key="row.index"
                    >
                        <div
                            class="ui-keyboard-grid-cell"
                            v-for="(item, colIndex) in row"
                            :key="item.key.keyValue"
                            :style="{
                                'grid-column-start': 1 + colIndex,
                                'grid-column-end': 1 + item.col + colIndex,
                                'grid-row-start': 1 + rowIndex,
                                'grid-row-end': 1 + item.row + rowIndex,
                            }"
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
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" src="./keyboard.ts"></script>

<style scoped lang="scss" src="./keyboard.scss"></style>
