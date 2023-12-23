<template>
    <button class="btn btn__batch"
        :class="{'btn__batch--actived': this.employeesSelectedByID.length > 1}"
        @click="isShow = !isShow"
        @blur="isShow = false"
    >
        <div class="btn__batch--content">
            {{ this.textBatch }}
            <div class="btn__batch--icon">
                <i class="icon icon__grey--caretdown"
                    :class="{'icon__black--caretdown': this.employeesSelectedByID.length > 1}"
                ></i>
            </div>
        </div>

        <ul class="btn__dropdown--list"
         v-show="isShow && this.employeesSelectedByID.length"
        >
            <div>
                <li class="btn__dropdown--item dropdown--item"
                    @click="deleteBatch()"
                >
                    <a class="btn__dropdown--text">
                        {{ this.textDelete }}
                    </a>
                </li>
            </div>
        </ul>
    </button>
</template>
  
<script>

export default {
    name: "btnBatch",
    props: {
        employeesSelectedByID: [],
    },

    created() {

    },

    updated() {
        
    },

    watch: {

    },

    methods: {
        deleteBatch() {
            let me = this;
            
            me.$emit('deleteBatch', true);
        },
    },

    data() {
        return {
            isShow: false,
            textDelete: this.$t('action.delete'),
            textBatch: this.$t('action.batch_action'),

        };
    },

};

</script>
  
<style scoped>
:root {
    --btn__bgColor: #2ca01c;
    --btn__bgColor--hover: #35bf22;
    --btn__bgColor--focus: #1d6d13;
    --btn__txtColor: #fff;
    --btnOutline__bgColor--hover: #d2d3d6;
    --btnOutline__bgColor--focus: #bbbcbc;
}

.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 16px; 
    border: unset;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--btn__bgColor);  
    color: var(--btn__txtColor);
    outline: none;
    font-weight: 600;
    font-size: 13px;
    box-sizing: border-box;
}

.btn:hover {
    background-color: var(--btn__bgColor--hover);
}

.btn:active,
.btn:focus {
    background-color: var(--btn__bgColor--focus);
}

.btn--outline {
    border: 1px solid #8d9096;
    background-color: white;  
    color: #212121;
    box-shadow: none;
    border-radius: 3px;

}

.btn--outline:hover {
    background-color: var(--btnOutline__bgColor--hover);  
}

.btn--outline:active,
.btn--outline:focus {
    background-color: var(--btnOutline__bgColor--focus);  
}

.btn--dialog {
    border-radius: 3px !important;
}

.btn__sub {
    background-color: rgb(245, 245, 245);
    color: rgb(73, 182, 209);
    border: 1.6px solid rgb(73, 182, 209);
    margin-left: 16px;
    box-shadow: none;
}

.btn__sub:hover {
    background-color: rgb(209, 237, 244);
}

/* BEGIN: BUTTON FUNCTION */

.btn__save {
    box-shadow: none;
}

.btn__cancel {
    box-shadow: none;
    background-color: #ffffff;
    color: black;
}

.btn__tabRollback {
    position: absolute;
    outline: none;
    background-color: #fff;
    border: none;
}

.btn__batch {
    height: 32px;
    border: 1px solid #b1b2b3;
    padding: 0 16px;
    color: #afafaf;
    background-color: transparent;
    position: relative;
    pointer-events:none;
    
}

.btn__batch--actived {
    opacity: 1;
    pointer-events: all;
    border: 1px solid #3b3c3f;
    color: #111;
}

.btn__batch:hover {
    background-color: #d2d3d6;
}

.btn__batch:focus {
    background-color: unset;
}

.btn__batch:active {
    background-color: #bbbcbc;
}

.btn__batch--content {
    display: flex;
    align-items: center;
}

.btn__batch--icon {
    padding: 8px;
}

.btn__dropdown {
    position: absolute;
    right: 23px;
    border: rgba(0,0,0,0) 1px solid;
    width: 18px;
    height: 18px;
    z-index: 2;
}

.btn__dropdown:focus {
    border: 1px solid rgb(3, 119, 193);
    outline: none;
}

.btn__dropdown--list { 
    position: absolute;
    right: 0;
    top: 36px;
    border: 1px solid #babec5;
    background: #fff;
    padding: 2px 1px;
    border-radius: 2px;
    z-index: 7;
}

.btn__dropdown--item {
    white-space: nowrap;
    transition: all .2s ease;
    position: relative;
    z-index: 1000;
    text-align: left;
    width: 100%;
    list-style: none;
    min-width: 100px;
    font-weight: 400 !important;
    font-size: 13px;
}

.btn__dropdown--item:hover {
    background-color: rgb(232, 233, 236);
    color: rgb(63, 168, 50);
}

.btn__dropdown--text {
    background: inherit!important;
    color: inherit!important;
    cursor: pointer;
    transition: all .2s ease;
    padding: 5px;
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
    position: relative;
    display: block;
}

.btn--red {
    background-color: #DE3617 !important;
}

.btn--red:hover {
    background-color: #ff4e1b !important;
}

.btn--red:active {
    background-color: rgb(171, 41, 17) !important;
}

.btn--warning {
    background-color: rgb(255, 197, 0);
    color: #000;
}

.btn--warning:hover {
    background-color: rgb(255, 212, 0);
}

.btn--warning:active {
    background-color: rgb(204, 157, 0);
}

.btn--disable {
    background-color: #f5f4f4;
    border: none !important;
    pointer-events: none;
}



.btn--disable .icon--del {
    background-position: -419px -111px;
	width: 18px;
	height: 18px;
    opacity: 0.4;
}


/* END: BUTTON FUNCTION */

.iconCustom {
    background-image: url("@/assets/img/Sprites.64af8f61.svg");
    background-repeat: no-repeat;
    display: block;
    cursor: pointer;
}

.iconCustom__black--caretdown {
	background-position: -564px -365px !important;
	width: 8px;
	height: 5px;
	opacity: 1 !important; 
}

.iconCustom__grey--caretdown {
	background-position: -1756px -317px;
	width: 8px;
	height: 5px;
	opacity: 0.8;
}

</style>
  