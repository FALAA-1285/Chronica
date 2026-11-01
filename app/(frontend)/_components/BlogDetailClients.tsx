"use client";

import React, { useState } from "react";
import { ThumbsUp, Heart, Star, Share2, MessageSquare, Check } from "lucide-react";
import { Comment } from "../_lib/types";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

// 1. Interactive Emoji Reactions
export const EmojiReactions = () => {
  const [reactions, setReactions] = useState({
    like: 12,
    heart: 24,
    star: 8,
    mindblown: 15,
  });

  const [clicked, setClicked] = useState<Record<string, boolean>>({});

  const handleReaction = (key: keyof typeof reactions) => {
    if (clicked[key]) return;
    setReactions((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setClicked((prev) => ({ ...prev, [key]: true }));
  };

  return (
    <div className="border-2 border-black bg-white p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors select-none">
      <h4 className="font-mono text-xs font-black uppercase text-black/50 dark:text-cream/50 mb-3">
        React to this story
      </h4>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleReaction("like")}
          disabled={clicked.like}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded font-mono text-xs font-black transition-all ${
            clicked.like
              ? "bg-neon-green text-black"
              : "bg-white hover:bg-cream-dark text-black dark:bg-dark-surface-2 dark:text-cream dark:hover:bg-yellow dark:hover:text-black"
          }`}
        >
          <ThumbsUp className="h-4.5 w-4.5" />
          <span>{reactions.like}</span>
        </button>

        <button
          onClick={() => handleReaction("heart")}
          disabled={clicked.heart}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded font-mono text-xs font-black transition-all ${
            clicked.heart
              ? "bg-coral text-white"
              : "bg-white hover:bg-cream-dark text-black dark:bg-dark-surface-2 dark:text-cream dark:hover:bg-yellow dark:hover:text-black"
          }`}
        >
          <Heart className={`h-4.5 w-4.5 ${clicked.heart ? "fill-white" : ""}`} />
          <span>{reactions.heart}</span>
        </button>

        <button
          onClick={() => handleReaction("star")}
          disabled={clicked.star}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded font-mono text-xs font-black transition-all ${
            clicked.star
              ? "bg-yellow text-black"
              : "bg-white hover:bg-cream-dark text-black dark:bg-dark-surface-2 dark:text-cream dark:hover:bg-yellow dark:hover:text-black"
          }`}
        >
          <Star className={`h-4.5 w-4.5 ${clicked.star ? "fill-black" : ""}`} />
          <span>{reactions.star}</span>
        </button>

        <button
          onClick={() => handleReaction("mindblown")}
          disabled={clicked.mindblown}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black rounded font-mono text-xs font-black transition-all ${
            clicked.mindblown
              ? "bg-electric-blue text-white"
              : "bg-white hover:bg-cream-dark text-black dark:bg-dark-surface-2 dark:text-cream dark:hover:bg-yellow dark:hover:text-black"
          }`}
        >
          <span>🤯</span>
          <span>{reactions.mindblown}</span>
        </button>
      </div>
    </div>
  );
};

// 2. Share Buttons Component
export const ShareButtons = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-2 border-black bg-white p-5 rounded-md shadow-[4px_4px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[4px_4px_0px_#FFFBF0] transition-colors select-none">
      <h4 className="font-mono text-xs font-black uppercase text-black/50 dark:text-cream/50 mb-3">
        Share Article
      </h4>
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={handleShare} className="w-full flex items-center justify-center gap-2">
          {copied ? (
            <>
              <Check className="h-4.5 w-4.5 text-neon-green" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4.5 w-4.5" />
              <span>Copy Link</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// 3. Copy Code Button
export const CopyCodeButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center border border-black bg-white text-black rounded shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-yellow transition-all text-xs"
      title="Copy code"
    >
      {copied ? <Check className="h-4 w-4 text-neon-green" /> : <CopyCodeButtonIcon />}
    </button>
  );
};

const CopyCodeButtonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

// 4. Comments Section
export const CommentSection = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Alex Rivers",
      avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Alex",
      content: "This is hands-down the best implementation explanation of Neo Brutalism styling I've read. The CSS tokens make perfect sense!",
      createdAt: "2026-05-21T11:00:00Z",
      likes: 4,
    },
    {
      id: "2",
      author: "Mia Chen",
      avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Mia",
      content: "Love the playful widgets and shadows, can't wait to try implementing this custom design system in my Next.js portfolio project.",
      createdAt: "2026-05-22T08:30:00Z",
      likes: 2,
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [name, setName] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim()) return;

    const added: Comment = {
      id: String(comments.length + 1),
      author: name,
      avatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${name}`,
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments((prev) => [added, ...prev]);
    setNewComment("");
    setName("");
  };

  return (
    <div className="border-2 border-black bg-white p-6 rounded-md shadow-[6px_6px_0px_#0A0A0A] dark:border-cream dark:bg-dark-surface dark:shadow-[6px_6px_0px_#FFFBF0] transition-colors select-none mt-12">
      <h3 className="text-display text-xl uppercase text-black dark:text-cream flex items-center gap-2 mb-6 border-b-2 border-black dark:border-cream pb-3 font-extrabold">
        <MessageSquare className="h-5.5 w-5.5" />
        <span>Discussion ({comments.length})</span>
      </h3>

      {/* Post comment form */}
      <form onSubmit={handlePostComment} className="flex flex-col gap-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="text"
            placeholder="Your Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="text-sm"
          />
        </div>
        <textarea
          placeholder="Share your thoughts or leave a question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          rows={3}
          className="w-full px-4 py-3 bg-white text-black font-semibold border-2 border-black rounded-md shadow-[2px_2px_0px_#0A0A0A] placeholder-black/50 transition-all focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0px_#0A0A0A] dark:bg-dark-surface-2 dark:text-cream dark:border-cream dark:shadow-[2px_2px_0px_#FFFBF0] dark:placeholder-cream/50 dark:focus:shadow-[4px_4px_0px_#FFFBF0] text-sm"
        />
        <Button type="submit" variant="electric" size="sm" className="w-fit self-end">
          <span>Post Comment</span>
        </Button>
      </form>

      {/* List comments */}
      <div className="flex flex-col gap-5">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border border-black bg-cream-dark/45 dark:bg-dark-surface-2 dark:border-cream flex gap-3 items-start rounded">
            <div className="relative h-9 w-9 border border-black rounded-full overflow-hidden flex-shrink-0 bg-yellow dark:border-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comment.avatar} alt={comment.author} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-black text-sm text-black dark:text-cream">{comment.author}</span>
                <span className="font-mono text-[9px] text-black/50 dark:text-cream/50">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-black/85 dark:text-cream/85 font-semibold mt-1.5 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
