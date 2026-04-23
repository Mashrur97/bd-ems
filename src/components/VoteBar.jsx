import { useElection } from "../store/ElectionContext";

export default function VoteBar() {
  const { votes, candidates, pct } = useElection();

  if (candidates.length === 0) {
    return <div className="text-white/30 text-sm text-center py-4">Loading results...</div>;
  }

  const sorted = [...candidates].sort(
    (a, b) => (votes[b.candidateId] || 0) - (votes[a.candidateId] || 0),
  );

  return (
    <div className="flex flex-col gap-4">
      {sorted.map((c) => (
        <div key={c.candidateId}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-white/70">
              {c.symbol} {c.name}{" "}
              <span className="text-white/30 text-xs">({c.party})</span>
            </span>
            <span className="font-mono text-yellow-400 text-xs font-bold">
              {(votes[c.candidateId] || 0).toLocaleString()}{" "}
              <span className="text-white/30">{pct(c.candidateId)}%</span>
            </span>
          </div>
          <div className="bg-white/[0.07] rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${pct(c.candidateId)}%`,
                background: c.color,
                boxShadow: `0 0 10px ${c.color}55`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
