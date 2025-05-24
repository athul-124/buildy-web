import type { Expert, Service, MaterialTip, OnboardingStep } from '@/types';
import { Wrench, Zap, Droplets, HomeIcon, Lightbulb, ShieldCheck, MessageSquareHeart, MapPin, CheckCircle, Edit3 } from 'lucide-react'; // Added HomeIcon

export const mockExperts: Expert[] = [
  {
    id: '1',
    name: 'Anil Kumar',
    specialty: 'Electrician',
    rating: 4.8,
    reviewCount: 120,
    avatarUrl: 'https://placehold.co/100x100.png',
    projectPhotos: [
      { id: 'p1', url: 'https://placehold.co/600x400.png', caption: 'Complete house wiring', dataAiHint: 'electrical wiring' },
      { id: 'p2', url: 'https://placehold.co/600x400.png', caption: 'Fancy light installation', dataAiHint: 'light fixture' },
    ],
    bio: 'Experienced electrician with 10+ years in residential and commercial projects. Specialized in safe and efficient electrical solutions.',
    servicesOffered: ['Wiring', 'Fixture Installation', 'Appliance Repair', 'Inverter Setup', 'Panel Upgrades'],
    availability: 'Mon-Sat, 9 AM - 6 PM',
    contact: { phone: '98XXXXXX01', whatsapp: '9198XXXXXX01' },
    location: "Thrissur Town",
  },
  {
    id: '2',
    name: 'Sunitha Menon',
    specialty: 'Plumber',
    rating: 4.9,
    reviewCount: 95,
    avatarUrl: 'https://placehold.co/100x100.png',
    projectPhotos: [
      { id: 'p3', url: 'https://placehold.co/600x400.png', caption: 'Bathroom pipe fitting', dataAiHint: 'bathroom plumbing' },
      { id: 'p4', url: 'https://placehold.co/600x400.png', caption: 'Kitchen sink setup', dataAiHint: 'kitchen sink' },
    ],
    bio: 'Certified plumber focusing on quality workmanship and customer satisfaction. Expertise in leak detection and modern plumbing systems.',
    servicesOffered: ['Leak Repair', 'Pipe Installation', 'Sanitary Ware Fitting', 'Water Tank Cleaning', 'Blocked Drain Clearing'],
    availability: 'Mon-Fri, 10 AM - 7 PM',
    contact: { phone: '97XXXXXX02', whatsapp: '9197XXXXXX02' },
    location: "Ollur, Thrissur",
  },
  {
    id: '3',
    name: 'Rajesh Varma',
    specialty: 'Carpenter',
    rating: 4.7,
    reviewCount: 78,
    avatarUrl: 'https://placehold.co/100x100.png',
    projectPhotos: [
      { id: 'p5', url: 'https://placehold.co/600x400.png', caption: 'Custom wooden wardrobe', dataAiHint: 'wood wardrobe' },
      { id: 'p6', url: 'https://placehold.co/600x400.png', caption: 'Modular kitchen cabinets', dataAiHint: 'kitchen cabinet' },
    ],
    bio: 'Skilled carpenter creating custom furniture and wooden fixtures. Passionate about precision and durable designs.',
    servicesOffered: ['Custom Furniture', 'Door & Window Fitting', 'Repair Work', 'Polishing', 'Modular Kitchens'],
    availability: 'Tue-Sun, 8 AM - 5 PM',
    contact: { phone: '96XXXXXX03', whatsapp: '9196XXXXXX03' },
    location: "Poonkunnam, Thrissur",
  },
];

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Electrical Wiring',
    description: 'Complete house wiring or re-wiring services.',
    category: 'Electrical',
    basePrice: 5000,
    priceRange: { min: 3000, max: 15000 },
    priceExplanation: 'Price varies based on house size, number of points, and material quality. Includes labor and basic fixtures.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'electrical wiring service',
    expertsAvailable: 5,
  },
  {
    id: 's2',
    name: 'Leak Detection & Repair',
    description: 'Advanced leak detection and plumbing repair.',
    category: 'Plumbing',
    basePrice: 800,
    priceExplanation: 'Starts from ₹800 for inspection and minor fixes. Major repairs quoted after assessment.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'plumbing leak repair',
    expertsAvailable: 3,
  },
  {
    id: 's3',
    name: 'Custom Wardrobe',
    description: 'Design and build custom wooden wardrobes.',
    category: 'Carpentry',
    basePrice: 15000,
    priceRange: { min: 10000, max: 50000 },
    priceExplanation: 'Cost depends on size, material (plywood, MDF, wood), and finish. Includes design consultation.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'custom wardrobe carpentry',
    expertsAvailable: 4,
  },
  {
    id: 's4',
    name: 'AC Servicing',
    description: 'Routine maintenance and cleaning for air conditioners.',
    category: 'Appliance Repair',
    basePrice: 600,
    priceExplanation: 'Standard service for split or window AC. Parts extra if needed.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'ac service',
    expertsAvailable: 6,
  },
];

