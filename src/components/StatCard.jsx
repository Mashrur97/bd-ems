import CountUp from "./CountUp";

export default function StatCard({ icon, value, label, color, border, isPercent, isString }) {
  return (
    <div className={`bg-white/[0.03] border ${border} rounded-2xl p-4 md:p-5 text-center`}>
      <div className="flex justify-center mb-2">{icon}</div>
      {isString ? (
        <div className={`font-mono text-2xl font-bold ${color}`}>{value}</div>
      ) : (
        <div className={`font-mono text-2xl font-bold ${color}`}>
          <CountUp
            end={parseFloat(value) || 0}
            decimals={isPercent ? 1 : 0}
            suffix={isPercent ? "%" : ""}
          />
        </div>
      )}
      <div className="text-[10px] text-white/30 tracking-widest mt-1">{label}</div>
    </div>
  );
}