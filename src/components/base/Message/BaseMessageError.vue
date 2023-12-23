<template>
    <div class="message--hasError" hidden>
        <slot name="message"> {{text}} không được để trống </slot>
    </div>
</template>

<script>
export default {
    props:["text"]
}
</script>

<style>
    .message--hasError {
        position: absolute;
        white-space: nowrap;
        font-weight: normal;
        bottom: -15px;
        left: 0;
        color: #ed4337;
        z-index: 1;
        font-size: 11px;
        display: none;
    }

    .input--error +.message--hasError {
        display: block;
    }

</style>