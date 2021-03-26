<template>
    <div class="wrap">
        <form action="">
            <div class="form-item">
                <label for="username">全键盘</label>
                <app-keyboard-input
                    inputMethod="all, num, system"
                    name="username"
                    id="username"
                />
            </div>
            <div class="form-item">
                <label for="username">身份证</label>
                <app-keyboard-input
                    inputMethod="id"
                    name="idcard"
                    id="idcard"
                />
            </div>
            <div class="form-item">
                <label for="number">数字</label>
                <app-keyboard-input
                    inputMethod="num, system"
                    name="number"
                    id="number"
                />
            </div>
            <div class="form-item">
                <label for="password">密码</label>
                <app-keyboard-input
                    inputMethod="inline-num"
                    type="password"
                    name="password"
                    id="password"
                />
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { KeyboardInput } from './keyboard/';

export default defineComponent({
    name: 'App',
    components: {
        'app-keyboard-input': KeyboardInput,
    },
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
.wrap {
    padding: 20px;
    background: #eee;
}
.form-item {
    margin: 20px 0;
}
.form-item label {
    display: inline-block;
    width: 60px;
    margin-right: 10px;
    text-align: right;
}
.form-item input {
}
</style>
