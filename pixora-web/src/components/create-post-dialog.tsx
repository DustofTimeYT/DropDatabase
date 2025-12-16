import {
  CloseSquare,
  Hashtag,
  LinkMinimalistic,
  PenNewSquare,
  UploadMinimalistic,
} from "@solar-icons/react"
import { type ChangeEvent, useRef, useState } from "react"

export type CreatePostDialogProps = {
  open: boolean
  onClose: () => void
}

const MAX_FILES = 10

function ImageTile({ src, onEdit }: { src: string; onEdit: () => void }) {
  return (
    <div className="relative group aspect-square rounded-xl overflow-hidden">
      <img src={src} className="w-full h-full object-cover" alt="" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <button onClick={onEdit} className="bg-white p-3 rounded-full">
          <PenNewSquare size={20} />
        </button>
      </div>
    </div>
  )
}

export default function CreatePostDialog({
  open = false,
  onClose,
}: CreatePostDialogProps) {
  const [description, setDescription] = useState("")
  const [tags] = useState(["UI", "UX", "Design"])

  const [files, setFiles] = useState<{ file: File; preview: string }[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  if (!open) {
    return null
  }

  const handleOverlayClick = (target: Node) => {
    if (dialogRef.current && !dialogRef.current.contains(target)) {
      onClose?.()
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }

    const selectedFiles = Array.from(e.target.files)
    const allowed = selectedFiles.slice(0, MAX_FILES - files.length)

    const mapped = allowed.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setFiles((prev) => [...prev, ...mapped])

    e.target.value = ""
  }

  const UploadCard = (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="w-full flex flex-col items-center justify-center rounded-xl bg-[#a7a0c6] text-[#534f7a] aspect-square cursor-pointer transition"
    >
      <UploadMinimalistic size={28} />
      <p className="text-sm mt-2">
        Uploaded {files.length} of {MAX_FILES}
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg"
        multiple
        hidden
        onChange={handleFileChange}
      />
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60"
      onMouseDown={(e) => handleOverlayClick(e.target as Node)}
    >
      <div
        ref={dialogRef}
        className="bg-[#F3F4FA] w-225 rounded-2xl p-6 relative"
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <CloseSquare size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-[#2B2E4A] mb-6">
          Create post
        </h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d6d7ed]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-[#d3d0e3] text-[#2f2c58] px-3 py-1 rounded-full text-sm"
                  >
                    <Hashtag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col">
            <div className="bg-[#d5d5e8] rounded-xl p-2">
              <div
                className={
                  files.length === 0 ? "flex" : "grid grid-cols-2 gap-3"
                }
              >
                {files.length < MAX_FILES && UploadCard}

                {files.map((item, index) => (
                  <ImageTile
                    key={item.preview}
                    src={item.preview}
                    onEdit={() => setEditingIndex(index)}
                  />
                ))}
              </div>
            </div>

            <button className="mt-4 flex items-center justify-center gap-2 bg-[#E3E4F2] text-[#2B2E4A] rounded-xl py-2 hover:bg-[#D6D7ED]">
              <LinkMinimalistic size={18} />
              Upload from URL
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-[#6f6eae] text-white px-8 py-2 rounded-xl hover:bg-violet-700">
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}
