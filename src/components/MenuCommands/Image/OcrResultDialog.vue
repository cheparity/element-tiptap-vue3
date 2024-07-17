<template>
    <el-dialog v-model="dialogVisible" width="600px" :before-close="handleClose" :custom-class="'custom-dialog'">
        <template #title>
            <span>OCR 结果</span>
        </template>
        <div class="dialog-content">
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
            </div>
            <div v-else class="ocr-content">
                <img :src="ocrResult.image" alt="OCR Image" class="ocr-image" />
                <div class="text-container" v-html="ocrResult.text"></div>
            </div>
        </div>
        <div class="dialog-footer">
            <el-button @click="acceptResult">接受</el-button>
            <el-button @click="closeDialog" class="close-button">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElDialog } from 'element-plus'

const props = defineProps({
    dialogVisible: Boolean,
})

const dialogVisible = ref(props.dialogVisible)

const loading = ref(true)
const ocrResult = ref({
    image: '',
    text: '',
})

const handleClose = () => {
    dialogVisible.value = false
}

const fetchOcrResult = async () => {
    try {
        // 模拟后端请求
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    image: 'https://via.placeholder.com/400', // 替换为实际的图片地址
                    text: '<p>这是 OCR 识别的文本</p>', // 替换为实际的 OCR 识别结果
                })
            }, 2000)
        })

        ocrResult.value = response
    } finally {
        loading.value = false
    }
}

const acceptResult = () => {
    console.log('接受了结果', ocrResult.value)
    handleClose()
}

const closeDialog = () => {
    handleClose()
}

fetchOcrResult()
</script>

<style scoped></style>
