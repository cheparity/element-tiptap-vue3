import axios from 'axios'
console.log('process env', process.env)
// const edivator_backend_api = process.end.EDIVATOR_BACKEND_API
const edivator_backend_api = 'http://101.201.173.118/api/'
// const edivator_backend_api = 'http://localhost:8000/api/'
const api = axios.create({
    baseURL: edivator_backend_api,
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
    // 生成表格
    generateTable: async function (params: { content: string }) {
        return (await api.post(`ai/chat/form/`, params)).data.res
    },

    //TODO 生成图片
    generateImage: async function (params: Object) {
        const data = (await api.post(`ai/pictures/generate/`, params)).data
        const taskId = data.data.primaryTaskId
        await delay(5000)

        return (await api.post(`ai/pictures/get_img/`, { taskId })).data.img
    },
    // 语音识别
    voiceRecognize: async function (params: object) {
        return await api.post(`ai/speeches/recognize/`, params)
    },
    // 图片目标检测
    objectDetect: async function (params: object) {
        return await api.post(`ai/ocr/pattern/`, params)
    },
    OCR: async function (params: object) {
        return await api.post(`ai/ocr/infer/`, params)
    },
    // 以特定的风格生成文本
    generateText: async function (params: object) {
        return (await api.post(`ai/chat/styled_ggenerate/`, params)).data.response
    },
}
