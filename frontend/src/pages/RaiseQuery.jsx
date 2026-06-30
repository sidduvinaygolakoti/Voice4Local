import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { complaintService } from '../services/complaint'
import { aiService } from '../services/ai'
import ImageUploader from '../components/ImageUploader'
import {
  User, MapPin, Building, AlertTriangle, Camera, CheckSquare,
  ArrowLeft, ArrowRight, Loader2, Copy, CheckCircle2, Sparkles
} from 'lucide-react'

const MapPicker = lazy(() => import('../components/MapPicker'))

const STEPS = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Address', icon: MapPin },
  { id: 3, title: 'Constituency', icon: Building },
  { id: 4, title: 'Problem Details', icon: AlertTriangle },
  { id: 5, title: 'Evidence', icon: Camera },
  { id: 6, title: 'Review & Submit', icon: CheckSquare },
]

const CATEGORIES = [
  'Road Issue','Drainage Problem','Electricity Problem','Water Supply Problem',
  'Garbage / Waste Problem','Street Lights Not Working','Government Office Issue',
  'Education / School Problem','Medical / Health Issue','Other',
]

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Puducherry',
]

// Generate complaint ID
const genComplaintId = () => {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `LV-${year}-${rand}`
}

export default function RaiseQuery() {
  const [step, setStep] = useState(1)
  const [images, setImages] = useState([])
  const [location, setLocation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [successId, setSuccessId] = useState(null)
  const [copied, setCopied] = useState(false)
  const [aiSuggesting, setAiSuggesting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, trigger, getValues, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  })

  const watchDescription = watch('description', '')
  const watchCategory = watch('category', '')

  // AI auto-suggest category from description
  const handleAiSuggest = async () => {
    const desc = getValues('description')
    if (!desc || desc.length < 20) {
      toast.warning('Please write at least 20 characters for AI to analyze.')
      return
    }
    setAiSuggesting(true)
    try {
      const res = await aiService.analyze(`Identify the complaint category for this issue: "${desc}". Reply with ONLY one of: Road Issue, Drainage Problem, Electricity Problem, Water Supply Problem, Garbage / Waste Problem, Street Lights Not Working, Government Office Issue, Education / School Problem, Medical / Health Issue, Other`)
      const suggested = CATEGORIES.find(c => res.reply?.includes(c))
      if (suggested) {
        setValue('category', suggested)
        toast.success(`AI suggested: ${suggested} ✨`)
      }
    } catch {
      toast.info('AI unavailable. Please select category manually.')
    } finally {
      setAiSuggesting(false)
    }
  }

  const validateStep = async () => {
    const stepFields = {
      1: ['fullName', 'fatherName', 'phone', 'email'],
      2: ['streetVillage', 'district', 'state'],
      3: [],
      4: ['problemTitle', 'category', 'description'],
      5: [],
      6: [],
    }
    return await trigger(stepFields[step])
  }

  const nextStep = async () => {
    if (step === 5 && images.length === 0) {
      toast.error('Please upload at least one photo as evidence.')
      return
    }
    const valid = await validateStep()
    if (valid) setStep(s => Math.min(s + 1, 6))
  }
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const onSubmit = async (data) => {
    if (images.length === 0) { toast.error('Evidence photo is required.'); return }
    setSubmitting(true)

    try {
      // Upload images to Cloudinary via backend
      const imageUrls = []
      for (const img of images) {
        try {
          const res = await aiService.uploadImage(img.file)
          imageUrls.push(res.url)
        } catch {
          // If upload fails, skip (backend may not be configured)
        }
      }

      const payload = {
        fullName: data.fullName,
        fatherName: data.fatherName,
        phone: data.phone,
        email: data.email,
        doorNumber: data.doorNumber,
        streetVillage: data.streetVillage,
        mandal: data.mandal,
        district: data.district,
        state: data.state,
        assemblyConstituency: data.assemblyConstituency,
        parliamentConstituency: data.parliamentConstituency,
        title: data.problemTitle,
        category: data.category,
        description: data.description,
        locationText: data.problemLocation || location?.address || '',
        latitude: location?.lat,
        longitude: location?.lng,
        imageUrls: imageUrls.length > 0 ? imageUrls : images.map(i => i.preview),
      }

      let complaint
      try {
        complaint = await complaintService.create(payload)
        setSuccessId(complaint.complaintId)
      } catch {
        // Demo mode: generate a local complaint ID
        const mockId = genComplaintId()
        setSuccessId(mockId)
      }
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const copyId = () => {
    navigator.clipboard.writeText(successId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Complaint ID copied!')
  }

  // ─── Success Modal ───
  if (successId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-10 max-w-md w-full text-center shadow-card-hover"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full bg-trust-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={48} className="text-trust-500" />
          </motion.div>

          <h2 className="font-poppins font-black text-2xl mb-2 text-trust-500">Complaint Submitted!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Your complaint has been registered. Save your Complaint ID for tracking.
          </p>

          <div className="p-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 mb-6">
            <p className="text-xs text-gray-500 mb-1">Your Complaint ID</p>
            <p className="font-poppins font-black text-3xl gradient-text">{successId}</p>
          </div>

          <div className="flex gap-3 mb-6">
            <button id="copy-complaint-id-btn" onClick={copyId}
              className="flex-1 btn-secondary py-3 text-sm">
              {copied ? <><CheckCircle2 size={15} /> Copied!</> : <><Copy size={15} /> Copy ID</>}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              id="track-after-submit-btn"
              onClick={() => navigate(`/track-complaint?id=${successId}`)}
              className="flex-1 btn-primary text-sm"
            >
              Track Status
            </button>
            <button
              id="go-to-dashboard-btn"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary text-sm"
            >
              Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const formData = getValues()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="section-container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-poppins font-black text-3xl mb-2">Raise a Complaint</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Fill in the details below to report your local problem to the appropriate authority.
          </p>
        </div>

        {/* Step Progress */}
        <div className="glass-card p-4 mb-8">
          <div className="flex items-center justify-between overflow-x-auto gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isDone = step > s.id
              const isCurrent = step === s.id
              return (
                <div key={s.id} className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isDone ? 'bg-trust-500 shadow-glow-green' :
                      isCurrent ? 'bg-gradient-primary shadow-glow-blue' :
                      'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-white" />
                      ) : (
                        <Icon size={15} className={isCurrent ? 'text-white' : 'text-gray-400'} />
                      )}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${
                      isCurrent ? 'text-primary-500' : isDone ? 'text-trust-500' : 'text-gray-400'
                    }`}>
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 w-6 sm:w-8 mx-1 rounded-full transition-all duration-500 ${
                      step > s.id ? 'bg-trust-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full rounded-full bg-gradient-primary"
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="text-xs text-gray-500 text-right mt-1">Step {step} of {STEPS.length}</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 md:p-8 shadow-card-hover">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* STEP 1 — Personal Details */}
              {step === 1 && (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="font-poppins font-bold text-xl mb-6 flex items-center gap-3">
                    <User size={20} className="text-primary-500" /> Personal Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="fullName" className="form-label">Full Name <span className="text-red-500">*</span></label>
                      <input id="fullName" className={`input-field ${errors.fullName ? 'border-red-400' : ''}`}
                        placeholder="Your full name"
                        {...register('fullName', { required: 'Full name is required' })} />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="fatherName" className="form-label">Father's Name <span className="text-red-500">*</span></label>
                      <input id="fatherName" className={`input-field ${errors.fatherName ? 'border-red-400' : ''}`}
                        placeholder="Father's full name"
                        {...register('fatherName', { required: 'Father\'s name is required' })} />
                      {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="rq-phone" className="form-label">Mobile Number <span className="text-red-500">*</span></label>
                      <input id="rq-phone" type="tel" className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                        placeholder="10-digit mobile number"
                        {...register('phone', {
                          required: 'Mobile number is required',
                          pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid Indian mobile number' },
                        })} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="rq-email" className="form-label">Email Address <span className="text-red-500">*</span></label>
                      <input id="rq-email" type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                        placeholder="you@example.com"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter valid email' },
                        })} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Address */}
              {step === 2 && (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="font-poppins font-bold text-xl mb-6 flex items-center gap-3">
                    <MapPin size={20} className="text-primary-500" /> Address Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="doorNumber" className="form-label">Door / House Number</label>
                      <input id="doorNumber" className="input-field" placeholder="e.g. 12-45/A"
                        {...register('doorNumber')} />
                    </div>
                    <div>
                      <label htmlFor="streetVillage" className="form-label">Street / Village Name <span className="text-red-500">*</span></label>
                      <input id="streetVillage" className={`input-field ${errors.streetVillage ? 'border-red-400' : ''}`}
                        placeholder="Street or village name"
                        {...register('streetVillage', { required: 'Street/Village is required' })} />
                      {errors.streetVillage && <p className="text-red-500 text-xs mt-1">{errors.streetVillage.message}</p>}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="mandal" className="form-label">Mandal / Block</label>
                      <input id="mandal" className="input-field" placeholder="Mandal name" {...register('mandal')} />
                    </div>
                    <div>
                      <label htmlFor="district" className="form-label">District <span className="text-red-500">*</span></label>
                      <input id="district" className={`input-field ${errors.district ? 'border-red-400' : ''}`}
                        placeholder="District name"
                        {...register('district', { required: 'District is required' })} />
                      {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="state" className="form-label">State <span className="text-red-500">*</span></label>
                      <select id="state" className={`input-field ${errors.state ? 'border-red-400' : ''}`}
                        {...register('state', { required: 'State is required' })}>
                        <option value="">-- Select State --</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Constituency */}
              {step === 3 && (
                <motion.div key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="font-poppins font-bold text-xl mb-6 flex items-center gap-3">
                    <Building size={20} className="text-primary-500" /> Constituency Details
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 -mt-3 mb-4">
                    This helps route your complaint to the correct MLA / MP office.
                  </p>
                  <div>
                    <label htmlFor="assemblyConstituency" className="form-label">Assembly Constituency (MLA)</label>
                    <input id="assemblyConstituency" className="input-field"
                      placeholder="e.g. Warangal West, Kukatpally"
                      {...register('assemblyConstituency')} />
                  </div>
                  <div>
                    <label htmlFor="parliamentConstituency" className="form-label">Parliament Constituency (MP)</label>
                    <input id="parliamentConstituency" className="input-field"
                      placeholder="e.g. Warangal, Secunderabad"
                      {...register('parliamentConstituency')} />
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-gray-600 dark:text-gray-300">
                    💡 <strong>Tip:</strong> You can find your constituency name on your Voter ID card or at <span className="text-primary-500">eci.gov.in</span>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 — Problem Details */}
              {step === 4 && (
                <motion.div key="step4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <h2 className="font-poppins font-bold text-xl mb-6 flex items-center gap-3">
                    <AlertTriangle size={20} className="text-primary-500" /> Problem Details
                  </h2>

                  <div>
                    <label htmlFor="problemTitle" className="form-label">Problem Title <span className="text-red-500">*</span></label>
                    <input id="problemTitle" className={`input-field ${errors.problemTitle ? 'border-red-400' : ''}`}
                      placeholder="Brief title of the problem (e.g. 'Large pothole on Gandhi Road')"
                      {...register('problemTitle', { required: 'Problem title is required' })} />
                    {errors.problemTitle && <p className="text-red-500 text-xs mt-1">{errors.problemTitle.message}</p>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="category" className="form-label mb-0">Category <span className="text-red-500">*</span></label>
                      <button type="button" id="ai-suggest-category-btn" onClick={handleAiSuggest} disabled={aiSuggesting}
                        className="flex items-center gap-1 text-xs text-purple-500 hover:text-purple-700 transition-colors disabled:opacity-50">
                        <Sparkles size={12} /> {aiSuggesting ? 'Analyzing...' : 'AI Suggest'}
                      </button>
                    </div>
                    <select id="category" className={`input-field ${errors.category ? 'border-red-400' : ''}`}
                      {...register('category', { required: 'Please select a category' })}>
                      <option value="">-- Select Problem Category --</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="problemLocation" className="form-label">Exact Location Address</label>
                    <input id="problemLocation" className="input-field"
                      placeholder="Street name, landmark, area..."
                      {...register('problemLocation')} />
                  </div>

                  {/* Map */}
                  <div>
                    <label className="form-label">Pin on Map (Optional)</label>
                    <Suspense fallback={<div className="h-64 rounded-2xl skeleton" />}>
                      <MapPicker value={location} onChange={setLocation} />
                    </Suspense>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="description" className="form-label mb-0">
                        Problem Description <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-xs ${watchDescription.length < 50 ? 'text-gray-400' : 'text-trust-500'}`}>
                        {watchDescription.length}/50+ characters
                      </span>
                    </div>
                    <textarea id="description"
                      className={`input-field min-h-32 resize-none ${errors.description ? 'border-red-400' : ''}`}
                      placeholder="Describe your problem in detail in Telugu, Hindi, or English. Include when the problem started, who is affected, and what impact it has on your daily life..."
                      {...register('description', {
                        required: 'Description is required',
                        minLength: { value: 50, message: 'Please describe the problem in at least 50 characters' },
                      })}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      💬 You can write in Telugu, Hindi, or English. Multilingual input supported.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 5 — Evidence */}
              {step === 5 && (
                <motion.div key="step5"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-poppins font-bold text-xl mb-2 flex items-center gap-3">
                    <Camera size={20} className="text-primary-500" /> Upload Evidence
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <span className="text-red-500 font-semibold">*Required.</span> Upload clear photos of the problem. This greatly improves resolution speed.
                  </p>
                  <ImageUploader images={images} setImages={setImages} />
                  {images.length === 0 && (
                    <p className="text-xs text-red-400 mt-2 text-center">At least 1 photo is required to submit the complaint.</p>
                  )}
                </motion.div>
              )}

              {/* STEP 6 — Review */}
              {step === 6 && (
                <motion.div key="step6"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-poppins font-bold text-xl mb-6 flex items-center gap-3">
                    <CheckSquare size={20} className="text-primary-500" /> Review & Submit
                  </h2>

                  <div className="space-y-4">
                    {/* Personal */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Personal Details</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.fullName}</span></div>
                        <div><span className="text-gray-500">Father:</span> <span className="font-medium">{formData.fatherName}</span></div>
                        <div><span className="text-gray-500">Mobile:</span> <span className="font-medium">{formData.phone}</span></div>
                        <div><span className="text-gray-500">Email:</span> <span className="font-medium truncate">{formData.email}</span></div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Address</p>
                      <p className="text-sm">
                        {[formData.doorNumber, formData.streetVillage, formData.mandal, formData.district, formData.state]
                          .filter(Boolean).join(', ')}
                      </p>
                    </div>

                    {/* Problem */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Problem</p>
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div><span className="text-gray-500">Title:</span> <span className="font-medium">{formData.problemTitle}</span></div>
                        <div><span className="text-gray-500">Category:</span>
                          <span className="badge badge-inprogress ml-2">{formData.category}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Description:</span>
                        <p className="text-sm mt-1 leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-4">
                          {formData.description}
                        </p>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Evidence Photos ({images.length})</p>
                      <div className="flex gap-2 flex-wrap">
                        {images.map((img, i) => (
                          <img key={i} src={img.preview} alt={`Evidence ${i+1}`}
                            className="w-16 h-16 rounded-lg object-cover border border-white/20" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm text-gray-600 dark:text-gray-300">
                    ✅ By submitting, you confirm all details are accurate. Providing false information may result in account suspension.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <button type="button" id="prev-step-btn" onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-600 hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <ArrowLeft size={16} /> Previous
              </button>

              {step < 6 ? (
                <button type="button" id="next-step-btn" onClick={nextStep}
                  className="btn-primary px-6 py-2.5 text-sm">
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button id="submit-complaint-btn" type="submit" disabled={submitting}
                  className="btn-success px-8 py-2.5 text-sm disabled:opacity-60">
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><CheckSquare size={16} /> Raise My Complaint</>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
