'use client';

import React, { useEffect, useState } from 'react';
import { X, FolderOpen, Trash2, Calendar, FileText, DownloadCloud, Loader2 } from 'lucide-react';
import { NDAData } from '../types/nda';

export interface SavedDocument {
  id: number;
  user_id: number;
  title: string;
  document_type: string;
  data: NDAData;
  created_at: string;
}

interface SavedDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number;
  onLoadDocument: (data: NDAData) => void;
}

export const SavedDocumentsModal: React.FC<SavedDocumentsModalProps> = ({
  isOpen,
  onClose,
  userId,
  onLoadDocument,
}) => {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen, userId]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const url = userId ? `/api/documents?user_id=${userId}` : '/api/documents';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    setDeletingId(docId);
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
      }
    } catch (err) {
      console.error('Failed to delete document:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-docs-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#209dd7]/10 border border-[#209dd7]/30 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-[#209dd7]" />
            </div>
            <div>
              <h2 id="saved-docs-title" className="text-base font-bold text-slate-100">
                Saved Documents History
              </h2>
              <p className="text-xs text-[#888888]">
                Restore and manage previously generated Common Paper legal agreements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close saved documents modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#888888] space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#209dd7]" />
              <span className="text-xs">Fetching saved documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm font-semibold">No saved documents found</p>
              <p className="text-xs text-[#888888]">
                Save your current document using the &ldquo;Save Document&rdquo; button in the toolbar!
              </p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-[#209dd7]/40 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#ecad0a] shrink-0" />
                    <h3 className="text-xs font-bold text-slate-200 truncate group-hover:text-[#209dd7] transition-colors">
                      {doc.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#888888]">
                    <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {doc.document_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onLoadDocument(doc.data);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#209dd7] hover:bg-[#1b88ba] text-white transition-all shadow-md cursor-pointer"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>Load</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    title="Delete saved document"
                    aria-label="Delete document"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
