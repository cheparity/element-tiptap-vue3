<template>
    <el-dropdown @command="handleCommand" trigger="click">
        <div>
            <command-button
                :enable-tooltip="enableTooltip"
                :tooltip="t('editor.extensions.Ai.tooltip')"
                :readonly="isCodeViewMode"
                icon="ai"
                :button-icon="buttonIcon"
            />
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <!-- 为了跟下面的语音识别风格统一，都是四个字 -->
                <el-dropdown-item :icon="Aim" command="summarize"
                    >{{ t('editor.extensions.Ai.chat.summarize') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="Sugar" command="polish"
                    >{{ t('editor.extensions.Ai.chat.polish') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="Switch" command="translate"
                    >{{ t('editor.extensions.Ai.chat.translate') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="Finished" command="correct"
                    >{{ t('editor.extensions.Ai.chat.correct') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="EditPen" command="continuation">
                    {{ t('editor.extensions.Ai.chat.continuation') }}
                </el-dropdown-item>
                <!-- 分割 -->
                <el-dropdown-item divided />
                <el-dropdown-item :icon="Mic" command="voiceRecognition"
                    >{{ t('editor.extensions.Ai.chat.asr') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="MagicStick" command="imageGen"
                    >{{ t('editor.extensions.Ai.chat.imageGen') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="Promotion" command="promptWriting"
                    >{{ t('editor.extensions.Ai.chat.promptWriting') }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <AiDialog
        v-if="aiDialogVisible"
        :fullContent="fullDialogContent"
        :loading="dialogLoading"
        @close="aiDialogVisible = false"
        @accept="acceptResult"
    />
    <VoiceRecognition v-if="voiceRecognitionDialogVisible" :editor="editor" :content="voiceContent" />
    <AiImage v-show="aiImageDialogVisible" :editor="editor" />
    <AiPromptWriter v-show="aiPromptWriterDialogVisible" :editor="editor" />
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from 'element-plus'
import AiDialog from '@/components/MenuCommands/AiDialog.vue'
import CommandButton from './CommandButton.vue'
import { Sugar, Aim, EditPen, Switch, Finished, Mic, MagicStick, Promotion } from '@element-plus/icons-vue'
import api from '@/api'
import AiImage from './AiImage.vue'
import AiPromptWriter from './AiPromptWriter.vue'

const aiPromptWriterDialogVisible = ref(false)
const aiImageDialogVisible = ref(false)
const voiceRecognitionDialogVisible = ref(false)
const voiceContent = ref('')
const props = defineProps({
    editor: {
        type: Editor,
        required: true,
    },
    buttonIcon: {
        default: 'ai',
        type: String,
    },
})

const t = inject('t')
const enableTooltip = inject('enableTooltip', true)
const isCodeViewMode = inject('isCodeViewMode', false)
const acceptResult = (content: string) => {
    console.log('接受了结果', content)
    props.editor.commands.insertContent(content)
}
const aiDialogVisible = ref(false)
const dialogLoading = ref(false)
const fullDialogContent = ref('')
const getSelectedContent = (): string => {
    const state = props.editor.state
    let text = ''
    if (state) {
        const { selection } = state
        text = state.doc.textBetween(selection.from, selection.to, '')
        console.log('Selected text', text)
    }
    if (text === '') {
        ElMessage.warning('请先选择要处理的内容！')
    }
    return text
}
const selectedContent = computed(() => getSelectedContent())
const copyContent = (content: string) => {
    navigator.clipboard
        .writeText(content)
        .then(() => {
            ElMessage('内容已复制到剪贴板')
        })
        .catch((err) => {
            console.error('复制失败', err)
            ElMessage('😭复制失败了，稍后重试一下吧！')
        })
}
const showLoadingDialog = () => {
    aiDialogVisible.value = true
    dialogLoading.value = true
    fullDialogContent.value = ''
}
const updateDialogContent = (newContent: string) => {
    dialogLoading.value = false
    fullDialogContent.value = newContent
}

function handleCommand(command: string) {
    switch (command) {
        case 'summarize':
            showLoadingDialog()
            api.abstract({
                content: getSelectedContent(),
            }).then((ret) => {
                // 现在是原先的效果
                // 原先是复制，但是我们现在可以稍作修改，直接插入
                updateDialogContent(ret)
                // props.editor.commands.insertContent(ret)
            })
            break
        case 'polish':
            showLoadingDialog()
            api.polish({
                content: getSelectedContent(),
            }).then((ret) => {
                updateDialogContent(ret)
            })
            break
        case 'translate':
            //点击执行这个函数，内容就会被替换掉
            showLoadingDialog()
            api.translate({
                content: getSelectedContent(),
                language: 'en',
            }).then((ret) => {
                updateDialogContent(ret)
            })

            // props.editor.commands.insertContent('This is polish')
            break
        case 'correct':
            showLoadingDialog()
            api.correct({
                content: getSelectedContent(),
            }).then((ret) => {
                updateDialogContent(ret)
            })

            // props.editor.commands.insertContent('This is polish')
            break
        case 'continuation':
            showLoadingDialog()
            api.continueWrite({
                content: getSelectedContent(),
            }).then((ret) => {
                updateDialogContent(ret)
            })

            // props.editor.commands.continuation()
            break
        case 'voiceRecognition':
            voiceRecognitionDialogVisible.value = true
            break
        case 'imageGen':
            aiImageDialogVisible.value = true
            break
        case 'promptWriting':
            aiPromptWriterDialogVisible.value = true
            break
        default:
            console.log(`Unknown command: ${command}`)
    }
}
</script>
