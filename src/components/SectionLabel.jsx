export default function SectionLabel({ index, children, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full bg-primary-pill px-3.5 py-1 text-xs font-semibold text-primary-pill-text ${className}`}>
      {index != null && (
        <span className="font-mono text-[0.6875rem] font-bold opacity-80">
          0{index}
        </span>
      )}
      <span className="uppercase tracking-wider font-mono text-[0.6875rem]">
        {children}
      </span>
    </div>
  )
}
