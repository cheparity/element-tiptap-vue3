<template>
    <div class="el-tiptap-editor__right-sidebar">
        <div class="trigger-area" @mouseover="openSidebar" @mouseleave="closeSidebar"></div>
        <div class="sidebar" :class="{ open: isOpen }" @mouseover="openSidebar" @mouseleave="closeSidebar">
            <el-menu class="sidebar-menu" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1">大纲</el-menu-item>
                <el-menu-item index="2">AI 历史</el-menu-item>
                <el-menu-item index="3">设置</el-menu-item>
                <el-menu-item index="4">书签</el-menu-item>
                <el-menu-item index="5">注释</el-menu-item>
                <el-menu-item index="6">快捷键</el-menu-item>
            </el-menu>
            <div v-show="selectedMenuItem === '1'">
                <h2 class="outline__title">TABLE OF CONTENTS</h2>
                <el-tree
                    class="sidebarTree"
                    node-key="id"
                    :default-expanded-keys="defaultExpandedKeys"
                    :data="treeData"
                    :props="{ label: 'label', children: 'children' }"
                    :height="400"
                />
            </div>
            <div style="overflow-y: auto" v-show="selectedMenuItem === '2'">
                <h2 class="outline__title">AI 历史</h2>
                <HistoryPanel :editor="editor" />
            </div>
            <div v-show="selectedMenuItem === '3'">
                <h2 class="outline__title">设置</h2>
                <!-- 设置功能的具体实现 -->
            </div>
            <div v-show="selectedMenuItem === '4'">
                <h2 class="outline__title">书签</h2>
                <!-- 书签功能的具体实现 -->
            </div>
            <div v-show="selectedMenuItem === '5'">
                <h2 class="outline__title">注释</h2>
                <!-- 注释功能的具体实现 -->
            </div>
            <div v-show="selectedMenuItem === '6'">
                <h2 class="outline__title">常用快捷键</h2>
                <ul class="shortcut-keys">
                    <li><span class="key-combination">Ctrl + C</span><span class="key-description">复制</span></li>
                    <li><span class="key-combination">Ctrl + V</span><span class="key-description">粘贴</span></li>
                    <li><span class="key-combination">Ctrl + X</span><span class="key-description">剪切</span></li>
                    <li><span class="key-combination">Ctrl + A</span><span class="key-description">全选</span></li>
                    <li><span class="key-combination">Ctrl + Z</span><span class="key-description">撤销</span></li>
                    <li><span class="key-combination">Ctrl + Y</span><span class="key-description">重做</span></li>
                    <li><span class="key-combination">Ctrl + B</span><span class="key-description">加粗</span></li>
                    <li><span class="key-combination">Ctrl + U</span><span class="key-description">下划线</span></li>
                    <li><span class="key-combination">Ctrl + I</span><span class="key-description">斜体</span></li>
                    <li><span class="key-combination">Ctrl + P</span><span class="key-description">打印</span></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, computed } from 'vue'
import { ElTree, ElMenu, ElMenuItem, ElCard } from 'element-plus'
import { Editor } from '@tiptap/vue-3'
import { eventBus } from '@/eventBus'
import HistoryPanel from '@/components/MenuCommands/HistoryPanel.vue'

const isOpen = ref(false)
const selectedMenuItem = ref('1')

const props = defineProps({
    editor: {
        type: Editor,
        required: true,
    },
})

const scrollToSelection = (editor: Editor): void => {
    const { node } = editor.view.domAtPos(editor.state.selection.anchor)
    if (node) {
        ;(node as any).scrollIntoView?.(false)
    }
}

const defaultExpandedKeys = computed(() => {
    const keys = treeData.value.map((item) => item.id)
    return keys
})

const loadHeadings = (): any[] => {
    const headings: any[] = []
    const editor = props.editor
    if (!editor) return []

    const transaction = editor.state.tr
    if (!transaction) return []

    editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
            const start = pos
            const end = pos + node.nodeSize
            const id = `heading-${headings.length + 1}`
            if (node.attrs.id !== id) {
                transaction.setNodeMarkup(pos, undefined, { ...node.attrs, id })
            }

            headings.push({
                node: node,
                pos: pos,
                level: node.attrs.level,
                text: node.textContent,
                start,
                end,
                id,
            })
        }
    })

    transaction.setMeta('addToHistory', false)
    transaction.setMeta('preventUpdate', true)
    editor.view.dispatch(transaction)
    return headings
}

eventBus.on('addAiHistory', () => {
    handleSelect('2')
})

const treeData = ref<
    {
        id: number
        label: string
        children: any[]
    }[]
>([])

const mapHeadingsToTreeData = (
    headings: {
        node: any
        pos: any
        level: number
        text: string
        start: number
        end: number
        id: number
    }[]
) => {
    const allData: {
        id: number
        label: string
        children: any[]
    }[] = []
    treeData.value = []
    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i]
        const { level, text, id } = heading
        const data = {
            id: id,
            label: text,
            children: [],
        }

        allData.push(data)
        let flag = false
        for (let j = i - 1; j >= 0; j--) {
            if (headings[j].level < level) {
                allData[j].children.push(data)
                flag = true
                break
            }
        }
        if (!flag) {
            treeData.value.push(data)
        }
    }
}

const openSidebar = () => {
    const headings = loadHeadings()
    mapHeadingsToTreeData(headings)
    treeData.value = treeData.value.slice()
    isOpen.value = true
}

const closeSidebar = () => {
    isOpen.value = false
}

const handleSelect = (key) => {
    selectedMenuItem.value = key
}

const aiHistories = ref<Array<{ type: string; content: string }>>([])

onMounted(() => {
    const headings = loadHeadings()
    eventBus.on('addAiHistory', (history) => {
        aiHistories.value.push(history)
    })
})
</script>

<style scoped>
.trigger-area {
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
}

.sidebar {
    width: 250px;
    position: absolute;
    top: 10%;
    left: 20px;
    transition: transform 0.3s ease;
    transform: translateX(-100%);
    background-color: white;
    z-index: 1000;
    border: 1px solid #dcdfe6;
    padding: 10px;
}

.sidebar-menu {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0 5px;
}

.outline__title {
    font-size: 16px;
    margin-bottom: 10px;
}

.sidebarTree {
    height: 400px;
    overflow: auto;
}

.shortcut-keys {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: auto auto;
    gap: 5px 10px;
}

.shortcut-keys li {
    display: contents;
}

.key-combination {
    font-weight: bold;
    margin-top: 15px;
    color: rgb(80, 80, 80);
}

.key-description {
    color: rgb(90, 90, 90);
    margin-top: 15px;
}

.ai-history-block {
    margin-bottom: 10px;
}
</style>
