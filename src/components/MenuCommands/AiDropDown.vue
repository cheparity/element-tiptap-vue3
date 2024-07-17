<template>
    <el-dropdown placement="bottom" @command="handleCommand" trigger="click">
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
                <el-dropdown-item :icon="Picture" command="imageGen"
                    >{{ t('editor.extensions.Ai.chat.imageGen') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="Promotion" command="promptWriting"
                    >{{ t('editor.extensions.Ai.chat.promptWriting') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="MagicStick" command="generateTable"
                    >{{ t('editor.extensions.Ai.chat.generateTable') }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <!-- Dialog 区域 -->
    <AiDialog
        v-if="aiDialogVisible"
        :text="dialogText"
        :editor="editor"
        @onClose="() => closeChatDialog()"
        @onCopy="(content) => copyContent(content)"
        @onAccept="(content) => acceptText(content)"
    />
    <VoiceRecognition
        @onClose="() => (voiceRecognitionDialogVisible = false)"
        v-if="voiceRecognitionDialogVisible"
        :editor="editor"
        :content="voiceContent"
    />
    <AiImage @onClose="() => (aiImageDialogVisible = false)" v-show="aiImageDialogVisible" :editor="editor" />
    <AiPromptWriter
        @onClose="() => (aiPromptWriterDialogVisible = false)"
        v-show="aiPromptWriterDialogVisible"
        :editor="editor"
    />
</template>

<script setup lang="ts">
import { computed, inject, readonly, ref } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from 'element-plus'
import AiDialog from '@/components/MenuCommands/ElementAiDialog.vue'
import CommandButton from './CommandButton.vue'
import { Sugar, Aim, EditPen, Switch, Finished, Mic, MagicStick, Promotion, Picture } from '@element-plus/icons-vue'
import api from '@/api'
import VoiceRecognition from './VoiceRecognition.vue'
import AiImage from './AiImage.vue'
import AiPromptWriter from './AiPromptWriter.vue'

const aiPromptWriterDialogVisible = ref(false)
const aiImageDialogVisible = ref(false)
const voiceRecognitionDialogVisible = ref(false)
const voiceContent = ref('')
const props = defineProps({
    enableTooltip: {
        type: Boolean,
        required: false,
        default: true,
    },
    readonly: {
        type: Boolean,
        required: false,
        default: false,
    },
    editor: {
        type: Editor,
        required: true,
    },
    buttonIcon: {
        default: 'ai',
        type: String,
    },
})

function closeChatDialog() {
    aiDialogVisible.value = false
    dialogText.value = ''
}
const copyContent = (content: string) => {
    navigator.clipboard
        .writeText(content)
        .then(() => {
            ElMessage.success('内容已复制到剪贴板')
        })
        .catch((err) => {
            console.error('复制失败', err)
            ElMessage.success('😭复制失败了，稍后重试一下吧！')
        })
        .finally(() => {
            dialogText.value = ''
            aiDialogVisible.value = false
        })
}
const acceptText = (result: string) => {
    console.log('Accept result', result)
    const editor = props.editor
    editor.commands.insertContent(result)
    dialogText.value = ''
    aiDialogVisible.value = false
}
const t = inject('t')
const enableTooltip = inject('enableTooltip', true)
const isCodeViewMode = inject('isCodeViewMode', false)
const aiDialogVisible = ref(false)
const selectedContent = computed((): string => {
    const state = props.editor.state
    let text = ''
    if (state) {
        const { selection } = state
        text = state.doc.textBetween(selection.from, selection.to, '')
        console.log('Selected text', text)
    }

    return text
})

const dialogText = ref<string>('')

function handleCommand(command: string) {
    switch (command) {
        case 'summarize':
            // 把下面这个函数传进
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.abstract({
                content: selectedContent.value,
            }).then((ret) => {
                dialogText.value = ret
            })
            break
        case 'polish':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.polish({
                content: selectedContent.value,
            }).then((ret) => {
                dialogText.value = ret
            })
            break
        case 'translate':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.translate({
                content: selectedContent.value,
                language: 'en',
            }).then((ret) => {
                dialogText.value = ret
            })

            break
        case 'correct':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.correct({
                content: selectedContent.value,
            }).then((ret) => {
                dialogText.value = ret
            })

            break
        case 'continuation':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.continueWrite({
                content: selectedContent.value,
            }).then((ret) => {
                console.log('generate table return', ret)
                dialogText.value = ret
            })

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
        case 'generateTable':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.generateTable({
                content: selectedContent.value,
            }).then((ret) => {
                dialogText.value = ret
            })
            break
        default:
            console.log(`Unknown command: ${command}`)
    }
}
</script>
