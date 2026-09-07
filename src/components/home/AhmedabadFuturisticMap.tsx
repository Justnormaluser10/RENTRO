import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle } from '../../types';
import { Button } from '../ui/Button';
import { 
  Compass, 
  ArrowRight, 
  RotateCcw, 
  Sparkles,
  Search
} from 'lucide-react';

interface AhmedabadFuturisticMapProps {
  vehicles: Vehicle[];
  onSelectHub: (hubId: string) => void;
}

export interface AhmedabadMapNode {
  id: string;
  name: string;
  subname: string;
  lat: number;
  lng: number;
  type: 'hub' | 'landmark' | 'locality';
  zone: 'West Ahmedabad' | 'South-West' | 'Central' | 'North' | 'East' | 'Waterfront';
  highlight: string;
  hubId?: string;
  category?: string;
}

// -------------------------------------------------------------
// FULL AHMEDABAD URBAN EXTENT: 22 LOCALITIES + 8 LANDMARKS
// 100% geographically real coordinates across Ahmedabad
// -------------------------------------------------------------
export const AHMEDABAD_MAP_NODES: AhmedabadMapNode[] = [
  // --- 1. MOBILITY HUBS (Rentro Active Pickup Hubs) ---
  {
    id: 'sg-highway',
    name: 'S.G. Highway',
    subname: 'Bodakdev & ISCON Junction',
    lat: 23.0285,
    lng: 72.5074,
    type: 'hub',
    zone: 'West Ahmedabad',
    highlight: '6-Lane Arterial Highway • Fast access to Gandhinagar & Sanand',
    hubId: 'ahmedabad-sg-highway',
  },
  {
    id: 'prahlad-nagar',
    name: 'Prahlad Nagar',
    subname: 'Corporate Road Corridor',
    lat: 23.0125,
    lng: 72.5108,
    type: 'hub',
    zone: 'South-West',
    highlight: 'High-end tech corporate towers, retail & food avenues',
    hubId: 'ahmedabad-prahlad-nagar',
  },
  {
    id: 'vastrapur',
    name: 'Vastrapur',
    subname: 'Vastrapur Lake & Ahmedabad One',
    lat: 23.0350,
    lng: 72.5290,
    type: 'hub',
    zone: 'West Ahmedabad',
    highlight: 'Vibrant student, lakefront & premier shopping district',
    hubId: 'ahmedabad-vastrapur',
  },
  {
    id: 'navrangpura',
    name: 'Navrangpura',
    subname: 'C.G. Road & Gujarat University',
    lat: 23.0370,
    lng: 72.5610,
    type: 'hub',
    zone: 'Central',
    highlight: 'Commercial avenue linking historic and modern Ahmedabad',
    hubId: 'ahmedabad-navrangpura',
  },
  {
    id: 'airport',
    name: 'Airport Area (SVPI)',
    subname: 'Terminal 1 & 2 Arrivals, Hansol',
    lat: 23.0734,
    lng: 72.6266,
    type: 'hub',
    zone: 'North',
    highlight: '24x7 Domestic & International Airport Self-Drive Counter',
    hubId: 'ahmedabad-airport',
  },

  // --- 2. MAJOR AHMEDABAD LOCALITIES (Required) ---
  {
    id: 'bopal',
    name: 'Bopal',
    subname: 'SP Ring Road Junction',
    lat: 23.0338,
    lng: 72.4678,
    type: 'locality',
    zone: 'West Ahmedabad',
    highlight: 'Thriving residential hub on the western SP Ring Road',
  },
  {
    id: 'south-bopal',
    name: 'South Bopal',
    subname: 'Gala Gymkhana Corridor',
    lat: 23.0182,
    lng: 72.4635,
    type: 'locality',
    zone: 'West Ahmedabad',
    highlight: 'Modern residential sector connecting western countryside',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    subname: 'Ramdev Nagar & Shivranjani',
    lat: 23.0270,
    lng: 72.5250,
    type: 'locality',
    zone: 'West Ahmedabad',
    highlight: 'Prime residential & retail district between 132ft Road & SG Highway',
  },
  {
    id: 'bodakdev',
    name: 'Bodakdev',
    subname: 'Judges Bungalow Road',
    lat: 23.0380,
    lng: 72.5120,
    type: 'locality',
    zone: 'West Ahmedabad',
    highlight: 'Upscale residential neighborhood flanking S.G. Highway',
  },
  {
    id: 'thaltej',
    name: 'Thaltej',
    subname: 'Thaltej Cross Roads & Hebatpur',
    lat: 23.0530,
    lng: 72.5150,
    type: 'locality',
    zone: 'West Ahmedabad',
    highlight: 'Major transit node connecting SG Highway to northern suburbs',
  },
  {
    id: 'gota',
    name: 'Gota',
    subname: 'S.G. Highway North Corridor',
    lat: 23.0980,
    lng: 72.5350,
    type: 'locality',
    zone: 'North',
    highlight: 'Fast-growing high-rise corridor along northern SG Highway',
  },
  {
    id: 'chandkheda',
    name: 'Chandkheda',
    subname: 'Visat Gandhinagar Highway',
    lat: 23.1120,
    lng: 72.5850,
    type: 'locality',
    zone: 'North',
    highlight: 'Key northern transit gate connecting Ahmedabad to Gandhinagar',
  },
  {
    id: 'motera',
    name: 'Motera',
    subname: 'Sabarmati North River Corridor',
    lat: 23.0950,
    lng: 72.6020,
    type: 'locality',
    zone: 'North',
    highlight: 'Home to the iconic Narendra Modi colosseum & metro line',
  },
  {
    id: 'cg-road',
    name: 'C.G. Road',
    subname: 'Panchvati to Stadium Six Roads',
    lat: 23.0310,
    lng: 72.5570,
    type: 'locality',
    zone: 'Central',
    highlight: 'Iconic shopping, banking and luxury lifestyle boulevard',
  },
  {
    id: 'ashram-road',
    name: 'Ashram Road',
    subname: 'Central Sabarmati River Corridor',
    lat: 23.0385,
    lng: 72.5715,
    type: 'locality',
    zone: 'Central',
    highlight: 'Historic commercial thoroughfare parallel to western riverfront',
  },
  {
    id: 'paldi',
    name: 'Paldi',
    subname: 'NID & Sanskar Kendra Area',
    lat: 23.0140,
    lng: 72.5630,
    type: 'locality',
    zone: 'Central',
    highlight: 'Cultural heart with bridges connecting East & West Ahmedabad',
  },
  {
    id: 'maninagar',
    name: 'Maninagar',
    subname: 'Kankaria Lake South-East',
    lat: 22.9970,
    lng: 72.6050,
    type: 'locality',
    zone: 'East',
    highlight: 'Historic commercial & transit hub of South-Eastern Ahmedabad',
  },
  {
    id: 'shahibaug',
    name: 'Shahibaug',
    subname: 'Cantonment & Moti Shahi Mahal',
    lat: 23.0580,
    lng: 72.5950,
    type: 'locality',
    zone: 'North',
    highlight: 'Historic royal quarter connecting central city to the airport',
  },
  {
    id: 'naroda',
    name: 'Naroda',
    subname: 'Eastern Industrial & Transit Hub',
    lat: 23.0780,
    lng: 72.6580,
    type: 'locality',
    zone: 'East',
    highlight: 'Major industrial corridor on the eastern SP Ring Road',
  },
  {
    id: 'nikol',
    name: 'Nikol',
    subname: 'Nikol-Naroda Ring Road',
    lat: 23.0450,
    lng: 72.6680,
    type: 'locality',
    zone: 'East',
    highlight: 'Dynamic modern residential and commercial zone in East Ahmedabad',
  },
  {
    id: 'memnagar',
    name: 'Memnagar',
    subname: 'Helmet Cross Road & Subhash Chowk',
    lat: 23.0500,
    lng: 72.5380,
    type: 'locality',
    zone: 'West Ahmedabad',
    highlight: 'Central residential area flanked by 132ft Ring Road & Drive-In',
  },
  {
    id: 'science-city-area',
    name: 'Science City Area',
    subname: 'Science City Road Corridor',
    lat: 23.0780,
    lng: 72.4980,
    type: 'locality',
    zone: 'West Ahmedabad',
    highlight: 'Rapidly emerging tech and innovation avenue off SG Highway',
  },

  // --- 3. IMPORTANT AHMEDABAD LANDMARKS (Required) ---
  {
    id: 'sabarmati-riverfront',
    name: 'Sabarmati Riverfront',
    subname: 'Promenade & Waterfront Boulevards',
    lat: 23.0305,
    lng: 72.5760,
    type: 'landmark',
    zone: 'Waterfront',
    highlight: 'Premier 11.5 km illuminated river boulevard & sunset promenade',
  },
  {
    id: 'atal-bridge',
    name: 'Atal Bridge',
    subname: 'Ellis Bridge - Sardar Bridge Riverfront',
    lat: 23.0226,
    lng: 72.5746,
    type: 'landmark',
    zone: 'Waterfront',
    highlight: 'Spectacular multi-hued illuminated pedestrian suspension bridge',
  },
  {
    id: 'sabarmati-ashram',
    name: 'Sabarmati Ashram',
    subname: 'Mahatma Gandhi Marg, Vadaj',
    lat: 23.0598,
    lng: 72.5808,
    type: 'landmark',
    zone: 'Waterfront',
    highlight: 'Historic national landmark and tranquil riverbank sanctuary',
  },
  {
    id: 'kankaria-lake',
    name: 'Kankaria Lake',
    subname: 'Historic Reservoir & Nagina Wadi',
    lat: 23.0062,
    lng: 72.6025,
    type: 'landmark',
    zone: 'East',
    highlight: 'Iconic 15th-century polygonal lake with island garden palace',
  },
  {
    id: 'narendra-modi-stadium',
    name: 'Narendra Modi Stadium',
    subname: 'Motera, Northern Riverbank',
    lat: 23.0919,
    lng: 72.5975,
    type: 'landmark',
    zone: 'North',
    highlight: 'The world’s largest cricket stadium with 132,000 seating capacity',
  },
  {
    id: 'science-city-landmark',
    name: 'Gujarat Science City',
    subname: 'Robotics & Aquatic Gallery',
    lat: 23.0786,
    lng: 72.4975,
    type: 'landmark',
    zone: 'West Ahmedabad',
    highlight: 'Futuristic robotics gallery, nature park & IMAX dome theatre',
  },
  {
    id: 'sarkhej-roza',
    name: 'Sarkhej Roza',
    subname: 'Southern SG Highway, Sarkhej',
    lat: 22.9805,
    lng: 72.5020,
    type: 'landmark',
    zone: 'South-West',
    highlight: 'The Acropolis of Ahmedabad — elegant tomb & tranquil ancient tank',
  },
  {
    id: 'adalaj-stepwell',
    name: 'Adalaj Stepwell',
    subname: 'Rudabai Stepwell, Gandhinagar Highway',
    lat: 23.1667,
    lng: 72.5800,
    type: 'landmark',
    zone: 'North',
    highlight: '5-storey subterranean 15th-century Solanki sandstone stepwell marvel',
  },
];

