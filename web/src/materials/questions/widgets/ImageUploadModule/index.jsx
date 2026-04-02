import { defineComponent, ref, computed } from 'vue'
import './style.scss'
import myMeta from './meta'

export const meta = myMeta

const ALLOWED_TYPES = ['image/bmp', 'image/jpeg', 'image/png', 'image/tiff', 'image/gif', 'image/heic']
const ALLOWED_EXT = /\.(bmp|jpg|jpeg|png|tif|tiff|gif|heic)$/i

export default defineComponent({
  name: 'ImageUploadModule',
  props: {
    field: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    moduleConfig: {
      type: Object,
      default: () => ({})
    },
    maxImageCount: {
      type: Number,
      default: 5
    },
    maxFileSize: {
      type: Number,
      default: 100
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const uploadedUrls = ref(Array.isArray(props.value) ? [...props.value] : [])
    const uploading = ref(false)
    const errorMsg = ref('')

    const maxCount = computed(() => {
      return props.moduleConfig?.maxImageCount ?? props.maxImageCount ?? 5
    })
    const maxSize = computed(() => {
      return props.moduleConfig?.maxFileSize ?? props.maxFileSize ?? 100
    })

    const showUploadBtn = computed(() => {
      return uploadedUrls.value.length < maxCount.value
    })

    const triggerFileInput = () => {
      if (uploading.value) return
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.accept = '.bmp,.jpg,.jpeg,.png,.tif,.tiff,.gif,.heic'
      input.onchange = handleFileChange
      input.click()
    }

    const handleFileChange = async (e) => {
      const files = Array.from(e.target.files || [])
      if (!files.length) return
      errorMsg.value = ''

      const remaining = maxCount.value - uploadedUrls.value.length
      const filesToUpload = files.slice(0, remaining)

      if (files.length > remaining) {
        errorMsg.value = `最多还能上传 ${remaining} 张，已自动截取前 ${remaining} 张`
      }

      for (const file of filesToUpload) {
        // 格式校验
        if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.test(file.name)) {
          errorMsg.value = `文件 ${file.name} 格式不支持，请上传 BMP/JPG/PNG/TIF/GIF/HEIC 格式图片`
          continue
        }
        // 大小校验
        if (file.size / 1024 / 1024 > maxSize.value) {
          errorMsg.value = `文件 ${file.name} 超过大小限制（${maxSize.value}MB）`
          continue
        }

        uploading.value = true
        try {
          const url = await uploadFile(file)
          if (url) {
            uploadedUrls.value = [...uploadedUrls.value, url]
            emit('change', {
              key: props.field,
              value: uploadedUrls.value
            })
          }
        } catch (err) {
          errorMsg.value = `上传失败：${err.message || '请重试'}`
        } finally {
          uploading.value = false
        }
      }
    }

    const uploadFile = async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('channel', 'upload')

      const response = await fetch('/api/file/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      if (result?.code === 200 && result?.data?.url) {
        return result.data.url
      }
      throw new Error(result?.errmsg || '上传失败')
    }

    const removeImage = (index) => {
      const newUrls = uploadedUrls.value.filter((_, i) => i !== index)
      uploadedUrls.value = newUrls
      emit('change', {
        key: props.field,
        value: uploadedUrls.value
      })
    }

    return {
      uploadedUrls,
      uploading,
      errorMsg,
      maxCount,
      maxSize,
      showUploadBtn,
      triggerFileInput,
      removeImage
    }
  },
  render() {
    const { uploadedUrls, uploading, errorMsg, maxCount, showUploadBtn } = this

    if (this.readonly) {
      return (
        <div class="image-upload-module image-upload-module--readonly">
          <div class="image-upload-placeholder">
            <span class="image-upload-placeholder__icon">&#128247;</span>
            <span class="image-upload-placeholder__text">图片上传区域（最多 {maxCount} 张）</span>
          </div>
        </div>
      )
    }

    return (
      <div class="image-upload-module">
        <div class="image-upload-gallery">
          {uploadedUrls.map((url, index) => (
            <div key={index} class="image-upload-thumb">
              <img src={url} alt={`图片${index + 1}`} />
              <button
                class="image-upload-thumb__delete"
                type="button"
                onClick={() => this.removeImage(index)}
                aria-label="删除图片"
              >
                &times;
              </button>
            </div>
          ))}
          {showUploadBtn && (
            <div
              class={['image-upload-btn', uploading ? 'image-upload-btn--loading' : '']}
              onClick={this.triggerFileInput}
            >
              {uploading ? (
                <span class="image-upload-btn__text">上传中...</span>
              ) : (
                <span class="image-upload-btn__text">
                  <span class="image-upload-btn__icon">+</span>
                  <span>上传图片</span>
                </span>
              )}
            </div>
          )}
        </div>
        <div class="image-upload-hint">
          最多上传 {maxCount} 张，已上传 {uploadedUrls.length} 张
        </div>
        {errorMsg && (
          <div class="image-upload-error">{errorMsg}</div>
        )}
      </div>
    )
  }
})
