<template>
    <div class="v-toast">
        <TransitionGroup name="v">
            <div class="v-toast__content" v-for="item in toasts" :key="item.id" @mouseover="pauseProgress(item)"
                @mouseleave="resumeProgress(item)">
                <template v-if="item.timeout > 0 && item.showProgress">
                    <div class="v-toast__icon">
                        <!-- :class="item.type" -->
                        <div :class="`ms-22 ms-icon-v2 ms-icon-toast-${item.type}`">
                        </div>
                    </div>
                    <div class="v-toast__text">
                        <span class="type" :style="{ 'color': colorMessage[item.type] }">{{ $t(`toast.${item.type}`) }}!
                        </span>
                        <span v-html="item.message"></span>
                    </div>
                    <div class="v-toast__button">
                        <div class="ms-12 ms-icon ms-icon-toast-x" @click="removeMessage(item)"></div>
                    </div>
                </template>
            </div>
        </TransitionGroup>
    </div>
</template>


<script>

/**
 * Khai báo màu sắc của các loại thông báo
 * Author: tttuan 10/09/2022
 */
const colorMessage = {
    'success': '#4caf50',
    'error': '#f44336',
    'warning': '#ff9800',
    'info': '#2196f3',
}
export default {
    name: "VToast",
    props: {
        showProgress: { // Hiển thị thanh progress
            type: Boolean,
            default: true,
        },
        type: { // Loại thông báo
            type: String,
            default: "info",
        },
        message: { // Nội dung thông báo
            type: String,
            default: "Đây là thông báo mang tính nhắc nhở",
        },
        timeout: { // Thời gian hiển thị thông báo
            type: Number,
            default: 3000,
        },
        maxMessage: { // Số lượng thông báo tối đa
            type: Number,
            default: 5,
        },
        order: { // Thứ tự hiển thị thông báo
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            colorMessage,  // Màu sắc thông báo
            toasts: [], // Danh sách thông báo
            count: 0, // Số lượng thông báo
        };
    },
    watch: {
        toasts: {
            /**
            * @description: Hàm này dùng để theo giõi nếu số lượng thông báo vượt quá maxMessage
            * @param: {any} 
            * Author: tttuan 10/09/2022
            */
            handler: function (val) {
                if (val.length > this.maxMessage) {
                    this.toasts.splice(this.maxMessage);
                }
            },
            deep: true,
        },
    },
    created() {
        /**
         * Tạo biến toàn cục để gọi hàm từ bên ngoài
         * Author: tttuan 10/09/2022
         */
        let toast = {
            success: (message, options = { timeout: this.timeout }) => {
                this.addMessage(message, "success", options);
            },
            error: (message, options = { timeout: this.timeout }) => {
                this.addMessage(message, "error", options);
            },
            warning: (message, options = { timeout: this.timeout }) => {
                this.addMessage(message, "warning", options);
            },
            info: (message, options = { timeout: this.timeout }) => {
                this.addMessage(message, "info", options);
            },
        };
        this.$root.$toast = toast;
    },
    methods: {
        /**
         * Dùng để thêm thông báo vào danh sách thông báo hiển thị
         * @param {*} message - Thông báo 
         * @param {*} type  - Loại thông báo
         * @param {*} options - Các thông số khác
         */
        addMessage(message, type, options = {}) {
            // Khởi tạo mặc định giá trị cho 1 toast message
            var messageData = {
                id: this.count++,
                message: message,
                type: type,
                timeout: this.timeout,
                showProgress: this.showProgress,
                paused: false,
                order: this.order,
                progress: 0,
                animationFrame: null,
            };

            // Gán giá trị cho các thuộc tính của toast message
            messageData = Object.assign(messageData, options);

            // Kiểm tra xem lựa chọn khi có thông báo mới thêm vào sau hay trước
            if (messageData.order) {
                this.toasts.push(messageData);
            } else {
                this.toasts.unshift(messageData);
            }
            // Nếu thời gian hiển thị thông báo lớn hơn 0 thì bắt xử lý tiến trình
            if (messageData.timeout > 0) {
                this.startProgress(messageData);
            } else {
                messageData.showProgress = false;
            }
        },
        /**
         * Bắt đầu xử lý tiến trình thông báo
         * @param {*} messageData 
         * Author: tttuan 10/09/2022
         */
        startProgress(messageData, startFrom = 0) {
            const self = this;

            // lấy thời gian bắt đầu xuât hiện thông báo
            const startTime = performance.now();

            const start = () => {

                // cho phép gọi tới animationFrame để tính toán thời gian hiển thị thông báo
                messageData.animationFrame = requestAnimationFrame((timestamp) => {

                    // tính toán thời gian đã trôi qua từ khi thông báo xuất hiện
                    const timeElapsed = timestamp - startTime + startFrom;
                    self.time = timeElapsed;
                    // kiểm tra xem thông báo đã bị xóa chưa hoặc người dùng đã 
                    // tạm dừng thông báo bằng cách di chuột qua thông báo hay chưa
                    if (!self.isToast(messageData) || messageData.paused) {
                        // dừng xử lý tiến trình thông báo và hủy yêu cầu gọi animationFrame
                        cancelAnimationFrame(messageData.animationFrame);
                        return;
                    } else if (timeElapsed < messageData.timeout) {
                        // nếu thời gian hiển thị thông báo chưa đạt đến thời gian timeout
                        // thì cập nhật lại tiến trình thông báo
                        messageData.progress = timeElapsed / messageData.timeout;

                        // tiếp tục xử lý tiến trình thông báo
                        start();
                    } else {
                        // nếu thời gian hiển thị thông báo đã đạt đến thời gian timeout thì đặt tiến trình thông báo là 100%
                        messageData.progress = 1;

                        // hủy yêu cầu gọi tới animationFrame của thông báo
                        cancelAnimationFrame(messageData.animationFrame);

                        // xóa thông báo
                        self.removeMessage(messageData);
                        return;
                    }
                });
            }

            // bắt đầu xử lý tiến trình thông báo
            start();
        },
        /**
         * Dừng xử lý tiến trình thông báo
         * @param {*} messageData 
         * Author: tttuan 10/09/2022
         */
        pauseProgress(messageData) {
            // Nếu thông báo đang được hiển thị thì dừng xử lý tiến trình thông báo
            if (messageData.timeout > 0) {
                messageData.paused = true;
                cancelAnimationFrame(messageData.animationFrame);
            }
        },
        /**
        * Tiếp tục xử lý tiến trình thông báo
        * @param {*} messageData 
        * Author: tttuan 10/09/2022
        */
        resumeProgress(messageData) {
            // Nếu thông báo đang được hiển thị thì tiếp tục xử lý tiến trình thông báo
            if (messageData.timeout > 0) {
                messageData.paused = false;
                this.startProgress(messageData, messageData.progress * messageData.timeout);
            }
        },
        /**
        * Xóa 1 toast khỏi danh sách các toast
        * @param {*} messageData 
        * Author: tttuan 10/09/2022
        */
        removeMessage(messageData) {
            this.toasts = this.toasts.filter((toast) => toast.id !== messageData.id);
        },
        /**
         * Kiểm tra xem thông báo có nằm trong danh sách các thông báo hiển thị hay không
         * @param {*} messageData
         * Author: tttuan 10/09/2022
         */
        isToast(messageData) {
            return this.toasts.some((toast) => toast.id === messageData.id);

        },
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base/toast.scss";
</style>