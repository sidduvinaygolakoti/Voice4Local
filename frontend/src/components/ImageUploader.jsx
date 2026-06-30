import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, X, ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react'

const MAX_FILES = 5
const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function ImageUploader({ images, setImages }) {
  const [uploadErrors, setUploadErrors] = useState([])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setUploadErrors([])

    // Handle rejections
    const errors = rejectedFiles.map(({ file, errors }) => ({
      name: file.name,
      reason: errors[0]?.code === 'file-too-large'
        ? `${file.name} is too large (max ${MAX_SIZE_MB}MB)`
        : `${file.name} is not a valid image`,
    }))
    setUploadErrors(errors)

    // Check max count
    const remaining = MAX_FILES - images.length
    const toAdd = acceptedFiles.slice(0, remaining)

    const newImages = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      uploaded: false,
      uploading: false,
      url: null,
    }))

    setImages(prev => [...prev, ...newImages])
  }, [images, setImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    maxSize: MAX_SIZE_BYTES,
    multiple: true,
  })

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {images.length < MAX_FILES && (
        <div
          {...getRootProps()}
          id="image-dropzone"
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary-500 bg-primary/5 scale-[1.02]'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-primary/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ y: isDragActive ? -8 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-gradient-card flex items-center justify-center"
            >
              {isDragActive ? (
                <ImageIcon size={28} className="text-primary-500" />
              ) : (
                <Upload size={28} className="text-primary-500" />
              )}
            </motion.div>
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200">
                {isDragActive ? 'Drop images here!' : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or <span className="text-primary-500 font-medium">click to browse</span>
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>JPG, PNG, WEBP</span>
              <span>•</span>
              <span>Max {MAX_SIZE_MB}MB each</span>
              <span>•</span>
              <span>Up to {MAX_FILES} images</span>
            </div>
          </div>

          {/* Camera option for mobile */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:bg-white/20 transition-all w-fit mx-auto">
              <Camera size={16} />
              Take Photo
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file && images.length < MAX_FILES) {
                    const newImg = {
                      file,
                      preview: URL.createObjectURL(file),
                      name: file.name,
                      size: file.size,
                      uploaded: false,
                      uploading: false,
                      url: null,
                    }
                    setImages(prev => [...prev, newImg])
                  }
                }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Errors */}
      <AnimatePresence>
        {uploadErrors.map((err, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600"
          >
            <AlertCircle size={15} />
            {err.reason}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {images.map((img, index) => (
              <motion.div
                key={img.preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group rounded-xl overflow-hidden border border-white/20 bg-black/10 aspect-square"
              >
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                  <button
                    id={`remove-image-${index}`}
                    onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center transition-all transform scale-75 group-hover:scale-100"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Status indicator */}
                <div className="absolute bottom-2 left-2 right-2">
                  {img.uploading && (
                    <div className="h-1 rounded-full bg-white/30 overflow-hidden">
                      <motion.div
                        className="h-full bg-primary-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                  )}
                  {img.uploaded && (
                    <div className="flex items-center gap-1 bg-trust-500 text-white text-xs px-2 py-0.5 rounded-full w-fit">
                      <CheckCircle2 size={10} /> Uploaded
                    </div>
                  )}
                </div>

                {/* File size */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md">
                  {formatBytes(img.size)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Count */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 text-right">
          {images.length}/{MAX_FILES} images selected
        </p>
      )}
    </div>
  )
}
