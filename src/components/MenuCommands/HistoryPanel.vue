<template>
    <div>
        <ai-history-block
            v-for="(history, index) in aiHistory"
            :key="index"
            :type="history.type"
            :content="history.content"
            :range="history.range"
            :index="index"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import AiHistoryBlock from './AiHistoryBlock.vue'
import { eventBus } from '@/eventBus'
import api from '@/api'

const props = defineProps({
    editor: {
        type: Object,
        required: true,
    },
})

const aiHistory = ref([])

eventBus.on('addAiHistory', (history) => {
    aiHistory.value.push(history)
})

eventBus.on('acceptText', ({ content, range }) => {
    // 调用父组件的 acceptText 方法
    const editor = props.editor
    editor.commands.deleteRange(range)
    editor.commands.insertContentAt(range.from, content)
    aiHistory.value = aiHistory.value.filter((item) => item.content !== content)
})

eventBus.on('closeBlock', (content) => {
    aiHistory.value = aiHistory.value.filter((item) => item.content !== content)
})

const handleCommand = async (command: string, content: string, range: Object, isRegenerate = false) => {
    props.editor.commands.blur()
    let ret = ''
    switch (command) {
        case 'summarize':
            ret = await api.abstract({ content: content })
            return { type: 'summarize', content: ret, range: range, origin: content }
        case 'polish':
            ret = await api.polish({ content: content })
            return { type: 'polish', content: ret, range: range, origin: content }
        case 'correct':
            ret = await api.correct({ content: content })
            return { type: 'correct', content: ret, range: range, origin: content }
        case 'continuation':
            ret = await api.continueWrite({ content: content })
            return { type: 'continuation', content: ret, range: range, origin: content }
    }
}

eventBus.on('regenerate', async (index) => {
    // 调用父组件的 regenerate 方法
    console.log(`output->index`, index)
    aiHistory.value[index].content = ''
    console.log(`output->aiHistory.value`, aiHistory.value)
    const ret = await handleCommand(
        aiHistory.value[index].type,
        aiHistory.value[index].origin,
        aiHistory.value[index].range
    )
    aiHistory.value.splice(index, 1, ret)
    console.log(`output->ai`, aiHistory.value)
})
</script>
