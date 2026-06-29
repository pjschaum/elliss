import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Accepted MIME types and their extensions
export const ACCEPTED_FORMATS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
]

export const ACCEPT_STRING = ACCEPTED_FORMATS.join(',')

// Max file size: 20 MB
export const MAX_FILE_BYTES = 20 * 1024 * 1024

// ── Document type definitions ──────────────────────────────────────────────

export const GIVE_DOCUMENT_TYPES = [
  {
    type: 'resume',
    label: 'Resume / CV',
    description: 'Your resume or curriculum vitae listing your work experience and skills.',
    icon: '📄',
    required: false,
  },
  {
    type: 'photo_id',
    label: 'Government-Issued Photo ID',
    description: 'Driver\'s license, state ID, or passport. Required by most organizations.',
    icon: '🪪',
    required: true,
  },
  {
    type: 'background_auth',
    label: 'Background Check Authorization',
    description: 'Signed consent form allowing an organization to run a background check on you.',
    icon: '✍️',
    required: false,
  },
  {
    type: 'background_result',
    label: 'Background Check Results',
    description: 'Results from a completed background check, provided by a screening service.',
    icon: '🔍',
    required: false,
  },
  {
    type: 'reference_letter',
    label: 'Reference Letter',
    description: 'A letter from someone who can speak to your character or experience.',
    icon: '💌',
    required: false,
  },
  {
    type: 'liability_waiver',
    label: 'Liability Waiver',
    description: 'A signed form releasing an organization from liability during your volunteer service.',
    icon: '📋',
    required: false,
  },
  {
    type: 'certification',
    label: 'Skills / Professional Certification',
    description: 'CPR, food handler, nursing license, teaching certificate, or other credentials.',
    icon: '🏅',
    required: false,
  },
  {
    type: 'drivers_license',
    label: 'Driver\'s License',
    description: 'Required for roles that involve transporting people or goods.',
    icon: '🚗',
    required: false,
  },
  {
    type: 'training_cert',
    label: 'Training Completion Certificate',
    description: 'Certificate showing you completed an organization\'s required training.',
    icon: '🎓',
    required: false,
  },
  {
    type: 'health_cert',
    label: 'Health Certification / TB Test',
    description: 'Health clearance required for food, medical, or senior care volunteer roles.',
    icon: '🏥',
    required: false,
  },
  {
    type: 'parental_consent',
    label: 'Parental Consent Form',
    description: 'Required if you are under 18 years old.',
    icon: '👨‍👩‍👧',
    required: false,
  },
]

export const HELP_DOCUMENT_TYPES = [
  {
    type: 'photo_id',
    label: 'Photo ID',
    description: 'A driver\'s license, state ID, or passport. This proves who you are.',
    plainDesc: 'Most programs need to see a photo of your face and your name. A driver\'s license, state ID card, or passport all work.',
    icon: '🪪',
    required: true,
  },
  {
    type: 'birth_cert',
    label: 'Birth Certificate',
    description: 'Your birth certificate, or your child\'s. Shows your date of birth and full name.',
    plainDesc: 'This is the document you got when you were born. Programs use it to confirm your age and legal name.',
    icon: '📜',
    required: false,
  },
  {
    type: 'social_security',
    label: 'Social Security Card',
    description: 'Your Social Security card or a document showing your Social Security number.',
    plainDesc: 'The card with your 9-digit Social Security number. Almost all government programs need this.',
    icon: '🔢',
    required: false,
  },
  {
    type: 'proof_income',
    label: 'Proof of Income',
    description: 'Pay stubs from the last 30 days, an employer letter, or a benefit award letter (SSDI, SSI, unemployment).',
    plainDesc: 'Something that shows how much money you receive. This could be a pay stub from work, a letter from your employer, or a letter saying you receive Social Security, disability, or unemployment benefits.',
    icon: '💵',
    required: false,
  },
  {
    type: 'proof_residency',
    label: 'Proof of Where You Live',
    description: 'A lease agreement, utility bill, bank statement, or letter from your landlord — showing your current address.',
    plainDesc: 'Something with your name and home address on it. A bill (electric, gas, water), a lease, or a letter from your landlord all work.',
    icon: '🏠',
    required: false,
  },
  {
    type: 'immigration_status',
    label: 'Proof of Citizenship or Immigration Status',
    description: 'U.S. passport, naturalization certificate, permanent resident card (green card), or visa documentation.',
    plainDesc: 'A document showing your right to be in the United States. This could be a U.S. passport, a green card, or other immigration papers.',
    icon: '🌎',
    required: false,
  },
  {
    type: 'tax_return',
    label: 'Tax Return',
    description: 'Your most recent federal tax return (Form 1040). Used for income verification.',
    plainDesc: 'The form you filed with the IRS last year about your income. If you did not file taxes, that\'s okay — you can let the program know.',
    icon: '🗂️',
    required: false,
  },
  {
    type: 'bank_statement',
    label: 'Bank Statement',
    description: 'A recent bank or credit union statement showing your account balance.',
    plainDesc: 'A printout or PDF from your bank showing your account and recent activity. Programs use this to understand your financial situation.',
    icon: '🏦',
    required: false,
  },
  {
    type: 'utility_bill',
    label: 'Utility Bill',
    description: 'A gas, electric, or water bill. Used for energy assistance programs and as proof of address.',
    plainDesc: 'A recent bill for gas, electricity, or water at your home. Required for the LIHEAP energy assistance program.',
    icon: '⚡',
    required: false,
  },
  {
    type: 'medical_docs',
    label: 'Medical or Disability Records',
    description: 'Doctor\'s letters, disability determination, or medical records supporting a healthcare or disability application.',
    plainDesc: 'Papers from your doctor or a hospital about your health condition. Needed for disability programs like SSI/SSDI or some Medicaid tracks.',
    icon: '🏥',
    required: false,
  },
  {
    type: 'court_order',
    label: 'Court Order',
    description: 'Child support or custody agreements issued by a court.',
    plainDesc: 'An official paper from a judge about child support or who takes care of your children. Some programs need this to understand your household.',
    icon: '⚖️',
    required: false,
  },
  {
    type: 'benefit_letter',
    label: 'Benefit Award Letter',
    description: 'A letter from SNAP, SSI, Medicaid, or another program confirming your current benefits.',
    plainDesc: 'A letter from a program you already receive, like SNAP or Social Security, showing you are currently enrolled. Some programs use this to fast-track your application.',
    icon: '📩',
    required: false,
  },
]

