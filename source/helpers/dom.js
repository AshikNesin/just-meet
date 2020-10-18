export const $click = selector => {
    const el = document.querySelector(selector)
    if (el) {
        el.click();
    }
}