// -------------------------------------------------------------
// REAL AHMEDABAD TRANSPORTATION CORRIDORS (Real Geographic Coordinates)
// -------------------------------------------------------------

// 1. Sabarmati River Flow Corridor (True river path through Ahmedabad)
const SABARMATI_RIVER_PATH: [number, number][] = [
  [23.150, 72.605],
  [23.120, 72.602],
  [23.095, 72.599],
  [23.075, 72.592],
  [23.060, 72.583],
  [23.045, 72.576],
  [23.030, 72.575],
  [23.022, 72.574],
  [23.010, 72.571],
  [22.990, 72.565],
  [22.960, 72.553],
];

// 2. S.G. Highway (Sarkhej - Gandhinagar Highway NH 147 - Premier 6-lane spine)
const SG_HIGHWAY_PATH: [number, number][] = [
  [22.9805, 72.5020], // Sarkhej Roza
  [23.0000, 72.5040], // Makarba
  [23.0125, 72.5080], // Prahlad Nagar
  [23.0285, 72.5074], // ISCON / Bodakdev
  [23.0530, 72.5150], // Thaltej
  [23.0980, 72.5350], // Gota
  [23.1350, 72.5450], // Vaishnodevi Circle
  [23.1667, 72.5800], // Adalaj
];

// 3. Sardar Patel Ring Road (Outer Perimeter NH 147A - Full Loop circumscribing Ahmedabad)
const SP_RING_ROAD_PATH: [number, number][] = [
  [23.1350, 72.5450], // Vaishnodevi Circle (North-West)
  [23.0850, 72.4850], // Ognaj / Science City
  [23.0350, 72.4650], // Bopal Cross Roads
  [23.0150, 72.4630], // South Bopal
  [22.9750, 72.4780], // Sanand Circle
  [22.9650, 72.5000], // Sanathal / Sarkhej South
  [22.9300, 72.5700], // Kamod / Aslali (South)
  [22.9400, 72.6300], // Bareja / Vatva South
  [23.0000, 72.6650], // Ramol / Vastral
  [23.0450, 72.6850], // Nikol (East)
  [23.0900, 72.6800], // Naroda Muthiya
  [23.1100, 72.6450], // Bhat / Airport North
  [23.1400, 72.6150], // Koba Circle / Gandhinagar
  [23.1350, 72.5450], // Back to Vaishnodevi Circle
];

