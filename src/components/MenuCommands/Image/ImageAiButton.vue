<template>
    <div>
        <command-button
            :command="openEditImageDialog"
            :enable-tooltip="enableTooltip"
            :tooltip="t('editor.extensions.Ai.tooltip')"
            icon="ai"
            :button-icon="buttonIcon"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, defineProps } from 'vue'
import { nodeViewProps } from '@tiptap/vue-3'
import { Aim, Camera } from '@element-plus/icons-vue'
import CommandButton from '../CommandButton.vue'

const props = defineProps({
    node: nodeViewProps['node'],
    updateAttrs: nodeViewProps['updateAttributes'],
    buttonIcon: {
        type: String,
        default: '',
    },
})

const t = inject('t')
const enableTooltip = inject('enableTooltip', true)

const AiImageDialogVisible = ref(false)
const imageAttrs = ref(getImageAttrs())

function getImageAttrs() {
    return {
        src: props.node!.attrs.src,
        alt: props.node!.attrs.alt,
        width: props.node!.attrs.width,
        height: props.node!.attrs.height,
    }
}

function syncImageAttrs() {
    imageAttrs.value = getImageAttrs()
}

function updateImageAttrs() {
    let { width, height } = imageAttrs.value

    // input converts it to string
    width = parseInt(width as string, 10)
    height = parseInt(height as string, 10)

    props.updateAttrs!({
        alt: imageAttrs.value.alt,
        width: width >= 0 ? width : null,
        height: height >= 0 ? height : null,
    })

    closeEditImageDialog()
}

function openEditImageDialog() {
    AiImageDialogVisible.value = true
}

function closeEditImageDialog() {
    AiImageDialogVisible.value = false
}

function handleCommand() {
    console.log('command')
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
