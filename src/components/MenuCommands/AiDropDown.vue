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
                <el-dropdown-item divided />
                <el-dropdown-item :icon="Mic" command="voiceRecognition"
                >{{ t('editor.extensions.Ai.chat.asr') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="Picture" command="imageGen"
                >{{ t('editor.extensions.Ai.chat.imageGen') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="Promotion" command="promptWriting">
                    {{ t('editor.extensions.Ai.chat.promptWriting') }}
                </el-dropdown-item>
                <el-dropdown-item :icon="MagicStick" command="generateTable">
                    {{ t('editor.extensions.Ai.chat.generateTable') }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>

    <!-- Dialogs -->
    <AiDialog
        ref="aiDialog"
        v-if="aiDialogVisible"
        :text="dialogText"
        :editor="editor"
        @onClose="closeChatDialog"
        @onCopy="copyContent"
        @onAccept="acceptText"
    />
    <VoiceRecognition
        ref="voiceRecognition"
        @onClose="closeVoiceRecognitionDialog"
        v-if="voiceRecognitionDialogVisible"
        :editor="editor"
        :content="voiceContent"
    />
    <AiImage
        ref="aiImage"
        @onClose="closeAiImageDialog"
        v-if="aiImageDialogVisible"
        :editor="editor"
    />
    <AiPromptWriter
        ref="aiPromptWriter"
        @onClose="closeAiPromptWriterDialog"
        v-if="aiPromptWriterDialogVisible"
        :editor="editor"
    />
    <AiTranslate
        v-if="aiTranslateDialogVisible"
        @onClose="closeAiTranslateDialog"
        @onCopy="copyContent"
        @onAccept="acceptText"
        :editor="editor"
    />
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from 'element-plus'
import { Editor } from '@tiptap/vue-3'
import CommandButton from './CommandButton.vue'
import { Sugar, Aim, EditPen, Switch, Finished, Mic, MagicStick, Promotion, Picture } from '@element-plus/icons-vue'
import api from '@/api'
import AiDialog from '@/components/MenuCommands/ElementAiDialog.vue'
import VoiceRecognition from './VoiceRecognition.vue'
import AiImage from './AiImage.vue'
import AiPromptWriter from './AiPromptWriter.vue'
import AiTranslate from './AiTranslate.vue'

const clearAllContents = () => {
    voiceContent.value = ''
    dialogText.value = ''
}
const aiTranslateDialogVisible = ref(false)
const aiPromptWriterDialogVisible = ref(false)
const aiImageDialogVisible = ref(false)
const voiceRecognitionDialogVisible = ref(false)
const voiceContent = ref('')
const props = defineProps({
    enableTooltip: {
        type: Boolean,
        required: false,
        default: true
    },
    readonly: {
        type: Boolean,
        required: false,
        default: false
    },
    editor: {
        type: Editor,
        required: true
    },
    buttonIcon: {
        default: 'ai',
        type: String
    }
})

const aiDialogVisible = ref(false)
const dialogText = ref<string>('')

const t = inject('t')
const enableTooltip = inject('enableTooltip', true)
const isCodeViewMode = inject('isCodeViewMode', false)
const selectedContent = computed((): string => {
    const state = props.editor.state
    let text = ''
    if (state) {
        const { selection } = state
        text = state.doc.textBetween(selection.from, selection.to)
    }
    return text
})

const closeChatDialog = () => {
    aiDialogVisible.value = false
    clearAllContents()
}

const closeVoiceRecognitionDialog = () => {
    voiceRecognitionDialogVisible.value = false
    clearAllContents()
}

const closeAiImageDialog = () => {
    aiImageDialogVisible.value = false
    clearAllContents()
}

const closeAiTranslateDialog = () => {
    aiTranslateDialogVisible.value = false
    clearAllContents()
}

const closeAiPromptWriterDialog = () => {
    aiPromptWriterDialogVisible.value = false
    clearAllContents()
}

const copyContent = (content: string) => {
    navigator.clipboard
        .writeText(content)
        .then(() => {
            ElMessage.success('内容已复制到剪贴板')
        })
        .catch((err) => {
            console.error('复制失败', err)
            ElMessage.error('😭复制失败了，稍后重试一下吧！')
        })
        .finally(() => {
            aiDialogVisible.value = false
            clearAllContents()
        })
}

const acceptText = (result: string) => {
    const editor = props.editor
    editor.commands.insertContent(result)
    dialogText.value = ''
    aiDialogVisible.value = false
}

const handleCommand = (command: string) => {
    props.editor.commands.blur()
    switch (command) {
        case 'summarize':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.abstract({ content: selectedContent.value }).then((ret) => {
                dialogText.value = ret
            })
            break
        case 'polish':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.polish({ content: selectedContent.value }).then((ret) => {
                dialogText.value = ret
            })
            break
        case 'translate':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiTranslateDialogVisible.value = true
            break
        case 'correct':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.correct({ content: selectedContent.value }).then((ret) => {
                dialogText.value = ret
            })
            break
        case 'continuation':
            if (selectedContent.value === '') {
                ElMessage.warning('请先选择要处理的内容！')
                return
            }
            aiDialogVisible.value = true
            api.continueWrite({ content: selectedContent.value }).then((ret) => {
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
            api.generateTable({ content: selectedContent.value }).then((ret) => {
                dialogText.value = ret
            })
            break
        default:
            console.error('Unknown command:', command)
    }
}
</script>
