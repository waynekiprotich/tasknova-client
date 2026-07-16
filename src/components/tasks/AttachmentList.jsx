import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Download, Trash2, File as FileIcon, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../../utils/api';
import { getSocket } from '../../utils/socket';
import useCloudinaryUpload from '../../hooks/useCloudinaryUpload';

export default function AttachmentList({ taskId, currentUser }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  const { uploadFile, isUploading, progress } = useCloudinaryUpload();

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await api.get(`/attachments/task/${taskId}`);
        setAttachments(response.data.data);
      } catch (err) {
        console.error("Failed to fetch attachments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();

    const socket = getSocket();
    if (socket) {
      socket.on('attachment:created', (attachment) => {
        if (attachment.task_id === taskId) {
          setAttachments(prev => {
            if (prev.some(a => a.id === attachment.id)) return prev;
            return [...prev, attachment];
          });
        }
      });

      socket.on('attachment:deleted', ({ id, task_id }) => {
        if (task_id === taskId) {
          setAttachments(prev => prev.filter(a => a.id !== id));
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('attachment:created');
        socket.off('attachment:deleted');
      }
    };
  }, [taskId]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Upload to Cloudinary
      const cloudinaryData = await uploadFile(file);
      
      // 2. Save attachment record in backend
      await api.post('/attachments/', {
        task_id: taskId,
        file_url: cloudinaryData.url,
        file_name: cloudinaryData.original_filename || file.name,
        file_type: cloudinaryData.resource_type || file.type,
        file_size_bytes: cloudinaryData.bytes || file.size,
        cloudinary_public_id: cloudinaryData.public_id
      });
      
    } catch (err) {
      console.error("Failed to upload attachment", err);
      alert("Failed to upload attachment: " + err.message);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!window.confirm("Are you sure you want to delete this attachment?")) return;
    try {
      await api.delete(`/attachments/${attachmentId}`);
    } catch (err) {
      console.error("Failed to delete attachment", err);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-400" />;
    return <FileIcon className="w-5 h-5 text-gray-400" />;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white flex items-center">
          <Paperclip className="w-4 h-4 mr-2 text-gray-400" />
          Attachments ({attachments.length})
        </h4>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-xs bg-surface-hover hover:bg-white/10 text-white px-3 py-1.5 rounded-lg border border-border transition-colors flex items-center disabled:opacity-50"
          >
            {isUploading ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Uploading {progress}%</>
            ) : (
              <><Plus className="w-3.5 h-3.5 mr-1.5" /> Add File</>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-gray-500 py-2">Loading attachments...</div>
      ) : attachments.length === 0 ? (
        <div className="text-sm text-gray-500 italic py-2 border-2 border-dashed border-border/50 rounded-lg text-center">
          No attachments yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {attachments.map(att => (
            <div key={att.id} className="flex items-center justify-between p-2 rounded-lg bg-surface-hover/30 border border-border/50 group">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="p-2 bg-surface rounded-md border border-border">
                  {getFileIcon(att.file_type)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-white font-medium truncate w-40 sm:w-56" title={att.file_name}>
                    {att.file_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(att.file_size_bytes)} • {formatDistanceToNow(new Date(att.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href={att.file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-white bg-surface rounded-md border border-border transition-colors"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                {(currentUser?.id === att.uploader_id) && (
                  <button 
                    onClick={() => handleDelete(att.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 bg-surface rounded-md border border-border transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
