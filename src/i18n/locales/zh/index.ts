export default {
    editor: {
        extensions: {
            Ai: {
                tooltip: 'AI 选项',
                image: {
                    ocr: '光学字符识别',
                    od: '目标检测',
                },
                chat: {
                    prompt: '提示',
                    summarize: '总结',
                    polish: '润色文档',
                    translate: '翻译',
                    correct: '纠正',
                    continuation: '继续写作',
                    asr: '语音识别',
                    imageGen: '生成 AI 图像',
                    imageGen_prompt: '描述您想要生成的图像。',
                    promptWriting: '根据提示写作',
                    promptWriting_prompt: '生成指定文本',
                    generateTable: 'AI 识别表格',
                },
            },
            Bold: {
                tooltip: '加粗',
            },
            Underline: {
                tooltip: '下划线',
            },
            Italic: {
                tooltip: '斜体',
            },
            Strike: {
                tooltip: '删除线',
            },
            Heading: {
                tooltip: '标题',
                buttons: {
                    paragraph: '段落',
                    heading: '标题',
                },
            },
            Blockquote: {
                tooltip: '引用',
            },
            CodeBlock: {
                tooltip: '代码块',
            },
            Link: {
                add: {
                    tooltip: '添加链接',
                    control: {
                        title: '添加链接',
                        href: '链接地址',
                        open_in_new_tab: '在新标签页中打开',
                        confirm: '应用',
                        cancel: '取消',
                    },
                },
                edit: {
                    tooltip: '编辑链接',
                    control: {
                        title: '编辑链接',
                        href: '链接地址',
                        open_in_new_tab: '在新标签页中打开',
                        confirm: '更新',
                        cancel: '取消',
                    },
                },
                unlink: {
                    tooltip: '取消链接',
                },
                open: {
                    tooltip: '打开链接',
                },
            },
            Image: {
                buttons: {
                    insert_image: {
                        tooltip: '插入图片',
                        external: '通过 URL 插入图片',
                        upload: '上传图片',
                    },
                    remove_image: {
                        tooltip: '移除图片',
                    },
                    image_options: {
                        tooltip: '图片选项',
                    },
                    display: {
                        tooltip: '显示',
                        inline: '行内',
                        block: '断行',
                        left: '左浮动',
                        right: '右浮动',
                    },
                },
                control: {
                    insert_by_url: {
                        title: '插入图片',
                        placeholder: '图片 URL',
                        confirm: '插入',
                        cancel: '取消',
                        invalid_url: '请输入正确的 URL',
                    },
                    upload_image: {
                        title: '上传图片',
                        button: '选择一个图片文件或拖动到此处',
                    },
                    edit_image: {
                        title: '编辑图片',
                        confirm: '更新',
                        cancel: '取消',
                        form: {
                            src: '图片 URL',
                            alt: '替代文本',
                            width: '宽度',
                            height: '高度',
                        },
                    },
                },
            },
            Iframe: {
                tooltip: '插入视频',
                control: {
                    title: '插入视频',
                    placeholder: '视频链接',
                    confirm: '插入',
                    cancel: '取消',
                },
            },
            BulletList: {
                tooltip: '无序列表',
            },
            OrderedList: {
                tooltip: '有序列表',
            },
            TodoList: {
                tooltip: '待办列表',
            },
            TextAlign: {
                buttons: {
                    align_left: {
                        tooltip: '左对齐',
                    },
                    align_center: {
                        tooltip: '居中对齐',
                    },
                    align_right: {
                        tooltip: '右对齐',
                    },
                    align_justify: {
                        tooltip: '两端对齐',
                    },
                },
            },
            FontType: {
                tooltip: '字体',
            },
            FontSize: {
                tooltip: '字号',
                default: '默认',
            },
            TextColor: {
                tooltip: '文字颜色',
            },
            TextHighlight: {
                tooltip: '高亮颜色',
            },
            LineHeight: {
                tooltip: '行高',
            },
            Table: {
                tooltip: '表格',
                buttons: {
                    insert_table: '插入表格',
                    add_column_before: '在前面插入列',
                    add_column_after: '在后面插入列',
                    delete_column: '删除列',
                    add_row_before: '在上面插入行',
                    add_row_after: '在下面插入行',
                    delete_row: '删除行',
                    merge_cells: '合并单元格',
                    split_cell: '拆分单元格',
                    delete_table: '删除表格',
                },
            },
            Indent: {
                buttons: {
                    indent: {
                        tooltip: '增加缩进',
                    },
                    outdent: {
                        tooltip: '减少缩进',
                    },
                },
            },
            FormatClear: {
                tooltip: '清除格式',
            },
            HorizontalRule: {
                tooltip: '分割线',
            },
            History: {
                tooltip: {
                    undo: '撤销',
                    redo: '重做',
                },
            },
            Fullscreen: {
                tooltip: {
                    fullscreen: '全屏',
                    exit_fullscreen: '退出全屏',
                },
            },
            Print: {
                tooltip: '打印',
            },
            Preview: {
                tooltip: '预览',
                dialog: {
                    title: '预览',
                },
            },
            SelectAll: {
                tooltip: '全选',
            },
            CodeView: {
                tooltip: '代码视图',
            },
        },
        characters: '字符',
    },
}
