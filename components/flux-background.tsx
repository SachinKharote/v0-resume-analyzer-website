export function FluxBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="flux-orb absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="flux-orb-delay absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      <div className="flux-orb-slow absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-3/8 blur-[100px]" />
    </div>
  )
}
