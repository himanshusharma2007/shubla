import { generateAvailability } from "../redux/utils/generateAvailbility";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    description:
      "A luxurious room with a king-size bed, sea view, and complimentary breakfast.",
    pricePerNight: 150,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service"],
    maxOccupancy: 2,
    image:
      "https://plus.unsplash.com/premium_photo-1671269705768-cad27668134c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGVsdXhlJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
  {
    id: 2,
    name: "Standard Room",
    description: "A comfortable room with a queen-size bed and city view.",
    pricePerNight: 100,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Room Service"],
    maxOccupancy: 2,
    image:
      "https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U3RhbmRhcmQlMjBSb29tfGVufDB8fDB8fHww",
    availability: generateAvailability(),
    quantity: 2,
  },
  {
    id: 3,
    name: "Suite Room",
    description:
      "A spacious suite with separate living area and premium amenities.",
    pricePerNight: 250,
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Mini Bar",
      "Room Service",
      "Living Area",
    ],
    maxOccupancy: 4,
    image:
      "https://images.unsplash.com/photo-1709755386664-573b8d9e9a38?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3VpdGUlMjBSb29tfGVufDB8fDB8fHww",
    availability: generateAvailability(),
    quantity: 10, 
  },
  {
    id: 4,
    name: "Single Room",
    description: "A cozy room with a single bed, perfect for solo travelers.",
    pricePerNight: 75,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Room Service"],
    maxOccupancy: 1,
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFNpbmdsZSUyMFJvb218ZW58MHx8MHx8fDA%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
  {
    id: 5,
    name: "Family Room",
    description:
      "A spacious room with two queen-size beds, ideal for families.",
    pricePerNight: 180,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Room Service", "Extra Bed"],
    maxOccupancy: 4,
    image:
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RmFtaWx5JTIwUm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
  {
    id: 6,
    name: "Executive Room",
    description:
      "A stylish room with modern amenities and a workspace, perfect for business travelers.",
    pricePerNight: 200,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Room Service", "Workspace"],
    maxOccupancy: 2,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RXhlY3V0aXZlJTIwUm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
  {
    id: 7,
    name: "Penthouse Suite",
    description:
      "A top-floor suite with panoramic views, private balcony, and exclusive services.",
    pricePerNight: 500,
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Room Service",
      "Private Balcony",
      "Butler Service",
    ],
    maxOccupancy: 4,
    image:
      "https://plus.unsplash.com/premium_photo-1661962952618-031d218dd040?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVudGhvdXNlJTIwUm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
  {
    id: 8,
    name: "Twin Room",
    description:
      "A room with two single beds, suitable for friends or siblings.",
    pricePerNight: 90,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Room Service"],
    maxOccupancy: 2,
    image:
      "https://images.unsplash.com/photo-1648383228240-6ed939727ad6?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHdpbiUyMFJvb218ZW58MHx8MHx8fDA%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
  {
    id: 9,
    name: "Presidential Suite",
    description:
      "An ultra-luxurious suite with a private dining area, hot tub, and personal concierge.",
    pricePerNight: 1000,
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Room Service",
      "Private Dining",
      "Hot Tub",
      "Personal Concierge",
    ],
    maxOccupancy: 6,
    image:
      "https://plus.unsplash.com/premium_photo-1661884238187-1c274b3c3413?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UHJlc2lkZW50aWFsJTIwc3VpdGV8ZW58MHx8MHx8fDA%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
  {
    id: 10,
    name: "Budget Room",
    description:
      "A basic room with essential amenities for budget-conscious travelers.",
    pricePerNight: 50,
    amenities: ["Free Wi-Fi", "Air Conditioning"],
    maxOccupancy: 2,
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8QnVkZ2V0JTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    availability: generateAvailability(),
    quantity: 10,
  },
];

export default rooms;