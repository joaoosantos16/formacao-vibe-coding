import SectionMenu from '@/components/benefit-tracking/SectionMenu';

export default function BenefitTrackingKaizenLayout({ children }) {
  return (
    <div className="py-8 space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Benefit Tracking Kaizen</h1>
        <p className="text-slate-500 text-sm">Reporting on project team figures.</p>
      </div>
      <SectionMenu />
      <div>{children}</div>
    </div>
  );
}
