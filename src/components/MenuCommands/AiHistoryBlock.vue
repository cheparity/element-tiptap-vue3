<template>
    <div class="history-block">
        <h3>{{ type }}</h3>
        <div class="content-box">
            <p>{{ renderedContent }}</p>
        </div>
        <div class="button-group">
            <el-button type="primary" @click="acceptText">Accept Text</el-button>
            <el-button @click="copyContent">Copy Text</el-button>
        </div>
        <div class="button-group">
            <el-button type="danger" @click="closeBlock">Close</el-button>
            <el-button @click="regenerate">Regenerate</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { eventBus } from '@/eventBus'

const props = defineProps({
    type: String,
    content: String,
    range: Object,
    index: Number,
})

watch(props, () => {
    renderedContent.value = ''
    renderText()
})

const renderedContent = ref('')
let interval: NodeJS.Timeout

const renderText = () => {
    let index = 0
    interval = setInterval(() => {
        if (index < props.content.length) {
            renderedContent.value += props.content[index]
            index++
        } else {
            clearInterval(interval)
        }
    }, 20) // 调整时间间隔以控制渲染速度
}

onMounted(() => {
    renderText()
})

const acceptText = () => {
    eventBus.emit('acceptText', { content: props.content, range: props.range })
}

const copyContent = () => {
    navigator.clipboard
        .writeText(props.content)
        .then(() => {
            ElMessage.success('内容已复制到剪贴板')
        })
        .catch((err) => {
            console.error('复制失败', err)
            ElMessage.error('😭复制失败了，稍后重试一下吧！')
        })
}

const closeBlock = () => {
    eventBus.emit('closeBlock', props.content)
}

const regenerate = () => {
    eventBus.emit('regenerate', props.index)
}
</script>

<style scoped>
.history-block {
    border: 1px solid #eaeaea;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.history-block h3 {
    margin: 0 0 10px 0;
    font-size: 1.2em;
    font-weight: bold;
}

.content-box {
    border: 1px solid #dcdcdc;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
}

.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
}

.button-group .el-button {
    flex: 1;
}
</style>
