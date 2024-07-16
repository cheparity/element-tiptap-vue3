import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: false,
    timeout: 50000,
})
// 延时函数
function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
export default {
    // 文本摘要
    abstract: async function (params: { content: string }) {
        return (await api.post(`ai/chat/summarize/`, params)).data.summary
    },
    // 文本修饰
    polish: async function (params: { content: string }) {
        return (await api.post(`ai/chat/polish/`, params)).data.polished
    },
    // 翻译
    translate: async function (params: { content: string; language: string }) {
        return (await api.post(`ai/chat/translate/`, params)).data.translated
    },
    // 续写
    continueWrite: async function (params: { content: string }) {
        return (await api.post(`ai/chat/continue_write/`, params)).data.continued
    },
    // 文本改错
    correct: async function (params: { content: string }) {
        return (await api.post(`ai/correct/`, params)).data.response
    },

    // 生成图片
    generateImage: async function (params: Object) {
        const taskId = (
            await api.post(`ai/pictures/generate/`, params, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
        ).data.data.primaryTaskId

        console.log(`output->taskId`, taskId)
        await delay(5000)

        return (
            await api.post(
                `ai/pictures/get_img/`,
                { taskId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
        ).data.img
    },
    // 语音识别
    voiceRecognize: async function (params: object) {
        // 检查登陆状态
        // if (!localStorage.getItem('token')) {
        //     ElMessage.error('请先登录')
        //     return
        // }

        return await api.post(`ai/speeches/recognize/`, params)
    },
    // 图片目标检测
    objectDetect: async function (params: object) {
        return await api.post(`ai/ocr/pattern/`, params, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
        })
    },
}
