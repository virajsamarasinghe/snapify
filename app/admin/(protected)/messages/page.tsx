"use client";

import ConfirmDialog from "@/app/components/admin/ConfirmDialog";
import { Inbox, Mail, MailOpen, Phone, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function fetchMessages(silent = false) {
    if (!silent) setLoading(true);
    const res = await fetch("/api/contact");
    const data = await res.json();
    setMessages(data);
    if (!silent) setLoading(false);
  }

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => fetchMessages(true), 10000);
    return () => clearInterval(interval);
  }, []);

  async function markRead(msg: Message) {
    if (msg.read) return;
    await fetch(`/api/contact/${msg._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    setMessages((prev) =>
      prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m)),
    );
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (selected?._id === id) setSelected(null);
    setDeleting(null);
    setConfirmDeleteId(null);
  }

  function handleSelect(msg: Message) {
    setSelected(msg);
    markRead(msg);
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen p-8">
      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Message"
        message="Are you sure you want to delete this message? This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
              <Mail size={22} className="text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">
                Messages
              </h1>
              <p className="text-zinc-500 text-sm">Contact form submissions</p>
            </div>
            {unreadCount > 0 && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Live
            </div>
            <button
              onClick={() => fetchMessages()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 text-sm transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-600">
            <Inbox size={48} strokeWidth={1.2} />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              Contact form submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
            {/* Message list */}
            <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              {messages.map((msg, i) => (
                <button
                  key={msg._id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left px-5 py-4 border-b border-white/5 last:border-0 transition-all ${
                    selected?._id === msg._id
                      ? "bg-purple-600/20 border-l-2 border-l-purple-500"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                      )}
                      <span
                        className={`text-sm truncate ${msg.read ? "text-zinc-300" : "text-white font-semibold"}`}
                      >
                        {msg.name}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-600 shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate ${msg.read ? "text-zinc-500" : "text-zinc-400"}`}
                  >
                    {msg.subject}
                  </p>
                  {msg.phone && (
                    <p className="text-xs text-zinc-600 flex items-center gap-1 mt-0.5">
                      <Phone size={11} />
                      {msg.phone}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {/* Message detail */}
            {selected ? (
              <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                {/* Detail header */}
                <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-white font-semibold text-base mb-2">
                      {selected.subject}
                    </h2>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500 w-12 shrink-0">
                          From
                        </span>
                        <span className="font-medium text-zinc-200">
                          {selected.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500 w-12 shrink-0">
                          Email
                        </span>
                        <a
                          href={`mailto:${selected.email}`}
                          className="text-zinc-300 hover:text-purple-400 transition-colors truncate"
                        >
                          {selected.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-zinc-500 w-12 shrink-0">
                          Phone
                        </span>
                        {selected.phone ? (
                          <a
                            href={`tel:${selected.phone}`}
                            className="flex items-center gap-1.5 text-zinc-300 hover:text-purple-400 transition-colors"
                          >
                            <Phone size={13} />
                            {selected.phone}
                          </a>
                        ) : (
                          <span className="text-zinc-600 italic text-xs">
                            Not provided
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-zinc-600">
                      {new Date(selected.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}{" "}
                      {new Date(selected.createdAt).toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      {selected.read ? (
                        <MailOpen size={16} className="text-zinc-500" />
                      ) : (
                        <Mail size={16} className="text-purple-400" />
                      )}
                      <button
                        onClick={() => setConfirmDeleteId(selected._id)}
                        disabled={deleting === selected._id}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Message body */}
                <div className="px-6 py-6">
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Reply button */}
                <div className="px-6 pb-6">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}&body=${encodeURIComponent(`\n\n---\nOn ${new Date(selected.createdAt).toLocaleString()}, ${selected.name} wrote:\n\n${selected.message}`)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all"
                  >
                    <Mail size={15} />
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center py-24 text-zinc-600 gap-3">
                <MailOpen size={40} strokeWidth={1.2} />
                <p className="text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
