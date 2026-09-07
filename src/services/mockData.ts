import { Vehicle, Location, UserProfile, Booking, KYCDocument } from '../types';

// =========================================================
// AHMEDABAD PICKUP & RETURN MOBILITY HUBS
// =========================================================
export const INITIAL_LOCATIONS: Location[] = [
  {
    id: 'ahmedabad-sg-highway',
    name: 'SG Highway Mobility Hub',
    city: 'Ahmedabad',
    address: 'Near ISCON Cross Road, Bodakdev, SG Highway',
    landmark: 'Opposite ISCON Mega Mall',
    contact_phone: '+91 98765 43210',
    is_active: true,
  },
  {
    id: 'ahmedabad-prahlad-nagar',
    name: 'Prahlad Nagar Hub',
    city: 'Ahmedabad',
    address: 'Corporate Road, Near Prahlad Nagar Garden',
    landmark: 'Behind Titanium City Centre',
    contact_phone: '+91 98765 43211',
    is_active: true,
  },
  {
    id: 'ahmedabad-navrangpura',
    name: 'Navrangpura & C.G. Road Hub',
    city: 'Ahmedabad',
    address: 'Near Municipal Market, C.G. Road, Navrangpura',
    landmark: 'Near Samartheshwar Mahadev',
    contact_phone: '+91 98765 43212',
    is_active: true,
  },
  {
    id: 'ahmedabad-vastrapur',
    name: 'Vastrapur & Satellite Hub',
    city: 'Ahmedabad',
    address: 'Near Vastrapur Lake, Premchand Nagar Road',
    landmark: 'Near Ahmedabad One Mall',
    contact_phone: '+91 98765 43213',
    is_active: true,
  },
  {
    id: 'ahmedabad-airport',
    name: 'Ahmedabad Airport Hub (SVPI)',
    city: 'Ahmedabad',
    address: 'Airport Road, Near Terminal 1 / 2 Arrivals, Hansol',
    landmark: 'Sardar Vallabhbhai Patel International Airport',
    contact_phone: '+91 98765 43214',
    is_active: true,
  },
];

// =========================================================
// SEARCHABLE AHMEDABAD LOCALITIES & NEIGHBORHOODS
// =========================================================
export const AHMEDABAD_LOCALITIES = [
  { name: 'SG Highway', zone: 'West', popular: true, hubId: 'ahmedabad-sg-highway' },
  { name: 'Prahlad Nagar', zone: 'West', popular: true, hubId: 'ahmedabad-prahlad-nagar' },
  { name: 'Satellite', zone: 'West', popular: true, hubId: 'ahmedabad-vastrapur' },
  { name: 'Vastrapur', zone: 'West', popular: true, hubId: 'ahmedabad-vastrapur' },
  { name: 'Navrangpura', zone: 'Central', popular: true, hubId: 'ahmedabad-navrangpura' },
  { name: 'C.G. Road', zone: 'Central', popular: true, hubId: 'ahmedabad-navrangpura' },
  { name: 'Bodakdev', zone: 'West', popular: true, hubId: 'ahmedabad-sg-highway' },
  { name: 'Thaltej', zone: 'West', popular: true, hubId: 'ahmedabad-sg-highway' },
  { name: 'Bopal', zone: 'West', popular: true, hubId: 'ahmedabad-sg-highway' },
  { name: 'South Bopal', zone: 'West', popular: false, hubId: 'ahmedabad-sg-highway' },
  { name: 'Maninagar', zone: 'East / South', popular: true, hubId: 'ahmedabad-navrangpura' },
  { name: 'Paldi', zone: 'Central', popular: false, hubId: 'ahmedabad-navrangpura' },
  { name: 'Chandkheda', zone: 'North', popular: false, hubId: 'ahmedabad-airport' },
  { name: 'Motera (Narendra Modi Stadium)', zone: 'North', popular: true, hubId: 'ahmedabad-airport' },
  { name: 'Gota', zone: 'North-West', popular: false, hubId: 'ahmedabad-sg-highway' },
  { name: 'Ashram Road', zone: 'Central', popular: true, hubId: 'ahmedabad-navrangpura' },
  { name: 'Airport Road', zone: 'North-East', popular: true, hubId: 'ahmedabad-airport' },
  { name: 'Shahibaug', zone: 'Central-North', popular: false, hubId: 'ahmedabad-airport' },
  { name: 'Naroda', zone: 'East', popular: false, hubId: 'ahmedabad-airport' },
  { name: 'Nikol', zone: 'East', popular: false, hubId: 'ahmedabad-airport' },
  { name: 'Isanpur', zone: 'South', popular: false, hubId: 'ahmedabad-navrangpura' },
  { name: 'Vasna', zone: 'South-West', popular: false, hubId: 'ahmedabad-navrangpura' },
  { name: 'Memnagar', zone: 'West', popular: false, hubId: 'ahmedabad-vastrapur' },
];

// =========================================================
// ZERO DUMMY VEHICLES
// Admin will manually add real vehicles via Admin Portal
// =========================================================
export const INITIAL_VEHICLES: Vehicle[] = [];

// =========================================================
// AHMEDABAD TRIPS & SCENIC DESTINATIONS
// =========================================================
export interface AhmedabadTrip {
  id: string;
  name: string;
  tagline: string;
  description: string;
  area: string;
  distanceFromHub: string;
  driveTime: string;
  category: 'Urban Landmark' | 'Scenic Getaway' | 'Heritage' | 'Architecture';
  imageUrl: string;
  bestVehicle: 'Car or Bike' | 'SUV' | 'Sedan' | 'Cruiser Bike';
}

