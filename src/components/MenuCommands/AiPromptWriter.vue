<template>
    <div class="el-tiptap-editor__ai-text">
        <div style="margin-bottom: 15px">{{ t('editor.extensions.Ai.chat.prompt') }}</div>
        <!-- 加载框 -->
        <el-skeleton v-if="clickedGenerate" :loading="loading" style="width: 100%; margin-bottom: 20px" animated>
            <template #template>
                <el-skeleton :rows="5" animated />
            </template>
            <template #default>
                <el-card :body-style="{ padding: '0px', marginBottom: '5px' }">{{ result }}</el-card>
            </template>
        </el-skeleton>

        <el-input
            type="textarea"
            v-model="prompt"
            class="el-tiptap-editor__ai-text__input"
            maxlength="50"
            :placeholder="t('editor.extensions.Ai.chat.promptWriting_prompt')"
        ></el-input>

        <div class="left-right">
            <el-select v-model="selectedStyle" placeholder="Tone style">
                <el-option v-for="style in textStyles" :key="style" :label="style" :value="style"></el-option>
            </el-select>
            <el-button v-if="!clickedGenerate" round style="width: auto; margin-left: 100px" @click="generateText"
                >Generate Text</el-button
            >
            <el-button
                v-if="clickedGenerate && !loading"
                round
                style="width: auto; margin-left: 100px"
                @click="acceptText"
                >Accept Text</el-button
            >
            <el-button type="danger" round style="width: auto; margin-left: 10px" @click="emits('onClose')"
                >Close
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { ElButton, ElMessage, ElInput, ElSelect, ElOption, ElCard, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { Editor } from '@tiptap/vue-3'
import api from '@/api'
const emits = defineEmits(['onClose'])
const clickedGenerate = ref(false)
const props = defineProps({
    editor: {
        type: Editor,
        required: true,
    },
})
const t = inject('t')
const prompt = ref('')
const textStyles = ref(['二次元', '写实风格', '古风', '赛博朋克', '水彩画', '油画', '卡通画'])
const selectedStyle = ref('')
const loading = ref(true)
const result = ref('')
const acceptText = () => {
    // 插入到当前光标位置
    const editor = props.editor
    editor.commands.insertContent(result.value)
}

const generateText = () => {
    clickedGenerate.value = true
    loading.value = true
    api.generateText({
        content: prompt.value,
        style: selectedStyle.value,
    })
        .then((response) => {
            result.value = response
        })
        .catch((err) => {
            ElMessage.error('Failed to generate text', err)
        })
        .finally(() => {
            loading.value = false
        })
}
</script>

<style scoped>
.el-tiptap-editor__ai-text {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #90caf9;
    border-radius: 10px;
    z-index: 1000;
    height: auto;
    width: 500px;
    max-width: 100%;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    .el-tiptap-editor__ai-text__input {
        background-color: whitesmoke;
        margin-bottom: 20px;
    }

    .left-right {
        margin-top: 14px;
        display: flex;
        flex-direction: row;
    }
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #007bff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    }
}
</style>
