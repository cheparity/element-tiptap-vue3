<template>
    <div class="el-tiptap-editor__ai-text" style="width: 650px">
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
            <el-select v-model="selectedStyle" placeholder="Tone style" @click="editor.commands.blur()">
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
