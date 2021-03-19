/** 清空字符 */
function inputClear() {
    return '';
}

/** 删除字符 */
function inputDelete(value: string) {
    if (value) {
        value = value.substr(0, value.length - 1);
    }
    return value;
}

/**  添加字符 */
function inputAdd(value: string, str: string, maxLength: number) {
    value += str;
    if (maxLength) {
        value = value.substr(0, maxLength);
    }
    return value;
}