export const AHMEDABAD_TRIPS: AhmedabadTrip[] = [
  {
    id: 'sabarmati-riverfront',
    name: 'Sabarmati Riverfront & Atal Bridge',
    tagline: 'Iconic waterfront promenade & sunset cruising',
    description: 'An expansive riverfront boulevard stretching across central Ahmedabad. Experience the stunning multi-hued illumination of Atal Bridge and pristine river sunset drives.',
    area: 'Sabarmati West / Ashram Road',
    distanceFromHub: '8 km from SG Highway',
    driveTime: '~15 mins drive',
    category: 'Urban Landmark',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'Car or Bike',
  },
  {
    id: 'narendra-modi-stadium',
    name: 'Narendra Modi Stadium, Motera',
    tagline: 'The world’s largest cricket stadium',
    description: 'A breathtaking 132,000-seat architectural marvel in Motera. Perfect self-drive cruise along the 4D theatre river corridor and northern ring road.',
    area: 'Motera / Sabarmati North',
    distanceFromHub: '14 km from Bodakdev',
    driveTime: '~22 mins drive',
    category: 'Urban Landmark',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'Car or Bike',
  },
  {
    id: 'science-city',
    name: 'Gujarat Science City & Robotics Gallery',
    tagline: 'Futuristic robotics, aquatic gallery & nature park',
    description: 'A cutting-edge tech and science campus right off S.G. Highway featuring futuristic humanoid robotics galleries, life-sized animatronics, and massive dome theatres.',
    area: 'Science City Road, Off SG Highway',
    distanceFromHub: '5 km from Thaltej',
    driveTime: '~10 mins drive',
    category: 'Urban Landmark',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'SUV',
  },
  {
    id: 'adalaj-stepwell',
    name: 'Adalaj Stepwell (Rudabai Stepwell)',
    tagline: 'Intricate 15th-century Solanki architecture',
    description: 'A 5-storey subterranean stepwell marvel carved in sandstone with subterranean cool air, ornate octagonal shafts, and breathtaking Islamic-Hindu fusion motifs.',
    area: 'Adalaj / Gandhinagar Highway',
    distanceFromHub: '15 km from Bodakdev',
    driveTime: '~20 mins drive',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'Sedan',
  },
  {
    id: 'sarkhej-roza',
    name: 'Sarkhej Roza Architectural Complex',
    tagline: 'The Acropolis of Ahmedabad',
    description: 'An elegant tomb and palace complex surrounded by an ancient tranquil water reservoir. Revered by Le Corbusier as one of India’s purest architectural compositions.',
    area: 'Sarkhej, Southern SG Highway',
    distanceFromHub: '7 km from Prahlad Nagar',
    driveTime: '~12 mins drive',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'Car or Bike',
  },
  {
    id: 'thol-lake',
    name: 'Thol Bird Sanctuary & Lake',
    tagline: 'Serene sunrise birdwatching & open country drive',
    description: 'A freshwater lake surrounded by marshland that hosts over 150 species of migratory birds including flamingos and pelicans. One of Ahmedabad’s favorite early morning road trips.',
    area: 'Thol, Kalol Taluka',
    distanceFromHub: '22 km from Thaltej',
    driveTime: '~35 mins drive',
    category: 'Scenic Getaway',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'SUV',
  },
  {
    id: 'kankaria-lake',
    name: 'Kankaria Lake & Nagina Wadi',
    tagline: 'Historic royal reservoir with evening musical fountains',
    description: 'Constructed by Sultan Qutb-ud-Din in 1451 with a central island garden palace (Nagina Wadi), illuminated perimeter paths, and serene evening breezes.',
    area: 'Maninagar, South Ahmedabad',
    distanceFromHub: '13 km from Vastrapur',
    driveTime: '~25 mins drive',
    category: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'Car or Bike',
  },
  {
    id: 'nal-sarovar',
    name: 'Nal Sarovar Wetland Sanctuary',
    tagline: 'Massive shallow lake and winter flamingo haven',
    description: 'The largest wetland bird sanctuary in Gujarat spanning 120 sq km. Pristine boat rides through shallow reed islands with majestic Siberian cranes and rosier pelicans.',
    area: 'Sanand / Nal Sarovar Road',
    distanceFromHub: '55 km from SG Highway',
    driveTime: '~1 hr 15 mins drive',
    category: 'Scenic Getaway',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    bestVehicle: 'SUV',
  },
];

// =========================================================
// DEMO PROFILES (AHMEDABAD BASED)
// =========================================================
export const DEMO_USER_CUSTOMER: UserProfile = {
  id: 'usr-customer-1',
  full_name: 'Hardik Patel',
  email: 'hardik.patel@example.com',
  phone: '+91 98250 12345',
  role: 'customer',
  dob: '1995-04-12',
  address: 'Bodakdev, SG Highway, Ahmedabad, Gujarat',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  kyc_status: 'APPROVED',
};

export const DEMO_USER_ADMIN: UserProfile = {
  id: 'usr-admin-1',
  full_name: 'Rentro Fleet Manager',
  email: 'admin@rentro.in',
  phone: '+91 98765 00000',
  role: 'admin',
  dob: '1990-08-20',
  address: 'Rentro Mobility HQ, SG Highway, Ahmedabad, Gujarat',
  avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  kyc_status: 'APPROVED',
};

export const INITIAL_KYC_DOCUMENTS: KYCDocument[] = [];
export const INITIAL_BOOKINGS: Booking[] = [];