// 4. 132 Feet Ring Road (Inner Arterial Loop)
const INNER_RING_ROAD_PATH: [number, number][] = [
  [23.0750, 72.5750], // Ranip / Subhash Bridge
  [23.0650, 72.5550], // Akhbarnagar
  [23.0550, 72.5450], // Naranpura
  [23.0500, 72.5380], // Helmet / Memnagar
  [23.0320, 72.5300], // Vastrapur / IIM
  [23.0200, 72.5300], // Shivranjani
  [23.0090, 72.5300], // Shyamal Cross Road
  [22.9980, 72.5400], // Jivraj Park
  [22.9900, 72.5550], // APMC / Vasna
  [22.9920, 72.5700], // Anjali Bridge
  [22.9900, 72.5950], // Chandranagar / Maninagar
  [23.0062, 72.6025], // Kankaria Lake
  [23.0350, 72.6100], // Gomtipur / Saraspur
  [23.0750, 72.5750], // Back to Ranip
];

export const AhmedabadFuturisticMap: React.FC<AhmedabadFuturisticMapProps> = ({
  vehicles,
  onSelectHub,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  const [activeFilter, setActiveFilter] = useState<'all' | 'hub' | 'landmark' | 'locality'>('all');
  const [activeNodeId, setActiveNodeId] = useState<string>('sg-highway');
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [selectedSearchVal, setSelectedSearchVal] = useState<string>('');

  const activeNode = useMemo(() => {
    return AHMEDABAD_MAP_NODES.find((n) => n.id === activeNodeId) || AHMEDABAD_MAP_NODES[0];
  }, [activeNodeId]);

  // Real inventory availability calculation (never fake)
  const availableVehiclesCount = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return 0;
    if (activeNode.hubId) {
      return vehicles.filter((v) => v.location_id === activeNode.hubId && v.status === 'AVAILABLE').length;
    }
    return 0;
  }, [vehicles, activeNode]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (activeFilter === 'all') return AHMEDABAD_MAP_NODES;
    return AHMEDABAD_MAP_NODES.filter((n) => n.type === activeFilter);
  }, [activeFilter]);

  // Initialize Leaflet Map with OpenStreetMap CartoDB Dark Matter tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Central Ahmedabad center coordinates
    const initialCenter: [number, number] = [23.032, 72.545];
    const initialZoom = 12;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 10,
      maxZoom: 17,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Free OpenStreetMap CartoDB Dark Matter tile layer (No API key, zero cost)
    const cartoDarkTile = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 19,
      }
    );
    cartoDarkTile.addTo(map);

    // Render 1: Sabarmati River Neon Flow Corridor
    const riverPolyline = L.polyline(SABARMATI_RIVER_PATH, {
      color: '#06b6d4',
      weight: 6,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    });
    riverPolyline.addTo(map);

    // Render 2: S.G. Highway (NH 147) Glowing Spine
    const sgPolyline = L.polyline(SG_HIGHWAY_PATH, {
      color: '#00f2aa',
      weight: 4.5,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    });
    sgPolyline.addTo(map);

    // Render 3: S.P. Ring Road (NH 147A) Outer Perimeter
    const spRingPolyline = L.polyline(SP_RING_ROAD_PATH, {
      color: '#38bdf8',
      weight: 2.5,
      opacity: 0.65,
      dashArray: '8, 8',
    });
    spRingPolyline.addTo(map);

    // Render 4: 132 Feet Ring Road Inner Arterial
    const innerRingPolyline = L.polyline(INNER_RING_ROAD_PATH, {
      color: '#10b981',
      weight: 2,
      opacity: 0.6,
      dashArray: '5, 6',
    });
    innerRingPolyline.addTo(map);

    // Kankaria Lake Circular Water Highlight
    const kankariaCircle = L.circle([23.0062, 72.6025], {
      color: '#06b6d4',
      fillColor: '#0891b2',
      fillOpacity: 0.5,
      radius: 420,
      weight: 2,
    });
    kankariaCircle.addTo(map);

    setIsMapLoaded(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleFocusLocation = (node: AhmedabadMapNode) => {
    setActiveNodeId(node.id);
    setSelectedSearchVal(node.id);
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([node.lat, node.lng], Math.max(map.getZoom(), 13), {
        duration: 1.0,
        easeLinearity: 0.25,
      });
    }
  };

  // Update Markers when filter or active node changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !isMapLoaded) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    filteredNodes.forEach((node) => {
      const isSelected = activeNodeId === node.id;

      // Color scheme based on category
      const colorBg = node.type === 'hub' ? '#00f2aa' : node.type === 'landmark' ? '#38bdf8' : '#94a3b8';
      const glowColor = node.type === 'hub' ? 'rgba(0, 242, 170, 0.4)' : node.type === 'landmark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.3)';

      const markerHtml = `
        <div class="relative flex items-center justify-center group cursor-pointer" style="width: 32px; height: 32px;">
          <!-- Outer Radar Pulse Wave -->
          <div class="absolute inset-0 rounded-full animate-radar-pulse" style="background-color: ${glowColor};"></div>
          
          <!-- Outer active target reticle if selected -->
          ${isSelected ? `
            <div class="absolute -inset-1.5 rounded-full border-2 border-[#00f2aa] animate-ping opacity-75"></div>
            <div class="absolute -inset-2.5 rounded-full border border-[#00f2aa]/40"></div>
          ` : ''}

          <!-- Center Node Dot -->
          <div class="relative z-10 w-3.5 h-3.5 rounded-full border-2 border-[#07080c] shadow-lg transition-transform group-hover:scale-125" style="background-color: ${colorBg};"></div>
          
          <!-- Label Tooltip -->
          <div class="absolute top-5 z-20 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight bg-[#0e111a]/95 text-white border border-white/15 pointer-events-none shadow-xl ${isSelected ? 'border-[#00f2aa] text-[#00f2aa]' : 'opacity-85'}">
            ${node.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([node.lat, node.lng], { icon: customIcon });
      
      marker.on('click', () => {
        handleFocusLocation(node);
      });

      marker.addTo(map);
      markersRef.current[node.id] = marker;
    });
  }, [filteredNodes, activeNodeId, isMapLoaded]);

  const handleResetAhmedabadBounds = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([23.032, 72.545], 12, { duration: 1.0 });
    }
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleHubSelect = (node: AhmedabadMapNode) => {
    if (node.hubId) {
      onSelectHub(node.hubId);
    } else {
      onSelectHub('ahmedabad-sg-highway');
    }
  };

  return (
    <section className="py-20 bg-[#07080c] border-b border-white/5 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#00f2aa]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#00f2aa]/10 border border-[#00f2aa]/25 px-3.5 py-1 text-xs font-bold text-[#00f2aa]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Full Ahmedabad Urban Mobility Grid • OpenStreetMap</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Explore Ahmedabad Coverage
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              True geographic cartography covering all 22 major Ahmedabad localities, the illuminated Sabarmati Riverfront, Sardar Patel Ring Road, and premier self-drive mobility hubs.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#121623] rounded-2xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#00f2aa] text-slate-950 font-black shadow-md shadow-[#00f2aa]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Grid ({AHMEDABAD_MAP_NODES.length})
            </button>
            <button
              onClick={() => setActiveFilter('hub')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'hub'
                  ? 'bg-[#00f2aa] text-slate-950 font-black shadow-md shadow-[#00f2aa]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mobility Hubs (5)
            </button>
            <button
              onClick={() => setActiveFilter('landmark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'landmark'
                  ? 'bg-[#00f2aa] text-slate-950 font-black shadow-md shadow-[#00f2aa]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Landmarks (8)
            </button>
            <button
              onClick={() => setActiveFilter('locality')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'locality'
                  ? 'bg-[#00f2aa] text-slate-950 font-black shadow-md shadow-[#00f2aa]/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Localities (17)
            </button>
          </div>
        </div>

        {/* Quick Locality Jump Selector & Highway Badges Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-[#0e111a] p-3 sm:px-4 rounded-2xl border border-white/10 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search className="w-4 h-4 text-[#00f2aa] shrink-0" />
            <span className="text-slate-400 font-semibold shrink-0">Jump to Area:</span>
            <select
              value={selectedSearchVal}
              onChange={(e) => {
                const node = AHMEDABAD_MAP_NODES.find((n) => n.id === e.target.value);
                if (node) handleFocusLocation(node);
              }}
              className="bg-[#141824] text-white border border-white/10 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#00f2aa] cursor-pointer w-full sm:w-64"
            >
              <option value="">Select Ahmedabad Location...</option>
              {AHMEDABAD_MAP_NODES.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} ({n.zone})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#00f2aa] rounded-full"></span>
              <span>S.G. Highway (NH 147)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#38bdf8] rounded-full"></span>
              <span>S.P. Ring Road</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#06b6d4] rounded-full"></span>
              <span>Sabarmati River</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#10b981] rounded-full"></span>
              <span>132ft Ring Road</span>
            </div>
          </div>
        </div>

        {/* Interactive Map Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Map Box (8 cols) */}
          <div className="lg:col-span-8 bg-[#090b12] rounded-3xl border border-white/10 p-3 relative overflow-hidden shadow-2xl">
            
            {/* Map Container */}
            <div
              ref={mapContainerRef}
              className="w-full h-[520px] rounded-2xl overflow-hidden relative z-10"
            />

            {/* Custom On-Map Zoom & View Controls */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="w-9 h-9 rounded-xl bg-[#0e111a]/90 backdrop-blur-md border border-white/15 text-white hover:bg-[#00f2aa] hover:text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg transition-all cursor-pointer"
                title="Zoom in"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="w-9 h-9 rounded-xl bg-[#0e111a]/90 backdrop-blur-md border border-white/15 text-white hover:bg-[#00f2aa] hover:text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg transition-all cursor-pointer"
                title="Zoom out"
              >
                −
              </button>
              <button
                onClick={handleResetAhmedabadBounds}
                className="w-9 h-9 rounded-xl bg-[#0e111a]/90 backdrop-blur-md border border-white/15 text-white hover:bg-[#00f2aa] hover:text-slate-950 flex items-center justify-center shadow-lg transition-all cursor-pointer"
                title="Reset to Full Ahmedabad Extent"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* OpenStreetMap Attribution & Status Badge */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
              <div className="rounded-xl bg-[#07080c]/85 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] text-slate-400 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#00f2aa] animate-pulse"></span>
                <span>OpenStreetMap • Ahmedabad AUDA Extent</span>
              </div>
            </div>
          </div>

          {/* Right Column: Zone Telemetry HUD Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#0e111a] border border-white/10 p-6 rounded-3xl shadow-xl space-y-5 relative overflow-hidden">
              
              {/* Subtle card glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#00f2aa]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-white/5 relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00f2aa] font-bold">
                  ZONE TELEMETRY
                </span>
                <span className="text-[10px] font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  {activeNode.zone}
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeNode.type === 'hub' ? 'bg-[#00f2aa]' : activeNode.type === 'landmark' ? 'bg-[#38bdf8]' : 'bg-slate-400'
                    }`}
                  ></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {activeNode.type === 'hub' ? 'Rentro Mobility Hub' : activeNode.type === 'landmark' ? 'Iconic Landmark' : 'Urban Sector'}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {activeNode.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {activeNode.subname}
                </p>
              </div>

              {/* Real Inventory Status Indicator */}
              <div className="p-4 rounded-2xl bg-[#141824] border border-white/5 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Fleet Availability:</span>
                  <span className="font-bold text-[#00f2aa] font-mono">
                    {availableVehiclesCount > 0 ? `${availableVehiclesCount} Available` : 'Fleet Arriving'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {availableVehiclesCount > 0
                    ? `${availableVehiclesCount} verified self-drive cars and bikes are ready for instant reservation at this hub.`
                    : 'Adding real fleet vehicles in this Ahmedabad sector shortly. Rentro cars and bikes can be booked from any nearby hub with free city handover.'}
                </p>
              </div>

              {/* Highlight Note */}
              <div className="flex items-start gap-2.5 text-xs text-slate-300 relative z-10">
                <Compass className="w-4 h-4 text-[#00f2aa] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeNode.highlight}</span>
              </div>

              {/* Action Button */}
              <div className="pt-2 relative z-10">
                <Button
                  size="lg"
                  onClick={() => handleHubSelect(activeNode)}
                  className="w-full font-bold text-xs bg-[#00f2aa] hover:bg-[#00d696] text-slate-950 shadow-lg shadow-[#00f2aa]/20 gap-2 py-3"
                >
                  <span>{activeNode.hubId ? `Select ${activeNode.name} Hub` : `Explore Vehicles in ${activeNode.name}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Area Filter Chips */}
            <div className="bg-[#0e111a] border border-white/5 p-4 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Popular Ahmedabad Localities
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                {AHMEDABAD_MAP_NODES.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleFocusLocation(node)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      activeNodeId === node.id
                        ? 'bg-[#00f2aa] text-slate-950 font-bold shadow-sm'
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

export default AhmedabadFuturisticMap;