// ── Hook ───────────────────────────────────────────────────────────────────

export default function useDocuments(side) {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(null) // document_type currently uploading
  const [error, setError]         = useState(null)

  // Fetch all documents for this user + side
  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data, error: fetchError } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('side', side)
        .order('uploaded_at', { ascending: false })

      if (fetchError) throw fetchError
      setDocuments(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [side])

  useEffect(() => { fetchDocuments() }, [fetchDocuments])

  // Upload a file for a given document type
  const uploadDocument = useCallback(async (documentType, label, file) => {
    setError(null)

    // Validate size
    if (file.size > MAX_FILE_BYTES) {
      setError('File is too large. Maximum size is 20 MB.')
      return false
    }

    // Validate type
    if (!ACCEPTED_FORMATS.includes(file.type) && file.type !== '') {
      setError('File type not supported. Please upload a PDF, Word doc, image, or spreadsheet.')
      return false
    }

    setUploading(documentType)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not signed in')

      // Build unique storage path
      const ext      = file.name.split('.').pop()
      const uniqueId = crypto.randomUUID()
      const filePath = `${user.id}/${side}/${documentType}/${uniqueId}.${ext}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(filePath, file, { upsert: false, contentType: file.type })

      if (uploadError) throw uploadError

      // Save metadata to DB
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id:       user.id,
          side,
          document_type: documentType,
          label,
          file_name:     file.name,
          file_path:     filePath,
          file_size:     file.size,
          mime_type:     file.type,
        })

      if (dbError) throw dbError

      await fetchDocuments()
      return true
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.')
      return false
    } finally {
      setUploading(null)
    }
  }, [side, fetchDocuments])

  // Get a temporary signed URL to preview/download a file
  const getFileUrl = useCallback(async (filePath) => {
    const { data, error: urlError } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(filePath, 60 * 60) // 1 hour
    if (urlError) return null
    return data.signedUrl
  }, [])

  // Delete a document (storage + metadata row)
  const deleteDocument = useCallback(async (doc) => {
    setError(null)
    try {
      // Remove from storage
      await supabase.storage.from('user-documents').remove([doc.file_path])

      // Remove metadata row
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', doc.id)

      if (dbError) throw dbError

      setDocuments(prev => prev.filter(d => d.id !== doc.id))
    } catch (err) {
      setError(err.message || 'Could not delete document.')
    }
  }, [])

  // Find the most recent upload for a given document type
  const getDoc = useCallback((documentType) => {
    return documents.find(d => d.document_type === documentType) || null
  }, [documents])

  return {
    documents,
    loading,
    uploading,
    error,
    uploadDocument,
    deleteDocument,
    getFileUrl,
    getDoc,
    refresh: fetchDocuments,
  }
}
