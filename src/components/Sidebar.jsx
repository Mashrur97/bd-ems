export default function Sidebar({ items, active, onSelect, accentColor, officer }) {
  return (
    <>
      {/* mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-white/10 backdrop-blur">
        <div className="flex">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex-1 flex flex-col items-center py-3 gap-1 text-[10px] transition-all"
              style={{ color: active === item.id ? accentColor : "rgba(255,255,255,0.3)" }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="truncate w-full text-center px-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* desktop sidebar */}
      <div className="hidden md:flex w-52 bg-black/40 border-r border-white/[0.07] flex-col flex-shrink-0">
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
      </div>
    </>
  );
}