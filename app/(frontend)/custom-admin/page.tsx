"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Newspaper, FolderHeart, Tag as TagIcon, Music, 
  Plus, Edit2, Trash2, Search, ArrowLeft, Eye, EyeOff, Check, X,
  Upload, User, Bold, List, Code, Image as ImageIcon, Link as LinkIcon
} from "lucide-react";
import Link from "next/link";

interface MediaUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept: string;
  placeholder?: string;
  previewType: "image" | "audio";
}

function MediaUploader({ label, value, onChange, accept, placeholder, previewType }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          onChange(data.url);
        }
      } else {
        alert("Gagal mengunggah berkas.");
      }
    } catch (err) {
      console.error(err);
      alert("Error mengunggah berkas.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">
        {label}
      </label>
      
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-3 border-dashed rounded-lg p-4 text-center transition-all relative flex flex-col items-center justify-center gap-2 select-none cursor-pointer ${
          isDragOver 
            ? "border-yellow bg-yellow/10 animate-pulse" 
            : "border-black dark:border-cream/20 bg-cream/40 dark:bg-dark-bg/40 hover:bg-cream-dark dark:hover:bg-dark-bg/60"
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <div className="h-5 w-5 border-2 border-black border-t-yellow rounded-full animate-spin"></div>
            <span className="font-mono text-[9px] font-black uppercase text-black dark:text-cream">Mengunggah...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Upload className="h-5 w-5 text-black/75 dark:text-cream/75 mb-0.5" />
            <span className="font-mono text-[9px] font-black uppercase text-black dark:text-cream">
              Drag & drop berkas atau <span className="text-coral underline">Pilih berkas</span>
            </span>
            <span className="text-[8px] text-black/45 dark:text-cream/45 font-mono">
              Format: {accept === "audio/*" ? "MP3, WAV" : "PNG, JPG, WEBP"}
            </span>
          </div>
        )}
      </div>

      {/* Manual URL input fallback & Preview */}
      <div className="flex flex-col gap-2 mt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs w-full"
          placeholder={placeholder || "https://... atau path berkas"}
        />

        {value && !uploading && (
          <div className="border-2 border-black bg-white rounded p-2 flex flex-col gap-2 select-text shrink-0 text-black">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] font-black uppercase text-black/60">PRATINJAU MEDIA:</span>
              <button 
                type="button" 
                onClick={() => onChange("")} 
                className="font-mono text-[8px] font-black text-coral uppercase hover:underline shrink-0"
              >
                Hapus
              </button>
            </div>
            {previewType === "image" && (
              <div className="h-28 w-full border border-black/10 rounded overflow-hidden bg-cream-dark flex items-center justify-center">
                <img src={value} alt="Preview" className="h-full w-full object-cover" onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }} />
              </div>
            )}
            {previewType === "audio" && (
              <div className="w-full">
                <audio src={value} controls className="w-full h-8" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readingTime: number;
  featured: boolean;
  categoryId: string;
  category?: { name: string };
  tags?: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl?: string;
  duration?: number;
}

export default function AdminCMSPage() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"dashboard" | "posts" | "categories" | "tags" | "tracks" | "author">("dashboard");

  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);

  // Search queries
  const [searchQuery, setSearchQuery] = useState("");

  // Loading & Alert feedback states
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Authentication states
  const [sessionUser, setSessionUser] = useState<{ id: string; name: string; email: string; avatar: string } | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (stored) {
      try {
        setSessionUser(JSON.parse(stored));
      } catch (err) {
        localStorage.removeItem("admin_session");
      }
    }
    setSessionLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("admin_session", JSON.stringify(data.user));
        setSessionUser(data.user);
        triggerAlert("success", `Selamat datang kembali, ${data.user.name}!`);
      } else {
        triggerAlert("error", data.error || "Login gagal.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal memproses login.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setSessionUser(null);
    triggerAlert("success", "Anda telah keluar dari CMS Panel.");
  };

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Post form state
  const [postForm, setPostForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    categoryId: "",
    readingTime: 5,
    featured: false,
    selectedTagIds: [] as string[],
  });
  const [markdownPreview, setMarkdownPreview] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + (selected || "") + after;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setPostForm(prev => ({ ...prev, content: newContent }));

    // Focus and select back
    setTimeout(() => {
      textarea.focus();
      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + (selected ? selected.length : 0);
      textarea.setSelectionRange(selectionEnd, selectionEnd);
    }, 0);
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          const altText = prompt("Masukkan keterangan gambar (alt text):") || "Deskripsi Gambar";
          insertMarkdown(`\n![${altText}](${data.url})\n`);
          triggerAlert("success", "Gambar berhasil diunggah dan disisipkan!");
        } else {
          triggerAlert("error", "Gagal mengunggah gambar.");
        }
      } else {
        triggerAlert("error", "Gagal mengunggah gambar.");
      }
    } catch (err) {
      console.error(err);
      triggerAlert("error", "Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setImageUploading(false);
      e.target.value = "";
    }
  };

  const handleInsertImageUrl = () => {
    const url = prompt("Masukkan URL Gambar:");
    if (!url) return;
    const alt = prompt("Masukkan keterangan gambar (alt text) - opsional:") || "Keterangan Gambar";
    insertMarkdown(`\n![${alt}](${url})\n`);
    triggerAlert("success", "Gambar berhasil disisipkan!");
  };

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#0A0A0A",
    bgColor: "#FFE500",
    icon: "BookOpen",
  });

  // Tag form state
  const [tagForm, setTagForm] = useState({
    name: "",
    slug: "",
    color: "#7B2FBE",
  });

  // Track form state
  const [trackForm, setTrackForm] = useState({
    title: "",
    artist: "",
    audioUrl: "",
    coverUrl: "",
    duration: 300,
  });

  // Author profile form state
  const [authorForm, setAuthorForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    avatar: "",
    bio: "",
    twitter: "",
    github: "",
    linkedin: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authorSubmitLoading, setAuthorSubmitLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    if (!sessionUser) return;
    const authorId = sessionUser.id;
    async function loadData() {
      try {
        const [postsRes, catsRes, tagsRes, tracksRes, authorRes] = await Promise.all([
          fetch("/api/admin/posts"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/tags"),
          fetch("/api/admin/tracks"),
          fetch(`/api/admin/author?id=${authorId}`),
        ]);

        if (postsRes.ok) setPosts(await postsRes.json());
        if (catsRes.ok) setCategories(await catsRes.json());
        if (tagsRes.ok) setTags(await tagsRes.json());
        if (tracksRes.ok) setTracks(await tracksRes.json());
        if (authorRes.ok) {
          const authData = await authorRes.json();
          setAuthorForm({
            id: authData.id || "",
            name: authData.name || "",
            email: authData.email || "",
            password: authData.password || "",
            avatar: authData.avatar || "",
            bio: authData.bio || "",
            twitter: authData.twitter || "",
            github: authData.github || "",
            linkedin: authData.linkedin || "",
          });
        }
      } catch (err) {
        console.error("Failed to load CMS data:", err);
        triggerAlert("error", "Gagal memuat data dari basis data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionUser]);

  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Auto-generate slugs helper
  const handleAutoSlug = (title: string, type: "post" | "category" | "tag") => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (type === "post") setPostForm(prev => ({ ...prev, slug }));
    if (type === "category") setCategoryForm(prev => ({ ...prev, slug }));
    if (type === "tag") setTagForm(prev => ({ ...prev, slug }));
  };

  // --- CRUD FUNCTIONS: POSTS ---
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.categoryId) {
      triggerAlert("error", "Harap pilih Kategori!");
      return;
    }

    try {
      const url = editingId ? `/api/admin/posts/${editingId}` : "/api/admin/posts";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...postForm,
          tags: postForm.selectedTagIds,
        }),
      });

      if (res.ok) {
        const savedPost = await res.json();
        if (editingId) {
          setPosts(prev => prev.map(p => p.id === editingId ? savedPost : p));
          triggerAlert("success", "Artikel berhasil diperbarui!");
        } else {
          setPosts(prev => [savedPost, ...prev]);
          triggerAlert("success", "Artikel baru berhasil ditambahkan!");
        }
        resetPostForm();
      } else {
        const err = await res.json();
        triggerAlert("error", err.error || "Gagal menyimpan artikel.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menyimpan artikel.");
    }
  };

  const handlePostEdit = (post: Post) => {
    setEditingId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      categoryId: post.categoryId,
      readingTime: post.readingTime,
      featured: post.featured,
      selectedTagIds: post.tags?.map(t => t.id) || [],
    });
  };

  const handlePostDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
        triggerAlert("success", "Artikel berhasil dihapus!");
      } else {
        triggerAlert("error", "Gagal menghapus artikel.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menghapus artikel.");
    }
  };

  const resetPostForm = () => {
    setEditingId(null);
    setPostForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      categoryId: "",
      readingTime: 5,
      featured: false,
      selectedTagIds: [],
    });
    setMarkdownPreview(false);
  };

  // --- CRUD FUNCTIONS: CATEGORIES ---
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        const savedCat = await res.json();
        if (editingId) {
          setCategories(prev => prev.map(c => c.id === editingId ? savedCat : c));
          triggerAlert("success", "Kategori berhasil diperbarui!");
        } else {
          setCategories(prev => [...prev, savedCat]);
          triggerAlert("success", "Kategori berhasil ditambahkan!");
        }
        resetCategoryForm();
      } else {
        triggerAlert("error", "Gagal menyimpan kategori.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menyimpan kategori.");
    }
  };

  const handleCategoryEdit = (cat: Category) => {
    setEditingId(cat.id);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      color: cat.color,
      bgColor: cat.bgColor,
      icon: cat.icon,
    });
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm("Menghapus Kategori juga akan menghapus/memutuskan artikel yang terkait. Anda yakin?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        triggerAlert("success", "Kategori berhasil dihapus!");
      } else {
        triggerAlert("error", "Gagal menghapus kategori.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menghapus kategori.");
    }
  };

  const resetCategoryForm = () => {
    setEditingId(null);
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      color: "#0A0A0A",
      bgColor: "#FFE500",
      icon: "BookOpen",
    });
  };

  // --- CRUD FUNCTIONS: TAGS ---
  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/tags/${editingId}` : "/api/admin/tags";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagForm),
      });

      if (res.ok) {
        const savedTag = await res.json();
        if (editingId) {
          setTags(prev => prev.map(t => t.id === editingId ? savedTag : t));
          triggerAlert("success", "Tag berhasil diperbarui!");
        } else {
          setTags(prev => [...prev, savedTag]);
          triggerAlert("success", "Tag berhasil ditambahkan!");
        }
        resetTagForm();
      } else {
        triggerAlert("error", "Gagal menyimpan tag.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menyimpan tag.");
    }
  };

  const handleTagEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setTagForm({
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
    });
  };

  const handleTagDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tag ini?")) return;
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTags(prev => prev.filter(t => t.id !== id));
        triggerAlert("success", "Tag berhasil dihapus!");
      } else {
        triggerAlert("error", "Gagal menghapus tag.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menghapus tag.");
    }
  };

  const resetTagForm = () => {
    setEditingId(null);
    setTagForm({
      name: "",
      slug: "",
      color: "#7B2FBE",
    });
  };

  // --- CRUD FUNCTIONS: MUSIC TRACKS ---
  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/tracks/${editingId}` : "/api/admin/tracks";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackForm),
      });

      if (res.ok) {
        const savedTrack = await res.json();
        if (editingId) {
          setTracks(prev => prev.map(t => t.id === editingId ? savedTrack : t));
          triggerAlert("success", "Lagu berhasil diperbarui!");
        } else {
          setTracks(prev => [...prev, savedTrack]);
          triggerAlert("success", "Lagu baru berhasil ditambahkan!");
        }
        resetTrackForm();
      } else {
        triggerAlert("error", "Gagal menyimpan lagu.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menyimpan lagu.");
    }
  };

  const handleTrackEdit = (track: Track) => {
    setEditingId(track.id);
    setTrackForm({
      title: track.title,
      artist: track.artist,
      audioUrl: track.audioUrl,
      coverUrl: track.coverUrl || "",
      duration: track.duration || 300,
    });
  };

  const handleTrackDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus lagu ini dari playlist?")) return;
    try {
      const res = await fetch(`/api/admin/tracks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTracks(prev => prev.filter(t => t.id !== id));
        triggerAlert("success", "Lagu berhasil dihapus!");
      } else {
        triggerAlert("error", "Gagal menghapus lagu.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal menghapus lagu.");
    }
  };

  const resetTrackForm = () => {
    setEditingId(null);
    setTrackForm({
      title: "",
      artist: "",
      audioUrl: "",
      coverUrl: "",
      duration: 300,
    });
  };

  // --- CRUD FUNCTIONS: AUTHOR PROFILE ---
  const handleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthorSubmitLoading(true);
    try {
      const res = await fetch("/api/admin/author", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authorForm),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user && sessionUser) {
          // Update local storage and session user states
          const updatedUser = {
            id: sessionUser.id,
            name: data.user.name as string,
            email: data.user.email as string,
            avatar: data.user.avatar as string,
          };
          localStorage.setItem("admin_session", JSON.stringify(updatedUser));
          setSessionUser(updatedUser);
          triggerAlert("success", "Profil Penulis berhasil diperbarui!");
        }
      } else {
        const err = await res.json();
        triggerAlert("error", err.error || "Gagal memperbarui profil penulis.");
      }
    } catch (err) {
      triggerAlert("error", "Gagal memperbarui profil penulis.");
    } finally {
      setAuthorSubmitLoading(false);
    }
  };

  // Filter dynamic listings based on search inputs
  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTags = tags.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTracks = tracks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render markdown parser preview helper
  const renderCmsMarkdown = (content: string) => {
    if (!content) return <p className="text-gray-400 italic">Ketik di editor untuk melihat pratinjau...</p>;
    return content.split("\n").map((line, index) => {
      if (line.startsWith("## ")) {
        return <h2 key={index} className="text-display text-xl uppercase text-black border-b border-black pb-1 my-3">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={index} className="text-display text-lg uppercase text-black my-2">{line.replace("### ", "")}</h3>;
      }
      const imageMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        const alt = imageMatch[1];
        const src = imageMatch[2];
        return (
          <div key={index} className="my-3 flex flex-col gap-1.5 select-none">
            <div className="relative w-full h-32 border-2 border-black rounded overflow-hidden bg-cream-dark">
              <img src={src} alt={alt || "Pratinjau Gambar"} className="w-full h-full object-cover" />
            </div>
            {alt && <span className="font-mono text-[9px] text-black/60 uppercase text-center font-bold">{alt}</span>}
          </div>
        );
      }
      if (line.trim() === "") return <div key={index} className="h-2" />;
      return <p key={index} className="text-sm font-semibold text-black/85 leading-relaxed mb-2">{line}</p>;
    });
  };

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f4f0] select-none">
        <div className="h-12 w-12 border-4 border-black border-t-yellow rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm font-bold text-black uppercase">MEMVERIFIKASI AKSES CMS...</p>
      </div>
    );
  }

  if (!sessionUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f4f0] px-4 font-sans select-none">
        <form onSubmit={handleLogin} className="border-4 border-black bg-white p-8 rounded-xl shadow-[8px_8px_0px_#000] max-w-md w-full flex flex-col gap-6">
          <div className="text-center border-b-4 border-black pb-4 mb-2">
            <h1 className="text-2xl font-black tracking-tight uppercase flex items-center justify-center gap-2 text-black">
              <Sparkles className="h-6 w-6 text-coral animate-bounce" />
              <span>CHRONICA CMS</span>
            </h1>
            <p className="text-xs font-bold text-black/60 uppercase mt-1">Halaman khusus Administrator</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-black uppercase text-black/60">Gmail / Email</label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="p-3 border-3 border-black rounded-lg bg-cream font-bold text-sm focus:bg-yellow/10 focus:outline-none text-black"
              placeholder="nama@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[10px] font-black uppercase text-black/60">Password</label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="p-3 border-3 border-black rounded-lg bg-cream font-bold text-sm focus:bg-yellow/10 focus:outline-none text-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3.5 border-3 border-black bg-yellow hover:bg-neon-green text-black font-black uppercase rounded-lg shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center text-sm"
          >
            {loginLoading ? "MEMASUKI CMS..." : "MASUK KE CMS PANEL →"}
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f4f0] select-none">
        <div className="h-12 w-12 border-4 border-black border-t-yellow rounded-full animate-spin"></div>
        <p className="mt-4 font-mono text-sm font-bold text-black uppercase">MEMUAT CMS DATABASES...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg text-black dark:text-cream transition-colors font-sans">
      
      {/* Alert Overlay */}
      {alert && (
        <div className={`fixed top-6 right-6 z-50 border-3 border-black p-4 rounded shadow-[4px_4px_0px_#000] font-bold text-sm text-black flex items-center gap-2 ${
          alert.type === "success" ? "bg-neon-green" : "bg-coral text-white"
        }`}>
          {alert.type === "success" ? <Check className="h-5 w-5 shrink-0" /> : <X className="h-5 w-5 shrink-0" />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="w-66 shrink-0 bg-white dark:bg-dark-surface border-r-3 border-black flex flex-col justify-between p-6 h-screen sticky top-0">
        
        {/* Brand Block */}
        <div>
          <Link href="/" className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase text-black/55 dark:text-cream/55 hover:text-black dark:hover:text-cream hover:-translate-x-0.5 transition-all mb-2">
            <ArrowLeft className="h-3 w-3" /> Kembali ke Blog
          </Link>
          <h1 className="text-display text-lg font-black uppercase flex items-center gap-2 border-b-2 border-black dark:border-cream/20 pb-3 mt-1 select-none text-black dark:text-cream">
            <Sparkles className="h-5 w-5 text-coral shrink-0" />
            <span>CHRONICA CMS</span>
          </h1>

          {/* Navigation vertical list */}
          <nav className="flex flex-col gap-2.5 mt-6">
            {[
              { id: "dashboard", label: "Dashboard", icon: Sparkles },
              { id: "posts", label: "Artikel", icon: Newspaper },
              { id: "categories", label: "Kategori", icon: FolderHeart },
              { id: "tags", label: "Tag", icon: TagIcon },
              { id: "tracks", label: "Musik MP3", icon: Music },
              { id: "author", label: "Profil Penulis", icon: User }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    resetPostForm();
                    resetCategoryForm();
                    resetTagForm();
                    resetTrackForm();
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 border-2 border-black rounded-lg text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#000] cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none select-none ${
                    isActive 
                      ? "bg-yellow text-black border-black" 
                      : "bg-white dark:bg-dark-bg text-black dark:text-cream hover:bg-yellow/10 dark:hover:bg-cream/5 border-black"
                  }`}
                >
                  <IconComponent className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sync & Profile Bottom Block */}
        <div className="flex flex-col gap-4">
          
          {/* Logged in user profile card with Logout */}
          <div className="border-t-2 border-black dark:border-cream/20 pt-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-9 w-9 border-2 border-black rounded-full overflow-hidden shrink-0">
                <img src={sessionUser.avatar} alt={sessionUser.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-mono text-[10px] font-black truncate leading-tight uppercase text-black dark:text-cream">{sessionUser.name}</h4>
                <p className="text-[9px] text-black/55 dark:text-cream/55 truncate leading-tight mt-0.5">{sessionUser.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 border-2 border-black bg-coral text-white font-mono text-[9px] font-black uppercase rounded-lg shadow-[2px_2px_0px_#000] active:translate-x-0 active:translate-y-0 active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer select-none text-xs"
            >
              KELUAR CMS
            </button>
          </div>
        </div>

      </aside>

      {/* MAIN CRUD CONTENT AREA */}
      <main className="flex-1 min-w-0 p-8 select-text overflow-y-auto max-h-screen">
        
        {/* =======================================================
            TAB 1: DASHBOARD OVERVIEW
            ======================================================= */}
        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-10">
            {/* Visual Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 select-none">
              <div className="border-3 border-black bg-coral text-white p-5 rounded-lg shadow-[6px_6px_0px_#000] flex flex-col justify-between h-36 hover:scale-102 transition-transform">
                <Newspaper className="h-8 w-8" />
                <div>
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider opacity-90">TOTAL ARTIKEL</h3>
                  <p className="text-display text-4xl mt-1">{posts.length}</p>
                </div>
              </div>
              <div className="border-3 border-black bg-yellow text-black p-5 rounded-lg shadow-[6px_6px_0px_#000] flex flex-col justify-between h-36 hover:scale-102 transition-transform">
                <FolderHeart className="h-8 w-8" />
                <div>
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider opacity-90">KATEGORI</h3>
                  <p className="text-display text-4xl mt-1">{categories.length}</p>
                </div>
              </div>
              <div className="border-3 border-black bg-purple text-white p-5 rounded-lg shadow-[6px_6px_0px_#000] flex flex-col justify-between h-36 hover:scale-102 transition-transform">
                <TagIcon className="h-8 w-8" />
                <div>
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider opacity-90">TAG TERKONEKSI</h3>
                  <p className="text-display text-4xl mt-1">{tags.length}</p>
                </div>
              </div>
              <div className="border-3 border-black bg-orange text-black p-5 rounded-lg shadow-[6px_6px_0px_#000] flex flex-col justify-between h-36 hover:scale-102 transition-transform">
                <Music className="h-8 w-8" />
                <div>
                  <h3 className="font-mono text-xs font-black uppercase tracking-wider opacity-90">PLAYLIST MUSIK</h3>
                  <p className="text-display text-4xl mt-1">{tracks.length}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="border-3 border-black bg-cream p-6 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream transition-colors">
              <h2 className="text-display text-xl sm:text-2xl uppercase text-black dark:text-cream mb-4 border-b border-black/20 dark:border-cream/20 pb-2">
                Selamat Datang di CMS Personal Anda
              </h2>
              <p className="font-semibold text-black/85 dark:text-cream/85 text-sm sm:text-base leading-relaxed max-w-3xl">
                Ini adalah pusat navigasi utama. Anda memiliki kontrol mutlak untuk menulis artikel baru tentang sejarah/filsafat, mengedit kategori topik, menghubungkan tag pemicu, maupun mengunggah MP3 musik ambient kustom. 
                <br /><br />
                Semua artikel yang Anda tulis di sini akan **langsung terhubung** secara dinamis ke halaman depan website Anda karena sistem telah disinkronisasikan langsung ke basis data lokal SQLite!
              </p>
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 2: POSTS (ARTIKEL) CRUD
            ======================================================= */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Creator Card (5 Columns) */}
            <form onSubmit={handlePostSubmit} className="lg:col-span-5 border-3 border-black bg-cream p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/25 pb-2">
                <h2 className="text-display text-lg uppercase text-black dark:text-cream font-bold">
                  {editingId ? "EDIT ARTIKEL" : "TULIS ARTIKEL BARU"}
                </h2>
                {editingId && (
                  <button type="button" onClick={resetPostForm} className="font-mono text-[9px] font-black uppercase px-2 py-1 bg-coral text-white rounded border border-black cursor-pointer">
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={postForm.title}
                  onChange={(e) => {
                    setPostForm(prev => ({ ...prev, title: e.target.value }));
                    if (!editingId) handleAutoSlug(e.target.value, "post");
                  }}
                  className="p-2 border-2 border-black rounded bg-white text-black font-bold text-sm focus:bg-yellow/10"
                  placeholder="Ketik judul artikel..."
                />
              </div>

              {/* Slug & Cover Image Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Slug (URL)</label>
                  <input
                    type="text"
                    required
                    value={postForm.slug}
                    onChange={(e) => setPostForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs"
                    placeholder="nama-slug-artikel"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Waktu Baca (Menit)</label>
                  <input
                    type="number"
                    value={postForm.readingTime}
                    onChange={(e) => setPostForm(prev => ({ ...prev, readingTime: parseInt(e.target.value) || 5 }))}
                    className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Ringkasan Pendek (Excerpt)</label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-semibold text-xs h-16 resize-none"
                  placeholder="Ketik kutipan ringkasan artikel..."
                />
              </div>

              {/* Cover Image Uploader */}
              <MediaUploader
                label="Cover Image (Gambar)"
                value={postForm.coverImage}
                onChange={(url) => setPostForm(prev => ({ ...prev, coverImage: url }))}
                accept="image/*"
                placeholder="https://... atau path gambar"
                previewType="image"
              />

              {/* Category Relational Selector */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Pilih Kategori</label>
                <select
                  required
                  value={postForm.categoryId}
                  onChange={(e) => setPostForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-bold text-xs cursor-pointer"
                >
                  <option value="">-- Pilih Topik Kategori --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Tag Multi Checkbox Selector */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60 mb-1">Hubungkan Tag</label>
                <div className="border-2 border-black bg-white rounded p-3 max-h-24 overflow-y-auto flex flex-wrap gap-2">
                  {tags.map(tag => {
                    const isSelected = postForm.selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          setPostForm(prev => ({
                            ...prev,
                            selectedTagIds: isSelected
                              ? prev.selectedTagIds.filter(id => id !== tag.id)
                              : [...prev.selectedTagIds, tag.id]
                          }));
                        }}
                        className={`font-mono text-[9px] font-black uppercase px-2 py-1 border rounded transition-all cursor-pointer ${
                          isSelected 
                            ? "bg-electric-blue text-white border-black" 
                            : "bg-cream-dark text-black border-black/15"
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Featured toggle & Submit Row */}
              <div className="flex items-center justify-between gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-[10px] font-black uppercase">
                  <input
                    type="checkbox"
                    checked={postForm.featured}
                    onChange={(e) => setPostForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="h-4 w-4 border-2 border-black accent-yellow"
                  />
                  <span>Tandai Featured</span>
                </label>

                <button type="submit" className="px-4 py-2 border-2 border-black bg-yellow hover:bg-neon-green rounded shadow-[2px_2px_0px_#000] font-mono text-[10px] font-black uppercase cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                  {editingId ? "Simpan Perubahan" : "Posting Artikel"}
                </button>
              </div>
            </form>

            {/* Markdown Editor & Previewer & List Tables (7 Columns) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Textarea Markdown Editor / Live Previewer */}
              <div className="border-3 border-black bg-white p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream transition-colors">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-cream/10 pb-2 mb-4">
                  <div className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">KONTEN ARTIKEL (EDITOR)</div>
                  
                  {/* Toggle Preview Mode Button */}
                  <button
                    type="button"
                    onClick={() => setMarkdownPreview(!markdownPreview)}
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] font-black uppercase px-2 py-1 border border-black bg-cream rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black hover:bg-yellow transition-all"
                  >
                    {markdownPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    <span>{markdownPreview ? "Tutup Pratinjau" : "Pratinjau Live"}</span>
                  </button>
                </div>

                {markdownPreview ? (
                  <div className="border-2 border-dashed border-black bg-cream p-4 rounded max-h-56 overflow-y-auto select-text">
                    {renderCmsMarkdown(postForm.content)}
                  </div>
                ) : (
                  <div className="flex flex-col w-full">
                    {/* Neo-Brutalist Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#f4f4f0] dark:bg-dark-bg border-2 border-black border-b-0 rounded-t select-none">
                      <button
                        type="button"
                        onClick={() => insertMarkdown("## ", "")}
                        className="p-1 px-2 border border-black rounded bg-white dark:bg-dark-surface hover:bg-yellow text-[10px] font-mono font-black text-black dark:text-cream hover:text-black cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        title="Heading 2 (##)"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("### ", "")}
                        className="p-1 px-2 border border-black rounded bg-white dark:bg-dark-surface hover:bg-yellow text-[10px] font-mono font-black text-black dark:text-cream hover:text-black cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        title="Heading 3 (###)"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("**", "**")}
                        className="p-1 border border-black rounded bg-white dark:bg-dark-surface hover:bg-yellow text-black dark:text-cream hover:text-black cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        title="Tebalkan Teks (**)"
                      >
                        <Bold className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("- ", "")}
                        className="p-1 border border-black rounded bg-white dark:bg-dark-surface hover:bg-yellow text-black dark:text-cream hover:text-black cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        title="Daftar List (- )"
                      >
                        <List className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown("```\n", "\n```")}
                        className="p-1 border border-black rounded bg-white dark:bg-dark-surface hover:bg-yellow text-black dark:text-cream hover:text-black cursor-pointer shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        title="Blok Kode (```)"
                      >
                        <Code className="h-3.5 w-3.5" />
                      </button>

                      <span className="w-px h-5 bg-black/20 dark:bg-cream/20 mx-1 shrink-0" />

                      {/* Image Upload Button */}
                      <div className="relative">
                        <button
                          type="button"
                          disabled={imageUploading}
                          className="p-1 px-2 border-2 border-black rounded bg-yellow hover:bg-neon-green disabled:bg-gray-300 disabled:cursor-not-allowed text-[9px] font-mono font-black uppercase text-black cursor-pointer flex items-center gap-1 shadow-[1.5px_1.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                          title="Unggah & Sisipkan Gambar Baru"
                        >
                          <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                          <span>{imageUploading ? "Mengunggah..." : "📷 Unggah Gambar"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleContentImageUpload}
                            disabled={imageUploading}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                        </button>
                      </div>

                      {/* Image URL Button */}
                      <button
                        type="button"
                        onClick={handleInsertImageUrl}
                        className="p-1 px-2 border-2 border-black rounded bg-white dark:bg-dark-surface hover:bg-yellow text-[9px] font-mono font-black uppercase text-black dark:text-cream hover:text-black cursor-pointer flex items-center gap-1 shadow-[1.5px_1.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        title="Sisipkan Gambar dari URL Internet"
                      >
                        <LinkIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>🔗 Gambar via URL</span>
                      </button>
                    </div>

                    <textarea
                      required
                      ref={textareaRef}
                      value={postForm.content}
                      onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full border-2 border-black bg-cream-dark p-3 rounded-b rounded-t-none font-mono text-xs h-56 placeholder-black/55 text-black"
                      placeholder="## Judul Sub-bagian&#10;Ketik konten artikel di sini menggunakan Markdown...&#10;&#10;### Judul Lebih Kecil&#10;Teks isi paragraf."
                    />
                  </div>
                )}
              </div>

              {/* Searchable Listing Table */}
              <div className="border-3 border-black bg-white p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-black/10 dark:border-cream/10">
                  <div className="font-mono text-xs font-black uppercase tracking-wide">Daftar Artikel ({posts.length})</div>
                  
                  {/* Search Bar */}
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      placeholder="Cari artikel..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-1.5 pl-8 border-2 border-black rounded font-mono text-[10px] font-bold text-black"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/55" />
                  </div>
                </div>

                {filteredPosts.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto scrollbar-thin flex flex-col gap-3">
                    {filteredPosts.map(post => (
                      <div key={post.id} className="border-2 border-black bg-cream rounded-md p-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h4 className="font-black text-sm text-black truncate">{post.title}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="font-mono text-[8px] font-black uppercase px-1.5 py-0.5 border border-black bg-yellow rounded select-none text-black">
                              {post.category?.name || "No Category"}
                            </span>
                            {post.featured && (
                              <span className="font-mono text-[8px] font-black uppercase px-1.5 py-0.5 border border-black bg-coral text-white rounded select-none">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handlePostEdit(post)}
                            className="p-1.5 border-2 border-black bg-white hover:bg-yellow rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black"
                            title="Edit Artikel"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handlePostDelete(post.id)}
                            className="p-1.5 border-2 border-black bg-white hover:bg-coral hover:text-white rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-black/60 italic text-center py-6">Artikel tidak ditemukan.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* =======================================================
            TAB 3: CATEGORIES (KATEGORI) CRUD
            ======================================================= */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Creator Card (5 Columns) */}
            <form onSubmit={handleCategorySubmit} className="lg:col-span-5 border-3 border-black bg-cream p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/25 pb-2">
                <h2 className="text-display text-lg uppercase text-black dark:text-cream font-bold">
                  {editingId ? "EDIT KATEGORI" : "TAMBAH KATEGORI BARU"}
                </h2>
                {editingId && (
                  <button type="button" onClick={resetCategoryForm} className="font-mono text-[9px] font-black uppercase px-2 py-1 bg-coral text-white rounded border border-black cursor-pointer">
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => {
                    setCategoryForm(prev => ({ ...prev, name: e.target.value }));
                    if (!editingId) handleAutoSlug(e.target.value, "category");
                  }}
                  className="p-2 border-2 border-black rounded bg-white text-black font-bold text-sm focus:bg-yellow/10"
                  placeholder="Sejarah, Politik, dll..."
                />
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs"
                  placeholder="slug-kategori"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Deskripsi Kategori</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-semibold text-xs h-20 resize-none"
                  placeholder="Deskripsi singkat topik ini..."
                />
              </div>

              {/* Color Customizers Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[8px] font-black uppercase text-black/60">Text Color</label>
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-8 border-2 border-black rounded cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[8px] font-black uppercase text-black/60">Bg Color</label>
                  <input
                    type="color"
                    value={categoryForm.bgColor}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="w-full h-8 border-2 border-black rounded cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[8px] font-black uppercase text-black/60">Icon (Lucide)</label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="h-8 border-2 border-black rounded font-mono text-[9px] font-bold cursor-pointer"
                  >
                    <option value="BookOpen">BookOpen</option>
                    <option value="Globe">Globe</option>
                    <option value="PenTool">PenTool</option>
                    <option value="Compass">Compass</option>
                    <option value="Sparkles">Sparkles</option>
                    <option value="Users">Users</option>
                  </select>
                </div>
              </div>

              {/* Submit Row */}
              <button type="submit" className="w-full mt-2 py-2.5 border-2 border-black bg-neon-green hover:bg-yellow rounded shadow-[3px_3px_0px_#000] font-mono text-[10px] font-black uppercase cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-black">
                {editingId ? "Simpan Perubahan Kategori" : "Buat Kategori"}
              </button>
            </form>

            {/* List Table (7 Columns) */}
            <div className="lg:col-span-7 border-3 border-black bg-white p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-black/10 dark:border-cream/10">
                <div className="font-mono text-xs font-black uppercase tracking-wide">Daftar Kategori ({categories.length})</div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Cari kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-1.5 pl-8 border-2 border-black rounded font-mono text-[10px] font-bold text-black"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/55" />
                </div>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="max-h-96 overflow-y-auto scrollbar-thin flex flex-col gap-3">
                  {filteredCategories.map(cat => (
                    <div key={cat.id} className="border-2 border-black bg-cream rounded-md p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-4 w-4 border border-black rounded-full"
                            style={{ backgroundColor: cat.bgColor }}
                          />
                          <h4 className="font-black text-sm text-black uppercase tracking-wide">{cat.name}</h4>
                        </div>
                        <p className="text-xs text-black/70 font-semibold mt-1 max-w-md">{cat.description}</p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCategoryEdit(cat)}
                          className="p-1.5 border-2 border-black bg-white hover:bg-yellow rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleCategoryDelete(cat.id)}
                          className="p-1.5 border-2 border-black bg-white hover:bg-coral hover:text-white rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-black/60 italic text-center py-6">Kategori tidak ditemukan.</p>
              )}
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 4: TAGS (TAG) CRUD
            ======================================================= */}
        {activeTab === "tags" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Creator Card (5 Columns) */}
            <form onSubmit={handleTagSubmit} className="lg:col-span-5 border-3 border-black bg-cream p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/25 pb-2">
                <h2 className="text-display text-lg uppercase text-black dark:text-cream font-bold">
                  {editingId ? "EDIT TAG" : "TAMBAH TAG BARU"}
                </h2>
                {editingId && (
                  <button type="button" onClick={resetTagForm} className="font-mono text-[9px] font-black uppercase px-2 py-1 bg-coral text-white rounded border border-black cursor-pointer">
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Nama Tag</label>
                <input
                  type="text"
                  required
                  value={tagForm.name}
                  onChange={(e) => {
                    setTagForm(prev => ({ ...prev, name: e.target.value }));
                    if (!editingId) handleAutoSlug(e.target.value, "tag");
                  }}
                  className="p-2 border-2 border-black rounded bg-white text-black font-bold text-sm focus:bg-yellow/10"
                  placeholder="Geopolitics, Stoicism..."
                />
              </div>

              {/* Slug */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={tagForm.slug}
                  onChange={(e) => setTagForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs"
                  placeholder="slug-tag"
                />
              </div>

              {/* Color Customizer */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Warna Tag</label>
                <input
                  type="color"
                  value={tagForm.color}
                  onChange={(e) => setTagForm(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-10 border-2 border-black rounded cursor-pointer bg-white"
                />
              </div>

              {/* Submit Row */}
              <button type="submit" className="w-full mt-2 py-2.5 border-2 border-black bg-purple hover:bg-yellow text-white hover:text-black rounded shadow-[3px_3px_0px_#000] font-mono text-[10px] font-black uppercase cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                {editingId ? "Simpan Perubahan Tag" : "Buat Tag"}
              </button>
            </form>

            {/* List Table (7 Columns) */}
            <div className="lg:col-span-7 border-3 border-black bg-white p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-black/10 dark:border-cream/10">
                <div className="font-mono text-xs font-black uppercase tracking-wide">Daftar Tag ({tags.length})</div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Cari tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-1.5 pl-8 border-2 border-black rounded font-mono text-[10px] font-bold text-black"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/55" />
                </div>
              </div>

              {filteredTags.length > 0 ? (
                <div className="flex flex-wrap gap-3 max-h-[350px] overflow-y-auto p-1 scrollbar-thin">
                  {filteredTags.map(tag => (
                    <div 
                      key={tag.id} 
                      className="border-2 border-black bg-cream p-3 rounded-md flex items-center gap-4 shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 transition-transform"
                    >
                      <span 
                        className="font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black rounded text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTagEdit(tag)}
                          className="p-1 border border-black bg-white hover:bg-yellow rounded text-black cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleTagDelete(tag.id)}
                          className="p-1 border border-black bg-white hover:bg-coral hover:text-white rounded text-black cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-black/60 italic text-center py-6">Tag tidak ditemukan.</p>
              )}
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 5: TRACKS (DAFTAR LAGU) CRUD
            ======================================================= */}
        {activeTab === "tracks" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Creator Card (5 Columns) */}
            <form onSubmit={handleTrackSubmit} className="lg:col-span-5 border-3 border-black bg-cream p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-black/25 pb-2">
                <h2 className="text-display text-lg uppercase text-black dark:text-cream font-bold">
                  {editingId ? "EDIT LAGU MP3" : "TAMBAH LAGU MP3 BARU"}
                </h2>
                {editingId && (
                  <button type="button" onClick={resetTrackForm} className="font-mono text-[9px] font-black uppercase px-2 py-1 bg-coral text-white rounded border border-black cursor-pointer">
                    Batal Edit
                  </button>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Judul Lagu</label>
                <input
                  type="text"
                  required
                  value={trackForm.title}
                  onChange={(e) => setTrackForm(prev => ({ ...prev, title: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-bold text-sm focus:bg-yellow/10"
                  placeholder="Ketik judul lagu..."
                />
              </div>

              {/* Artist */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Nama Artis/Komposer</label>
                <input
                  type="text"
                  required
                  value={trackForm.artist}
                  onChange={(e) => setTrackForm(prev => ({ ...prev, artist: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-semibold text-sm"
                  placeholder="Nama artis..."
                />
              </div>

              {/* Audio MP3 Uploader */}
              <MediaUploader
                label="File MP3 (Audio)"
                value={trackForm.audioUrl}
                onChange={(url) => setTrackForm(prev => ({ ...prev, audioUrl: url }))}
                accept="audio/*"
                placeholder="https://... atau path file audio"
                previewType="audio"
              />

              {/* Cover Art Uploader */}
              <MediaUploader
                label="Cover Art (Gambar)"
                value={trackForm.coverUrl}
                onChange={(url) => setTrackForm(prev => ({ ...prev, coverUrl: url }))}
                accept="image/*"
                placeholder="https://... atau path cover"
                previewType="image"
              />

              {/* Duration Field */}
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] font-black uppercase text-black/60">Durasi (Detik)</label>
                <input
                  type="number"
                  value={trackForm.duration}
                  onChange={(e) => setTrackForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 300 }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs"
                />
              </div>

              {/* Submit Row */}
              <button type="submit" className="w-full mt-2 py-2.5 border-2 border-black bg-orange hover:bg-yellow rounded shadow-[3px_3px_0px_#000] font-mono text-[10px] font-black uppercase cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-black">
                {editingId ? "Simpan Perubahan Lagu" : "Tambahkan ke Playlist"}
              </button>
            </form>

            {/* List Table (7 Columns) */}
            <div className="lg:col-span-7 border-3 border-black bg-white p-5 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-black/10 dark:border-cream/10">
                <div className="font-mono text-xs font-black uppercase tracking-wide">Daftar Putar Lagu ({tracks.length})</div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Cari lagu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-1.5 pl-8 border-2 border-black rounded font-mono text-[10px] font-bold text-black"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/55" />
                </div>
              </div>

              {filteredTracks.length > 0 ? (
                <div className="max-h-96 overflow-y-auto scrollbar-thin flex flex-col gap-3">
                  {filteredTracks.map(track => (
                    <div key={track.id} className="border-2 border-black bg-cream rounded-md p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Compact Cover */}
                        <div className="h-10 w-10 border border-black bg-yellow rounded overflow-hidden shrink-0 flex items-center justify-center">
                          {track.coverUrl ? (
                            <img src={track.coverUrl} alt={track.title} className="h-full w-full object-cover" />
                          ) : (
                            <Music className="h-5 w-5 text-black" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-sm text-black truncate leading-tight">{track.title}</h4>
                          <span className="font-mono text-[9px] font-bold text-electric-blue uppercase mt-0.5 block truncate">
                            {track.artist}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleTrackEdit(track)}
                          className="p-1.5 border-2 border-black bg-white hover:bg-yellow rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleTrackDelete(track.id)}
                          className="p-1.5 border-2 border-black bg-white hover:bg-coral hover:text-white rounded shadow-[1px_1px_0px_#000] cursor-pointer text-black"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-black/60 italic text-center py-6">Lagu tidak ditemukan.</p>
              )}
            </div>
          </div>
        )}

        {/* =======================================================
            TAB 6: AUTHOR PROFILE MANAGEMENT
            ======================================================= */}
        {activeTab === "author" && (
          <form onSubmit={handleAuthorSubmit} className="max-w-3xl border-3 border-black bg-cream p-6 rounded-lg shadow-[6px_6px_0px_#000] dark:bg-dark-surface dark:border-cream flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-black/25 pb-2">
              <h2 className="text-display text-xl uppercase text-black dark:text-cream font-bold">
                PROFIL PENULIS (AUTHOR)
              </h2>
            </div>

            {/* Nama Lengkap & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={authorForm.name}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, name: e.target.value }))}
                  className="p-2.5 border-2 border-black rounded bg-white text-black font-bold text-sm focus:bg-yellow/10 focus:outline-none"
                  placeholder="Ketik nama lengkap..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={authorForm.email}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, email: e.target.value }))}
                  className="p-2.5 border-2 border-black rounded bg-white text-black font-semibold text-sm focus:bg-yellow/10 focus:outline-none"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Password with visibility toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Kata Sandi (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={authorForm.password}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-2.5 border-2 border-black rounded bg-white text-black font-mono text-sm focus:bg-yellow/10 focus:outline-none pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Avatar Uploader */}
            <MediaUploader
              label="Avatar Penulis (Foto Profil)"
              value={authorForm.avatar}
              onChange={(url) => setAuthorForm(prev => ({ ...prev, avatar: url }))}
              accept="image/*"
              placeholder="https://... atau path foto profil"
              previewType="image"
            />

            {/* Biografi */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] font-black uppercase text-black/60 dark:text-cream/60">Biografi Penulis</label>
              <textarea
                value={authorForm.bio}
                onChange={(e) => setAuthorForm(prev => ({ ...prev, bio: e.target.value }))}
                className="p-2.5 border-2 border-black rounded bg-white text-black font-semibold text-xs h-28 resize-y focus:bg-yellow/10 focus:outline-none"
                placeholder="Deskripsikan diri Anda secara mendalam..."
              />
            </div>

            {/* Social Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] font-black uppercase text-black/60 dark:text-cream/60">Twitter Username</label>
                <input
                  type="text"
                  value={authorForm.twitter}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, twitter: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs focus:bg-yellow/10 focus:outline-none"
                  placeholder="username_twitter"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] font-black uppercase text-black/60 dark:text-cream/60">GitHub Username</label>
                <input
                  type="text"
                  value={authorForm.github}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, github: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs focus:bg-yellow/10 focus:outline-none"
                  placeholder="username_github"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] font-black uppercase text-black/60 dark:text-cream/60">LinkedIn Username</label>
                <input
                  type="text"
                  value={authorForm.linkedin}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="p-2 border-2 border-black rounded bg-white text-black font-mono text-xs focus:bg-yellow/10 focus:outline-none"
                  placeholder="username_linkedin"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authorSubmitLoading}
              className="w-full py-3.5 border-3 border-black bg-neon-green hover:bg-yellow text-black font-black uppercase rounded-lg shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-center text-sm"
            >
              {authorSubmitLoading ? "Menyimpan Perubahan..." : "Simpan Profil Penulis →"}
            </button>
          </form>
        )}

      </main>
    </div>
  );
}
