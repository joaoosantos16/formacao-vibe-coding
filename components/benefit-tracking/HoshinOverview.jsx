import KpiRow from '@/components/benefit-tracking/hoshin/KpiRow';
import HoshinMeter from '@/components/benefit-tracking/hoshin/HoshinMeter';
import DeliveredChart from '@/components/benefit-tracking/hoshin/DeliveredChart';
import TeamTable from '@/components/benefit-tracking/hoshin/TeamTable';
import SecondaryKpis from '@/components/benefit-tracking/hoshin/SecondaryKpis';

export default function HoshinOverview() {
  return (
    <div className="grid grid-cols-1 items-start lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <KpiRow />
        <DeliveredChart />
        <TeamTable />
      </div>
      <div className="space-y-4">
        <HoshinMeter />
        <SecondaryKpis />
      </div>
    </div>
  );
}
