<template>
    <el-popover placement="top" trigger="click" popper-class="el-tiptap-popper" ref="popoverRef">
        <div class="el-tiptap-popper__menu">
            <div
                v-for="item in menuItems"
                :key="item.key"
                :class="{
                    'el-tiptap-popper__menu__item--active': item === currItem,
                }"
                class="el-tiptap-popper__menu__item"
                @mousedown="hidePopover"
                @click="handleCommand(item)"
            >
                <span>{{ item.name }}</span>
            </div>
        </div>

        <template #reference>
            <span>
                <command-button
                    :enable-tooltip="enableTooltip"
                    :tooltip="t('editor.extensions.Ai.tooltip')"
                    icon="ai"
                    :button-icon="buttonIcon"
                    @click="openAiImageDialog"
                />
            </span>
        </template>
    </el-popover>

    <div v-show="ocrDialogVisible" class="el-tiptap__ocr-dialog-visible">
        <el-dialog width="600px" :before-close="handleClose" :custom-class="'custom-dialog'">
            <template #title>
                <span>OCR 结果</span>
            </template>
            <div class="dialog-content">
                <div v-if="loading" class="loading-container">
                    <div class="loading-spinner"></div>
                </div>
                <div v-else class="ocr-content">
                    <img :src="ocrResult.image" alt="OCR Image" class="ocr-image" />
                    <div class="text-container" v-html="ocrResult.text"></div>
                </div>
            </div>
            <div class="dialog-footer">
                <el-button @click="acceptResult">接受</el-button>
                <el-button @click="ocrDialogVisible = false" class="close-button">关闭</el-button>
            </div>
        </el-dialog>
    </div>

    <div v-show="odDialogVisible" class="el-tiptap__od-dialog-visible">
        <el-dialog width="600px" :before-close="handleClose" :custom-class="'custom-dialog'">
            <template #title>
                <span>目标检测结果</span>
            </template>
            <div class="dialog-content">
                <div v-if="loading" class="loading-container">
                    <div class="loading-spinner"></div>
                </div>
                <div v-else class="ocr-content">
                    <div v-for="(item, index) in odResult" :key="index" class="ocr-item">
                        <div class="ocr-item-header">
                            <span class="ocr-score">Score: {{ item.score }}</span>
                            <span class="ocr-keyword">{{ item.keyword }}</span>
                        </div>
                        <div v-if="item.baike_info.baike_url || item.baike_info.image_url" class="ocr-item-content">
                            <a :href="item.baike_info.baike_url" target="_blank" v-if="item.baike_info.baike_url"
                                >百科链接</a
                            >
                            <a v-if="item.baike_info.image_url">
                                {{ item.tem.baike_info.image_url }}
                            </a>
                            <!--                            <img-->
                            <!--                                :src="item.baike_info.image_url"-->
                            <!--                                alt="image"-->
                            <!--                                v-if="item.baike_info.image_url"-->
                            <!--                                class="ocr-image"-->
                            <!--                            />-->
                            <p v-if="item.baike_info.description">{{ item.baike_info.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <!-- <el-button @click="acceptResult">接受</el-button> -->
                <el-button @click="odDialogVisible = false" class="close-button">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="js">
import {ref, inject} from 'vue'
import {nodeViewProps} from '@tiptap/vue-3'
import {ElPopover} from 'element-plus'
import CommandButton from '../CommandButton.vue'
import api from '@/api'

const props = defineProps({
    node: nodeViewProps['node'],
    updateAttrs: nodeViewProps['updateAttributes'],
    buttonIcon: {
        type: String,
        default: '',
    },
})
const ocrResult = ref({
    image: '',
    text: '',
})
const odResult = ref([])
const acceptResult = () => {
    console.log('accept result')
}
const closeDialog = () => {
    ocrDialogVisible.value = false
}

const odDialogVisible = ref(false)

const loading = ref(false)
const ocrDialogVisible = ref(false)

const t = inject('t')
const enableTooltip = inject('enableTooltip', true)

const popoverRef = ref(null)
const currItem = ref('')
const menuItems = ref([{key: 'ocr', name: t('editor.extensions.Ai.image.ocr')}, {
    key: 'od',
    name: t('editor.extensions.Ai.image.od')
}])

const openAiImageDialog = () => {
    // Your logic to open the dialog
    console.log('Open AI Image Dialog')
}

const hidePopover = () => {
    if (popoverRef.value) {
        popoverRef.value.hide()
    }
}

const handleCommand = (item) => {
    console.log('Command', item)
    currItem.value = item
    loading.value = true
    // Handle command execution logic based on the item
    const node = props.node
    if (item.key === 'ocr') {
        // Your OCR logic here
        const url = node.attrs.src
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader()
                reader.onloadend = async () => {
                    const base64_img = reader.result.split(',')[1] // 去掉前缀
                    console.log(`output->base64_img`, base64_img)
                    try {
                        // 调用 OCR 接口
                        const ocrResponse = await api.OCR({
                            base64_img,
                        })

                        console.log(`output->ocrResponse`, ocrResponse.data)
                        const ocrImageUrl = ocrResponse.data.image_url
                        const ocrTexts = ocrResponse.data.texts.join(', ')

                        console.log(`output->ocrImageUrl`, ocrImageUrl)
                        // 插入 OCR 结果图片
                        // editor.chain().focus().deleteRange({ from: getPos(), to: getPos() + node.nodeSize }).setImage({ src: ocrImageUrl }).run()
                        ocrResult.value.image = ocrImageUrl

                        // 插入识别结果文字
                        // editor.chain().focus().insertContent(`<p>${ocrTexts}</p>`).run()
                        ocrResult.value.text = ocrTexts

                    } catch (ocrError) {
                        console.error('OCR 识别失败:', ocrError)
                    }
                }
                reader.readAsDataURL(blob)
                ocrDialogVisible.value = true
            })
            .finally(() => {
                loading.value = false
            })
    } else if (item.key === 'od') {
        // Your target detection logic here
        // 将图片转为 base64
        const url = node.attrs.src
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader()
                reader.onloadend = async () => {
                    const base64_img = reader.result.split(',')[1] // 去掉前缀
                    console.log(`output->base64_img`, base64_img)
                    try {
                        // 调用 OCR 接口
                        const ocrResponse = await api.objectDetect({
                            base64_img,
                        })
                        odResult.value = ocrResponse.data.result
                        console.log(`output->ocrResponse`, odResult.value)

                    } catch (ocrError) {
                        console.error('OCR 识别失败:', ocrError)
                    }
                }
                reader.readAsDataURL(blob)
                odDialogVisible.value = true
            })
            .finally(() => {
                loading.value = false
            })
    }
}
</script>

