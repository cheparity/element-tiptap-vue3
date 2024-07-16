<template>
    <div class="el-tiptap-editor__left-sidebar">
        <div class="trigger-area" @mouseover="openSidebar" @mouseleave="closeSidebar"></div>
        <div class="sidebar" :class="{ open: isOpen }" @mouseover="openSidebar" @mouseleave="closeSidebar">
            <el-tree-v2
                :data="treeData"
                :height="300"
                :props="defaultProps"
                :default-expanded-keys="defaultExpandedKeys"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElTreeV2 } from 'element-plus'

const isOpen = ref(false)
const treeData = ref([
    {
        id: 1,
        label: '2023/9/15',
        children: [
            { id: 2, label: '项目结构' },
            { id: 3, label: '总体思路' },
        ],
    },
    {
        id: 4,
        label: '2023/9/17',
        children: [
            { id: 5, label: '难点' },
            { id: 6, label: '思路（一）' },
            { id: 7, label: '思路（二）' },
        ],
    },
    {
        id: 8,
        label: '2023/9/20',
        children: [{ id: 9, label: '重新架构思路' }],
    },
])
const defaultProps = ref({
    label: 'label',
    children: 'children',
})

const defaultExpandedKeys = ref([])

const openSidebar = () => {
    isOpen.value = true
}

const closeSidebar = () => {
    isOpen.value = false
}

onMounted(() => {
    // 设置默认展开为二级标题
    treeData.value.forEach((item) => {
        if (item.children) {
            defaultExpandedKeys.value.push(item.id)
        }
    })
})
</script>

<style scoped>
.el-tiptap-editor__left-sidebar {
    position: absolute;
    height: 100vh;

    .trigger-area {
        position: fixed;
        left: -10px;
        width: 10px;
        height: 300px; /* Adjust this value to your preferred size */
        top: 50%;
        transform: translateY(-50%);
        background-color: transparent;
    }

    .sidebar {
        position: fixed;
        width: 300px;
        height: auto;
        min-height: 50%;
        max-height: 70%;
        background-color: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        left: 10px;
        top: 50%;
        transform: translateY(-50%) translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .sidebar.open {
        transform: translateY(-50%) translateX(0);
    }
}
</style>
