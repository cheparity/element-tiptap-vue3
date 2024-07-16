import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: false,
    timeout: 50000
})

export default {
    // 文本摘要
    abstract: async function(params: { content: string }) {
        return (await api.post(`ai/chat/summarize/`, params)).data.summary
    },
    // 文本修饰
    polish: async function(params: { content: string }) {
        return (await api.post(`ai/chat/polish/`, params)).data.polished
    },
    // 翻译
    translate: async function(params: { content: string, language: string }) {
        return (await api.post(`ai/chat/translate/`, params)).data.translated
    },
    // 续写
    continueWrite: async function(params: { content: string }) {
        return (await api.post(`ai/chat/continue_write/`, params)).data.continued
    },
    // 文本改错
    correct: async function(params: { content: string }) {
        return (await api.post(`ai/correct/`, params)).data.response
    }
}