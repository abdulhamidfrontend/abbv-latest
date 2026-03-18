"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { X, Plus } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
})

export default function EditProductPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageUploading, setImageUploading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`)
        const data = await res.json()
        if (!res.ok) { router.push("/admin"); return }
        setForm({
          name: data.name || "",
          description: data.description || "",
          price: String(data.price || ""),
          discountPrice: String(data.discountPrice || ""),
          category: data.category || "",
          stock: String(data.stock || ""),
        })
        setImageUrls(data.images || [])
        setTags(data.tags || [])
      } catch {
        router.push("/admin")
      } finally {
        setFetching(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setImageUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => formData.append("images", file))
      const res = await fetch(`${API_URL}/upload/images`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      })
      const data = await res.json()
      if (res.ok) setImageUrls((prev) => [...prev, ...data.urls])
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.price || !form.category || !form.stock) {
      alert("Please fill in all required fields")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
          category: form.category,
          stock: Number(form.stock),
          images: imageUrls,
          tags,
        }),
      })
      if (res.ok) {
        router.push("/admin")
      } else {
        const data = await res.json()
        alert(data.message || "Failed to update product")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      })
      router.push("/admin")
    } catch {
      alert("Failed to delete product")
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-2xl px-6 py-16">
          <div className="flex flex-col gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-secondary" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl px-6 py-16">
        <div className="mb-10">
          <button
            onClick={() => router.push("/admin")}
            className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Admin
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold uppercase tracking-[0.15em] font-[family-name:var(--font-space-grotesk)]">
              Edit Product
            </h1>
            <button
              onClick={handleDelete}
              className="text-xs uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors"
            >
              Delete Product
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em]">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Classic White Tee"
              className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em]">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description..."
              rows={4}
              className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none resize-none"
            />
          </div>

          {/* Price + Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em]">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em]">Discount Price ($)</label>
              <input
                name="discountPrice"
                type="number"
                min="0"
                step="0.01"
                value={form.discountPrice}
                onChange={handleChange}
                placeholder="Optional"
                className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Category + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em]">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. T-Shirts"
                className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em]">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="border border-border bg-transparent px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.2em]">Images</label>
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative h-24 w-24 border border-border">
                    <img
                      src={url.startsWith("http") ? url : `http://localhost:5000${url}`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-foreground text-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-3 border border-dashed border-border px-4 py-4 transition-colors hover:border-foreground">
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {imageUploading ? "Uploading..." : "Click to upload images"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em]">Tags</label>
            <div className="flex flex-wrap gap-2 border border-border px-4 py-3">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-secondary px-2 py-1 text-xs">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type and press Enter..."
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none min-w-[120px]"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="flex-1 border border-border py-4 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}