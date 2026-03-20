export default function Sidebar({ items, active, onSelect, accentColor, officer, onLogout }) {
  return (
    <div className="w-52 bg-black/40 border-r border-white/[0.07] flex flex-col flex-shrink-0 min-h-full">
      <div className="p-4 border-b border-white/[0.07] mb-2">
        <div className="text-xs font-bold tracking-widest mb-1" style={{ color: accentColor }}>
          {officer?.name}
        </div>
        <div className="text-[10px] text-white/25">{officer?.id}</div>
      </div>

      <div className="flex flex-col flex-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="flex items-center gap-3 px-4 py-3 text-sm transition-all text-left border-l-2"
            style={{
              color: active === item.id ? accentColor : "rgba(255,255,255,0.4)",
              borderLeftColor: active === item.id ? accentColor : "transparent",
              background: active === item.id ? accentColor + "12" : "transparent",
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-3">
        <button
          onClick={onLogout}
          className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs hover:bg-red-500/20 transition-all"
        >← Logout</button>
      </div>
    </div>
  );
}