export const mockMaterialTips: MaterialTip[] = [
  {
    id: 'm1',
    title: 'Choosing the Right Cement',
    materialName: 'Cement',
    content: "Understand the difference between OPC and PPC cement and when to use each for optimal strength and durability in your Thrissur home. Consider weather conditions and project type. For example, PPC is great for plastering due to its fineness.",
    expertName: 'Er. Joseph K.',
    expertAvatarUrl: 'https://placehold.co/80x80.png',
    mediaType: 'text',
    dataAiHint: 'cement bags construction',
  },
  {
    id: 'm2',
    title: 'Selecting Quality Steel Bars (TMT)',
    materialName: 'Steel',
    content: "Look for ISI certification and grade (Fe500, Fe550D) when buying TMT steel bars. Ensure proper storage to prevent rust. Watch this short video for visual inspection tips.",
    expertName: 'Suresh Pillai (Contractor)',
    expertAvatarUrl: 'https://placehold.co/80x80.png',
    mediaType: 'video',
    mediaUrl: '#', // Placeholder for video link
    dataAiHint: 'steel bars',
  },
  {
    id: 'm3',
    title: 'Best Paint Brands for Kerala Climate',
    materialName: 'Paint',
    content: "Kerala's humid climate demands paints with anti-fungal properties and good weather resistance. Listen to this audio tip on top brands and application techniques.",
    expertName: 'Priya Painters',
    expertAvatarUrl: 'https://placehold.co/80x80.png',
    mediaType: 'audio',
    mediaUrl: '#', // Placeholder for audio link
    dataAiHint: 'paint cans colors',
  },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 'step1',
    icon: MessageSquareHeart,
    title: "Welcome to Thrissur Home Joy!",
    description: "Let's find the perfect expert for your home needs. What kind of service are you looking for today?",
    question: "Select a service category:",
    inputType: 'radio',
    fieldName: 'serviceCategory',
    options: [
      { label: 'Electrical', value: 'electrical', icon: Zap },
      { label: 'Plumbing', value: 'plumbing', icon: Droplets },
      { label: 'Carpentry', value: 'carpentry', icon: Wrench },
      { label: 'Painting', value: 'painting', icon: HomeIcon }, 
      { label: 'Appliance Repair', value: 'appliance_repair', icon: Lightbulb },
      { label: 'Other', value: 'other', icon: Edit3 },
    ],
  },
  {
    id: 'step2',
    icon: Edit3,
    title: "Great! Tell us a bit more.",
    description: "Briefly describe the issue or project you have in mind. This helps us match you better.",
    question: "What do you need help with?",
    inputType: 'textarea', 
    fieldName: 'problemDescription',
  },
  {
    id: 'step3',
    icon: CheckCircle,
    title: "Urgency & Timing",
    description: "How soon do you need this service?",
    question: "Select urgency:",
    inputType: 'select',
    fieldName: 'urgency',
    options: [
      { label: 'It\'s an emergency!', value: 'high' },
      { label: 'Within a few days', value: 'medium' },
      { label: 'Flexible, within a week or two', value: 'low' },
    ],
  },
  {
    id: 'step4',
    icon: MapPin,
    title: "Your Location",
    description: "Help us find experts serving your area in Thrissur.",
    question: "Enter your locality (e.g., Ollur, East Fort):",
    inputType: 'text',
    fieldName: 'location',
  }
];

// Function to get an expert by ID
export const getExpertById = (id: string): Expert | undefined => mockExperts.find(expert => expert.id === id);

// Function to get experts by specialty
export const getExpertsBySpecialty = (specialty: string): Expert[] => mockExperts.filter(expert => expert.specialty.toLowerCase() === specialty.toLowerCase());

// Function to get a service by ID
export const getServiceById = (id: string): Service | undefined => mockServices.find(service => service.id === id);
