import React, { useState, useMemo } from 'react';
import { Vehicle } from '../../types';
import { useBooking } from '../../context/BookingContext';
import { Button } from '../ui/Button';
import { MapPin, Navigation, Sparkles, Compass, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

interface AhmedabadFuturisticMapProps {
  vehicles: Vehicle[];
  onSelectHub: (hubId: string) => void;
}

interface MapNode {
  id: string;
  name: string;
  subname: string;
  x: number; // SVG coordinate
  y: number; // SVG coordinate
  type: 'hub' | 'pickup_point';
  zone: string;
  highlight: string;
  hubId: string;
}

const AHMEDABAD_NODES: MapNode[] = [
  {
    id: 'sg-highway',
    name: 'S.G. Highway',
    subname: 'Bodakdev & ISCON Junction',
    x: 180,
    y: 260,
    type: 'hub',
    zone: 'West Ahmedabad',
    highlight: '6-Lane Arterial • Fast Highway Access',
    hubId: 'ahmedabad-sg-highway',
  },
  {
    id: 'prahlad-nagar',
    name: 'Prahlad Nagar',
    subname: 'Corporate Road Corridor',
    x: 190,
    y: 360,
    type: 'hub',
    zone: 'South-West Hub',
    highlight: 'Tech & Business District',
    hubId: 'ahmedabad-prahlad-nagar',
  },
  {
    id: 'vastrapur',
    name: 'Vastrapur & Satellite',
    subname: 'Vastrapur Lake / Ahmedabad One',
    x: 240,
    y: 270,
    type: 'hub',
    zone: 'West-Central',
    highlight: 'Central Lifestyle & Leisure',
    hubId: 'ahmedabad-vastrapur',
  },
  {
    id: 'navrangpura',
    name: 'Navrangpura & C.G. Road',
    subname: 'Municipal Market Corridor',
    x: 315,
    y: 250,
    type: 'hub',
    zone: 'Central City',
    highlight: 'Commercial Heart of Ahmedabad',
    hubId: 'ahmedabad-navrangpura',
  },
  {
    id: 'thaltej-science-city',
    name: 'Thaltej & Science City',
    subname: 'Ring Road Northern Exit',
    x: 160,
    y: 180,
    type: 'pickup_point',
    zone: 'North-West',
    highlight: 'Gateway to Gandhinagar & Thol',
    hubId: 'ahmedabad-sg-highway',
  },
  {
    id: 'bopal',
    name: 'Bopal & South Bopal',
    subname: 'SP Ring Road Junction',
    x: 110,
    y: 280,
    type: 'pickup_point',
    zone: 'Far West',
    highlight: 'Residential Hub & Sanand Road',
    hubId: 'ahmedabad-sg-highway',
  },
  {
    id: 'motera',
    name: 'Motera (Narendra Modi Stadium)',
    subname: 'Stadium Metro Corridor',
    x: 355,
    y: 130,
    type: 'pickup_point',
    zone: 'North Ahmedabad',
    highlight: 'World’s Largest Cricket Stadium',
    hubId: 'ahmedabad-airport',
  },
  {
    id: 'airport',
    name: 'SVPI Airport Hub',
    subname: 'Terminal 1 & 2 Arrivals',
    x: 435,
    y: 150,
    type: 'hub',
    zone: 'North-East Hub',
    highlight: '24x7 Flight Pickup Counter',
    hubId: 'ahmedabad-airport',
  },
  {
    id: 'riverfront',
    name: 'Sabarmati Riverfront',
    subname: 'Atal Bridge & Ashram Road',
    x: 335,
    y: 290,
    type: 'pickup_point',
    zone: 'Waterfront Zone',
    highlight: 'Scenic River Boulevard Cruise',
    hubId: 'ahmedabad-navrangpura',
  },
  {
    id: 'maninagar',
    name: 'Maninagar & Kankaria',
    subname: 'Kankaria Lakefront South',
    x: 390,
    y: 370,
    type: 'pickup_point',
    zone: 'South-East',
    highlight: 'Heritage Lake Promenade',
    hubId: 'ahmedabad-navrangpura',
  },
];

export const AhmedabadFuturisticMap: React.FC<AhmedabadFuturisticMapProps> = ({
  vehicles,
  onSelectHub,
}) => {
  const { updateSearch } = useBooking();
  const [activeNodeId, setActiveNodeId] = useState<string>('sg-highway');

  const activeNode = useMemo(() => {
    return AHMEDABAD_NODES.find((n) => n.id === activeNodeId) || AHMEDABAD_NODES[0];
  }, [activeNodeId]);

  // Real available vehicles for active hub
  const availableVehiclesCount = useMemo(() => {
    return vehicles.filter(
      (v) => v.location_id === activeNode.hubId && v.status === 'AVAILABLE'
    ).length;
  }, [vehicles, activeNode]);

  const handleChooseLocation = (node: MapNode) => {
    setActiveNodeId(node.id);
    updateSearch({ pickupLocationId: node.hubId, returnLocationId: node.hubId });
    onSelectHub(node.hubId);
  };

  return (
    <section className="py-20 bg-[#07080c] relative overflow-hidden border-b border-white/5">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Mobility Grid</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Rentro in Ahmedabad
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From S.G. Highway and Prahlad Nagar to the Sabarmati Riverfront and Motera Stadium, pick up self-drive rides across the city.
          </p>
        </div>

        {/* Futuristic Map Canvas & HUD Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left / Center Map Visual (8 cols) */}
          <div className="lg:col-span-8 relative bg-[#0b0e17] rounded-3xl border border-white/10 p-4 sm:p-8 shadow-2xl overflow-hidden group">
            
            {/* Top Grid HUD Overlay elements */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-3 border-b border-white/5 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-emerald-400 font-bold">GRID STATUS: ACTIVE</span>
              </div>
              <span>AHMEDABAD (23.0225° N, 72.5714° E)</span>
            </div>

            {/* SVG Ahmedabad Map Canvas */}
            <div className="relative w-full aspect-16/10 sm:aspect-16/11 select-none">
              <svg
                viewBox="0 0 540 450"
                className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  </pattern>

                  {/* River Gradient Glow */}
                  <linearGradient id="riverGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#00f2aa" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Neon Road Filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Subtle Background Grid */}
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* --- AHMEDABAD ROAD NETWORK --- */}
                
                {/* 1. Sardar Patel (S.P.) Ring Road - Outer Perimeter */}
                <ellipse
                  cx="270"
                  cy="240"
                  rx="240"
                  ry="190"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* 2. 132 Feet Ring Road - Inner Arterial Ring */}
                <ellipse
                  cx="275"
                  cy="250"
                  rx="140"
                  ry="110"
                  fill="none"
                  stroke="rgba(0,242,170,0.2)"
                  strokeWidth="1.5"
                />

                {/* 3. S.G. Highway (Sarkhej - Gandhinagar Highway) */}
                <path
                  d="M 140 80 L 180 250 L 205 420"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  filter="url(#glow)"
                />

                {/* 4. Ashram Road (Central River Corridor) */}
                <path
                  d="M 310 110 L 325 240 L 335 380"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                />

                {/* 5. Airport Road & Naroda Corridor */}
                <path
                  d="M 330 200 L 440 150 L 490 220"
                  fill="none"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                />

                {/* 6. East-West Connectors (Drive-In, SG to CG Road) */}
                <path d="M 120 280 L 330 270 L 460 290" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <path d="M 160 180 L 310 200 L 440 180" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <path d="M 190 360 L 330 350 L 420 380" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

                {/* --- SABARMATI RIVER (Luminous Flow through Center) --- */}
                <path
                  d="M 360 40 C 340 100, 315 170, 335 240 C 350 290, 330 370, 350 440"
                  fill="none"
                  stroke="url(#riverGlow)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* River Flow Label */}
                <text x="350" y="70" fill="#06b6d4" fontSize="9" fontFamily="monospace" letterSpacing="2" opacity="0.8">
                  SABARMATI RIVER
                </text>

                {/* Atal Bridge Indicator */}
                <circle cx="335" cy="275" r="4" fill="#00f2aa" />
                <text x="345" y="278" fill="#ffffff" fontSize="8" fontFamily="sans-serif" opacity="0.7">
                  Atal Bridge
                </text>

                {/* --- INTERACTIVE LOCATION NODES --- */}
                {AHMEDABAD_NODES.map((node) => {
                  const isSelected = activeNodeId === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={() => handleChooseLocation(node)}
                      className="cursor-pointer group/node"
                    >
                      {/* Outer pulse wave */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 16 : 8}
                        fill={isSelected ? 'rgba(0, 242, 170, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
                        className={isSelected ? 'animate-ping' : ''}
                      />

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 7 : node.type === 'hub' ? 5.5 : 4}
                        fill={isSelected ? '#00f2aa' : node.type === 'hub' ? '#10b981' : '#64748b'}
                        stroke="#07080c"
                        strokeWidth="2"
                        className="transition-all duration-200 group-hover/node:scale-125"
                      />

                      {/* Target Crosshairs for selected node */}
                      {isSelected && (
                        <>
                          <line x1={node.x - 14} y1={node.y} x2={node.x - 9} y2={node.y} stroke="#00f2aa" strokeWidth="1.5" />
                          <line x1={node.x + 9} y1={node.y} x2={node.x + 14} y2={node.y} stroke="#00f2aa" strokeWidth="1.5" />
                          <line x1={node.x} y1={node.y - 14} x2={node.x} y2={node.y - 9} stroke="#00f2aa" strokeWidth="1.5" />
                          <line x1={node.x} y1={node.y + 9} x2={node.x} y2={node.y + 14} stroke="#00f2aa" strokeWidth="1.5" />
                        </>
                      )}

                      {/* Node Label */}
                      <text
                        x={node.x}
                        y={node.y + (isSelected ? 18 : 14)}
                        fill={isSelected ? '#ffffff' : '#94a3b8'}
                        fontSize={isSelected ? '10' : '8.5'}
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        textAnchor="middle"
                        className="transition-colors pointer-events-none"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5 text-[11px] text-slate-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Mobility Hub</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  <span>Pickup Spot</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 rounded-full bg-cyan-400"></span>
                  <span>Sabarmati River</span>
                </div>
              </div>
              <span className="text-slate-500 italic hidden sm:inline">Click any node to focus zone</span>
            </div>
          </div>

          {/* Right Floating Cyberpunk HUD Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121623] border border-white/10 p-6 rounded-3xl shadow-xl space-y-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  ZONE TELEMETRY
                </span>
                <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                  {activeNode.zone}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  {activeNode.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeNode.subname}
                </p>
              </div>

              {/* Real inventory indicator */}
              <div className="p-3.5 rounded-2xl bg-[#090b11] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Live Available Vehicles:</span>
                  <span className="font-bold text-white font-mono">
                    {availableVehiclesCount > 0 ? `${availableVehiclesCount} Available` : 'Adding Vehicles'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {availableVehiclesCount > 0
                    ? 'Verified self-drive cars and bikes ready for instant pickup.'
                    : "We're adding real fleet vehicles in this Ahmedabad zone shortly."}
                </p>
              </div>

              {/* Highlight Note */}
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{activeNode.highlight}</span>
              </div>

              {/* Action Button */}
              <Button
                size="lg"
                onClick={() => handleChooseLocation(activeNode)}
                className="w-full font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 gap-2"
              >
                <span>Select {activeNode.name} as Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Quick Area Filter Pills for Mobile */}
            <div className="bg-[#121623]/80 border border-white/5 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Popular Ahmedabad Localities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AHMEDABAD_NODES.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleChooseLocation(node)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      activeNodeId === node.id
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {node.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
