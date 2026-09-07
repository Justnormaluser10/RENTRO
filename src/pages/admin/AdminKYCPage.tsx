import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { KYCDocument } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  User, 
  ShieldCheck, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const AdminKYCPage: React.FC = () => {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Review Modal State
  const [reviewingDoc, setReviewingDoc] = useState<KYCDocument | null>(null);
  const [adminNotes, setAdminNotes] = useState('Valid original licence confirmed. Class LMV verified.');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchKYC = async () => {
    setIsLoading(true);
    const docs = await apiService.getKYCDocuments();
    setDocuments(docs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKYC();
  }, []);

  const handleOpenReview = (doc: KYCDocument) => {
    setReviewingDoc(doc);
    setAdminNotes(doc.admin_notes || 'Valid original licence confirmed. Class LMV verified.');
  };

  const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED') => {
    if (!reviewingDoc) return;
    setIsUpdating(true);
    await apiService.reviewKYCDocument(reviewingDoc.id, status, adminNotes);
    setIsUpdating(false);
    setReviewingDoc(null);
    await fetchKYC();
  };

  const filtered = documents.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Customer KYC Verification Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manual driving licence verification required before vehicle pickup can be authorized.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700 w-fit">
        {(['PENDING', 'APPROVED', 'REJECTED', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === status
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {status === 'all'
              ? `All (${documents.length})`
              : `${status} (${documents.filter((d) => d.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-12 text-center">
          <FileCheck className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No documents in {statusFilter} state</h3>
          <p className="text-xs text-slate-400 mt-1">All uploaded customer licences have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 hover:border-slate-600 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-sm">
                      {doc.user_name || 'Customer'}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      doc.status === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : doc.status === 'PENDING'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Licence Number:</span>
                    <span className="font-mono font-bold text-white">{doc.document_number || 'GJ-01-2022-004819'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Submitted:</span>
                    <span>{formatDateTime(doc.created_at)}</span>
                  </div>
                  {doc.admin_notes && (
                    <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-750">
                      "{doc.admin_notes}"
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <a
                  href={doc.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Document Photo
                </a>

                <Button
                  size="sm"
                  onClick={() => handleOpenReview(doc)}
                  className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs"
                >
                  Review & Decide
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewingDoc && (
        <Modal
          isOpen={true}
          onClose={() => setReviewingDoc(null)}
          title={`Review Driving Licence — ${reviewingDoc.user_name || 'Customer'}`}
          description={`Licence Number: ${reviewingDoc.document_number || 'N/A'}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-slate-900">
            {/* Document Image Preview */}
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-16/10">
              <img
                src={reviewingDoc.document_url}
                alt="Driving licence preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-slate-900">{reviewingDoc.user_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-900">{reviewingDoc.user_phone || '+91 98450 12345'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-emerald-700">{reviewingDoc.status}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Staff Review Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Valid original licence confirmed. Class LMV verified."
                className="w-full text-xs p-3 rounded-xl border border-slate-200"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleUpdateStatus('REJECTED')}
                isLoading={isUpdating}
                className="font-bold text-xs"
              >
                Reject Document
              </Button>
              <Button
                size="sm"
                onClick={() => handleUpdateStatus('APPROVED')}
                isLoading={isUpdating}
                className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700"
              >
                Approve Licence (Allow Pickup)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
