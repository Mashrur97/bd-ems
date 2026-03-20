import { useElection } from "../store/ElectionContext";
import { CANDIDATES } from "../data/mockData";

export default function VoteBar() {
  const { votes, pct } = useElection();
  const sorted = [...CANDIDATES].sort((a, b) => votes[b.id] - votes[a.id]);

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((c) => (
        <div key={c.id}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-white/70">{c.symbol} {c.name} <span className="text-white/30 text-xs">({c.party})</span></span>
            <span className="font-mono text-yellow-400 text-xs font-bold">
              {votes[c.id].toLocaleString()} <span className="text-white/30">{pct(c.id)}%</span>
            </span>
          </div>
          <div className="bg-white/[0.07] rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct(c.id)}%`, background: c.color, boxShadow: `0 0 10px ${c.color}55` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}