<style scoped>
.el-tiptap__ocr-dialog-visible {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    font-family: 'Arial', sans-serif;
    animation: border-animation 2s infinite;
    background-color: #e3f2fd; /* Light blue background color */
    border: 1px solid #90caf9; /* Light blue border color */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 1000;

    .dialog-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        color: #333;
    }

    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #007bff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    }

    .ocr-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .ocr-image {
        max-width: 100%;
        margin-bottom: 10px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .text-container {
        width: 100%;
        text-align: left;
        padding: 10px;
        background-color: #ffffff; /* White background for text container */
        border-radius: 5px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow: auto;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 5px;
    }

    .close-button {
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 14px;
        padding: 5px 10px;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .close-button:hover {
        background-color: #0056b3;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}

.el-tiptap__od-dialog-visible {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    font-family: 'Arial', sans-serif;
    animation: border-animation 2s infinite;
    background-color: #e3f2fd; /* Light blue background color */
    border: 1px solid #90caf9; /* Light blue border color */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 1000;

    custom-dialog {
        background-color: #e3f2fd; /* Light blue background color */
        border: 1px solid #90caf9; /* Light blue border color */
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 10px;
    }

    .dialog-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        color: #333;
    }

    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #007bff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    }

    .ocr-content {
        width: 100%;
    }

    .ocr-item {
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        padding: 10px;
        margin-bottom: 10px;
        width: 100%;
    }

    .ocr-item-header {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .ocr-score {
        color: #007bff;
    }

    .ocr-keyword {
        color: #626aef;
    }

    .ocr-item-content {
        margin-top: 10px;
    }

    .ocr-image {
        max-width: 100%;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 5px;
    }

    .close-button {
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 14px;
        padding: 5px 10px;
        border-radius: 5px;
        transition: background-color 0.3s;
    }

    .close-button:hover {
        background-color: #0056b3;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
}
</style>
