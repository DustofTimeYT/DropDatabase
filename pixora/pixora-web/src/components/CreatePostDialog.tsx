import React, { useRef, useState, type KeyboardEvent } from "react"

import { useKeycloak } from "@react-keycloak/web"

export interface CreatePostDialogProps {
  readonly isOpen: boolean
  readonly onCreate: (req: CreatePostRequest) => void
  readonly onClose: () => void
}

export interface CreatePostRequest {
  readonly description: string
  readonly photos: File[]
  readonly tags: string[]
}

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
)

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
)

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({
  isOpen,
  onCreate,
  onClose,
}) => {
  const { keycloak } = useKeycloak()

  const [description, setDescription] = useState("")
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const tagInputRef = useRef<HTMLInputElement>(null)

  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setSelectedPhotos(files)

      // Create previews
      const urls = files.map((file) => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Comma", "Tab"].includes(e.key)) {
      e.preventDefault()
      addTag()
    } else if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      e.preventDefault()
      // Remove last tag when backspace is pressed and input is empty
      setTags((prev) => prev.slice(0, -1))
    }
  }

  const addTag = () => {
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    const formData = new FormData()

    formData.append("text", description)

    for (const photo of selectedPhotos) {
      formData.append("images", photo)
    }

    for (const tag of tags) {
      formData.append("tags", tag)
    }

    fetch("http://localhost:5004/v1/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: formData,
    }).then(() => {
      onCreate({
        description,
        photos: selectedPhotos,
        tags: tags,
      })
      resetForm()
      onClose()
      setIsUploading(false)
    })
  }

  const resetForm = () => {
    setDescription("")
    setSelectedPhotos([])
    setTags([])
    setTagInput("")
    setPreviewUrls([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-100 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share what's on your mind..."
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach Photos
            </label>
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
              <div className="flex flex-col items-center text-gray-400">
                <CameraIcon />
                <span className="mt-1 text-sm">Click to upload photos</span>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            {/* Photo Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
                      onClick={() => {
                        const newUrls = [...previewUrls]
                        newUrls.splice(index, 1)
                        setPreviewUrls(newUrls)

                        const newFiles = [...selectedPhotos]
                        newFiles.splice(index, 1)
                        setSelectedPhotos(newFiles)
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Tags
            </label>
            <div
              className={`flex flex-wrap items-center gap-2 min-h-[44px] border border-gray-200 rounded-lg p-2 ${
                tagInput ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => tagInputRef.current?.focus()}
            >
              {/* Tag Chips */}
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                >
                  <span className="mr-1">#{tag}</span>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTag(tag)
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}

              {/* Tag Input */}
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={
                  tags.length === 0
                    ? "Type tags (e.g. nature, vacation)..."
                    : ""
                }
                className="flex-1 min-w-[100px] outline-none bg-transparent px-1 py-1 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or comma to add tags
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isUploading ||
                (!description.trim() &&
                  selectedPhotos.length === 0 &&
                  tags.length === 0)
              }
              className={`px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center ${
                isUploading ||
                (!description.trim() &&
                  selectedPhotos.length === 0 &&
                  tags.length === 0)
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
