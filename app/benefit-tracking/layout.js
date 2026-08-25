import SectionMenu from '@/components/benefit-tracking/SectionMenu';

export default function BenefitTrackingLayout({ children }) {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Benefit Tracking</h1>
        <p className="text-gray-500 text-sm">
          Reporte de valores das equipas em projeto.
        </p>
      </div>
      <SectionMenu />
      <div>{children}</div>
    </div>
  );
}
