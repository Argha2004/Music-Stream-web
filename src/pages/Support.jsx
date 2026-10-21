import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Heart,
  Copy,
  Check,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Server,
  Sparkles,
} from 'lucide-react'
import Sheet from '../components/Sheet'
import Reveal from '../components/Reveal'
import SectionLabel from '../components/SectionLabel'

const UPI_ID = 'arghadeeppakhira-1@oksbi'
const PAYEE_NAME = 'Arghadeep Pakhira'
const PRESET_AMOUNTS = [
  { amt: 20, label: 'Chai' },
  { amt: 50, label: 'Coffee' },
  { amt: 100, label: 'Supporter' },
]

const APPS = [
  'Google Pay',
  'PhonePe',
  'Paytm',
  'BHIM UPI',
  'Cred / Navi',
]

export default function Support() {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const [isCustom, setIsCustom] = useState(false)
  const [copied, setCopied] = useState(false)

  const activeAmount = isCustom ? Number(customAmount) || 0 : selectedAmount

  // Construct standard UPI Payment URI
  // Example: upi://pay?pa=arghadeeppakhira-1@oksbi&pn=Arghadeep%20Pakhira&am=50&cu=INR&tn=Support%20MusicStream
  const upiUri = activeAmount > 0
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
        PAYEE_NAME
      )}&am=${encodeURIComponent(activeAmount)}&cu=INR&tn=${encodeURIComponent(
        'Support MusicStream'
      )}`
    : `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
        PAYEE_NAME
      )}&cu=INR&tn=${encodeURIComponent('Support MusicStream')}`

  function handleSelectPreset(amount) {
    setIsCustom(false)
    setSelectedAmount(amount)
  }

  function handleCustomChange(e) {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setCustomAmount(val)
    setIsCustom(true)
  }

  function handleCopyUpi() {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <Sheet label="Support & Donate">
      <Reveal className="max-w-3xl">
        <SectionLabel index={6}>Support Project</SectionLabel>
        <h1 className="drawing-title mt-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
          Support MusicStream
        </h1>
        <p className="mt-2 text-sm sm:text-base lg:text-lg text-ink-2 leading-relaxed">
          MusicStream is 100% free, private, and ad-free. Your contributions directly fund
          Cloudflare R2 APK distribution hosting, testing devices, and active development.
        </p>
      </Reveal>

      {/* Main Interactive Support Section */}
      <section className="mt-7 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* Column 1: Choose Amount & UPI Options (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="rounded-2xl sm:rounded-3xl border border-rule bg-card p-4 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-primary">
                  Step 1: Choose Amount
                </span>
                <span className="text-[11px] font-semibold text-ink-3 font-mono">
                  INR (₹)
                </span>
              </div>

              <h2 className="font-display text-lg sm:text-2xl font-bold text-ink mt-1.5 sm:mt-2">
                Select your contribution
              </h2>
              <p className="text-xs sm:text-sm text-ink-2 mt-1">
                Pick a preset or enter any custom amount you wish to support with.
              </p>

              {/* Preset Buttons - 20, 50, 100 */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 mt-4 sm:mt-5">
                {PRESET_AMOUNTS.map(({ amt, label }) => {
                  const isCurrent = !isCustom && selectedAmount === amt
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`relative flex flex-col items-center justify-center py-2.5 px-1.5 sm:py-4 sm:px-3 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-primary bg-primary-pill shadow-xs ring-2 ring-primary/20 scale-[1.01]'
                          : 'border-rule bg-card-subtle hover:bg-hover hover:border-primary/40'
                      }`}
                    >
                      <span
                        className={`font-display text-lg sm:text-2xl lg:text-3xl font-extrabold ${
                          isCurrent ? 'text-primary-pill-text' : 'text-ink'
                        }`}
                      >
                        ₹{amt}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold mt-0.5 sm:mt-1 ${
                          isCurrent ? 'text-primary' : 'text-ink-3'
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Custom amount input */}
              <div className="mt-4 pt-3.5 border-t border-rule/60">
                <label htmlFor="custom-amt" className="block text-xs font-semibold text-ink-2 mb-1.5">
                  Or enter custom amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-sm sm:text-base font-bold text-ink-3">
                    ₹
                  </span>
                  <input
                    id="custom-amt"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 250"
                    value={customAmount}
                    onChange={handleCustomChange}
                    onFocus={() => setIsCustom(true)}
                    className={`w-full rounded-xl sm:rounded-2xl border pl-8 pr-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition-all outline-none bg-sheet ${
                      isCustom && customAmount
                        ? 'border-primary ring-2 ring-primary/20 text-ink'
                        : 'border-rule text-ink placeholder:text-ink-3/50'
                    }`}
                  />
                </div>
              </div>

              {/* Mobile-Only One-Tap UPI App Button (Placed right under amount selection for immediate action) */}
              <div className="mt-4 block lg:hidden">
                <a
                  href={upiUri}
                  className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-sm active:scale-95 transition-all"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Pay ₹{activeAmount || 50} via UPI App</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <p className="mt-1.5 text-[10px] sm:text-[11px] text-center text-ink-3">
                  Opens Google Pay, PhonePe, Paytm, or BHIM directly
                </p>
              </div>

              {/* Direct UPI ID Box */}
              <div className="mt-4 pt-3.5 border-t border-rule/60">
                <div className="rounded-xl sm:rounded-2xl bg-card-subtle/80 border border-rule p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-ink-3">
                      Direct UPI VPA
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium text-primary">
                      All UPI Apps
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 min-w-0 font-mono text-xs sm:text-sm font-bold text-ink bg-sheet px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl border border-rule/80 truncate select-all">
                      {UPI_ID}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="btn btn-sm btn-secondary px-3 sm:px-3.5 py-2 shrink-0 flex items-center gap-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
                      title="Copy UPI ID"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-primary" />
                          <span className="text-primary font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Supported Apps Pills */}
              <div className="mt-4 pt-3 border-t border-rule/50 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="font-semibold text-ink-2 text-[11px] sm:text-xs mr-1">
                  Supported:
                </span>
                {APPS.map((app) => (
                  <span
                    key={app}
                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-sheet text-ink-2 font-mono text-[10px] sm:text-[11px] border border-rule/70"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Live Generated QR Code (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            <div className="w-full rounded-2xl sm:rounded-3xl border border-rule bg-card p-4 sm:p-7 flex flex-col items-center shadow-md">
              <div className="w-full flex items-center justify-between pb-3 border-b border-rule">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    Scan &amp; Pay
                  </span>
                </div>
                <span className="font-display text-xs sm:text-sm font-extrabold text-primary bg-primary-pill px-3 py-1 rounded-full border border-primary/20">
                  {activeAmount > 0 ? `₹${activeAmount}` : 'Any Amount'}
                </span>
              </div>

              {/* The QR Code Card Frame (Responsive sizing, never overflows) */}
              <div className="mt-4 sm:mt-5 p-3 sm:p-4 rounded-2xl bg-white border border-black/10 shadow-inner flex flex-col items-center justify-center">
                <div className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] flex items-center justify-center">
                  <QRCodeSVG
                    value={upiUri}
                    size={200}
                    level="M"
                    includeMargin={false}
                    fgColor="#152018"
                    bgColor="#ffffff"
                    className="w-full h-full max-w-full max-h-full rounded-md"
                  />
                </div>
              </div>

              <div className="mt-3 text-center">
                <p className="font-mono text-xs text-ink-3">
                  Payee: <span className="text-ink font-semibold">{PAYEE_NAME}</span>
                </p>
                <p className="font-mono text-[11px] text-ink-3 mt-0.5 break-all">{UPI_ID}</p>
              </div>

              {/* Desktop / Tablet Direct Pay Button (hidden on mobile, as mobile has it right above) */}
              <a
                href={upiUri}
                className="btn btn-primary w-full mt-4 py-3 sm:py-3.5 hidden lg:flex items-center justify-center gap-2 font-semibold text-sm shadow-sm"
              >
                <Smartphone className="h-4 w-4" />
                <span>Pay ₹{activeAmount || 50} via UPI App</span>
              </a>

              <p className="mt-2.5 text-[10px] sm:text-[11px] text-center text-ink-3 leading-snug">
                Scan using any UPI camera or QR scanner from any Indian banking app.
              </p>
            </div>
          </div>
        </div>

        {/* Full-width "Where does your support go?" Section Below */}
        <div className="mt-7 sm:mt-10 rounded-2xl sm:rounded-3xl border border-rule bg-card p-4 sm:p-7 shadow-2xs">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary fill-primary" />
            <h3 className="font-display text-base sm:text-lg font-bold text-ink">
              Where does your support go?
            </h3>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-ink-3">
            Every rupee contributed directly sustains independent open-source development.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl sm:rounded-2xl border border-rule/70 bg-card-subtle/60 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-ink font-bold text-xs sm:text-sm">
                <Server className="h-4 w-4 text-primary shrink-0" />
                <span>Hosting &amp; Storage</span>
              </div>
              <p className="mt-1.5 text-xs text-ink-2 leading-relaxed">
                Powers Cloudflare R2 storage for fast, reliable global APK downloads and real-time in-app update checks.
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-rule/70 bg-card-subtle/60 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-ink font-bold text-xs sm:text-sm">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>100% Ad &amp; Tracker Free</span>
              </div>
              <p className="mt-1.5 text-xs text-ink-2 leading-relaxed">
                Guarantees zero commercial advertising, zero tracking SDKs, and zero monetization of user listening data.
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-rule/70 bg-card-subtle/60 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-ink font-bold text-xs sm:text-sm">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span>Active Native Dev</span>
              </div>
              <p className="mt-1.5 text-xs text-ink-2 leading-relaxed">
                Enables ongoing improvements to the Kotlin engine, real 10-band equalizer, synced lyrics, and liquid glass UI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Sheet>
  )
}
