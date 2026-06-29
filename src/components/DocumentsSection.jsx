import { useRef, useState } from 'react'
import useDocuments, {
  GIVE_DOCUMENT_TYPES,
  HELP_DOCUMENT_TYPES,
  ACCEPT_STRING,
} from '../hooks/useDocuments'
import s from './DocumentsSection.module.css'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function fileIcon(mimeType) {
  if (!mimeType) return '📎'
  if (mimeType === 'application/pdf') return '📕'
  if (mimeType.includes('word'))      return '📝'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet') || mimeType === 'text/csv') return '📊'
  if (mimeType.startsWith('image/'))  return '🖼️'
  return '📎'
}

// ── Single document slot ─────────────────────────────────────────────────────

function DocSlot({ def, doc, side, uploading, onUpload, onDelete, onView }) {
  const inputRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const isUploading = uploading === def.type
  const isHelp = side === 'help'

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) onUpload(def.type, def.label, file)
    e.target.value = '' // reset so same file can be re-selected
  }

  return (
    <div className={`${s.slot} ${doc ? s.slotFilled : ''}`}>
      {/* Row */}
      <div className={s.slotRow}>
        <span className={s.slotIcon}>{def.icon}</span>
        <div className={s.slotInfo}>
          <div className={s.slotTitleRow}>
            <p className={s.slotLabel}>
              {def.label}
              {def.required && <span className={s.requiredBadge}>Required</span>}
            </p>
            {isHelp && (
              <button
                className={s.helpToggle}
                onClick={() => setExpanded(v => !v)}
                aria-label={expanded ? 'Hide description' : 'What is this?'}
              >
                {expanded ? '▲' : '?'}
              </button>
            )}
          </div>
          {doc ? (
            <p className={s.slotMeta}>
              {fileIcon(doc.mime_type)} {doc.file_name} · {formatBytes(doc.file_size)} · {formatDate(doc.uploaded_at)}
            </p>
          ) : (
            <p className={s.slotDesc}>
              {isHelp ? def.plainDesc || def.description : def.description}
            </p>
          )}
        </div>
      </div>

      {/* Expanded plain-language description (Help side) */}
      {isHelp && expanded && (
        <div className={s.plainCard}>
          <p className={s.plainText}>{def.plainDesc || def.description}</p>
        </div>
      )}

      {/* Actions */}
      <div className={s.slotActions}>
        {doc ? (
          <>
            <button className={`${s.actionBtn} ${s.actionView}`} onClick={() => onView(doc)}>
              View
            </button>
            <button className={`${s.actionBtn} ${s.actionReplace}`} onClick={() => inputRef.current?.click()}>
              Replace
            </button>
            <button className={`${s.actionBtn} ${s.actionDelete}`} onClick={() => onDelete(doc)}>
              Remove
            </button>
          </>
        ) : (
          <button
            className={`${s.actionBtn} ${s.actionUpload} ${isHelp ? s.actionUploadHelp : s.actionUploadGive}`}
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading…' : isHelp ? 'Upload this document' : 'Upload'}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_STRING}
          className={s.hiddenInput}
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function DocumentsSection({ side = 'give' }) {
  const {
    loading, uploading, error,
    uploadDocument, deleteDocument, getFileUrl, getDoc,
  } = useDocuments(side)

  const docTypes = side === 'help' ? HELP_DOCUMENT_TYPES : GIVE_DOCUMENT_TYPES
  const isHelp = side === 'help'

  const uploadedCount = docTypes.filter(def => !!getDoc(def.type)).length

  async function handleView(doc) {
    const url = await getFileUrl(doc.file_path)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return <div className={s.loading}>Loading your documents…</div>
  }

  return (
    <div className={s.section}>
      {/* Header */}
      <div className={s.header}>
        {isHelp ? (
          <>
            <p className={s.intro}>
              Upload your documents here so they're ready when you need them.
              Many programs ask for the same documents — having them saved saves you time.
            </p>
            <p className={s.introSub}>
              Your documents are private and secure. Only you can see them.
            </p>
          </>
        ) : (
          <p className={s.intro}>
            Upload your documents once and share them with any organization you volunteer with.
            Many orgs require IDs, background check authorization, and certifications before you can start.
          </p>
        )}
        {uploadedCount > 0 && (
          <div className={s.progress}>
            <div className={s.progressBar}>
              <div
                className={`${s.progressFill} ${isHelp ? s.progressFillHelp : s.progressFillGive}`}
                style={{ width: `${Math.round((uploadedCount / docTypes.length) * 100)}%` }}
              />
            </div>
            <span className={s.progressLabel}>{uploadedCount} of {docTypes.length} uploaded</span>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className={s.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      {/* Accepted formats note */}
      <div className={s.formatNote}>
        <span className={s.formatIcon}>📎</span>
        <span>
          {isHelp
            ? 'We accept photos (JPG, PNG, HEIC), PDFs, and Word documents. Max size: 20 MB.'
            : 'Accepted: PDF, Word (.docx), Excel (.xlsx), CSV, images (JPG, PNG, HEIC). Max 20 MB per file.'}
        </span>
      </div>

      {/* Document slots */}
      <div className={s.slotList}>
        {docTypes.map(def => (
          <DocSlot
            key={def.type}
            def={def}
            doc={getDoc(def.type)}
            side={side}
            uploading={uploading}
            onUpload={uploadDocument}
            onDelete={deleteDocument}
            onView={handleView}
          />
        ))}
      </div>
    </div>
  )
}
