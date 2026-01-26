// Destination coordinates for the interactive globe
// Format: { name: string, lat: number, lng: number, country: string }

export const DESTINATION_COORDINATES = [
    // India - Major Cities
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India' },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, country: 'India' },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946, country: 'India' },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707, country: 'India' },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, country: 'India' },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, country: 'India' },
    { name: 'Pune', lat: 18.5204, lng: 73.8567, country: 'India' },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, country: 'India' },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, country: 'India' },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, country: 'India' },

    // India - Tourist Destinations
    { name: 'Goa', lat: 15.2993, lng: 74.1240, country: 'India' },
    { name: 'Agra', lat: 27.1767, lng: 78.0081, country: 'India' },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739, country: 'India' },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125, country: 'India' },
    { name: 'Jaisalmer', lat: 26.9157, lng: 70.9083, country: 'India' },
    { name: 'Rishikesh', lat: 30.0869, lng: 78.2676, country: 'India' },
    { name: 'Haridwar', lat: 29.9457, lng: 78.1642, country: 'India' },
    { name: 'Darjeeling', lat: 27.0410, lng: 88.2663, country: 'India' },
    { name: 'Shimla', lat: 31.1048, lng: 77.1734, country: 'India' },
    { name: 'Manali', lat: 32.2396, lng: 77.1887, country: 'India' },
    { name: 'Leh', lat: 34.1526, lng: 77.5771, country: 'India' },
    { name: 'Ladakh', lat: 34.1526, lng: 77.5771, country: 'India' },
    { name: 'Srinagar', lat: 34.0837, lng: 74.7973, country: 'India' },
    { name: 'Mussoorie', lat: 30.4598, lng: 78.0644, country: 'India' },
    { name: 'Ooty', lat: 11.4102, lng: 76.6950, country: 'India' },
    { name: 'Munnar', lat: 10.0889, lng: 77.0595, country: 'India' },
    { name: 'Kochi', lat: 9.9312, lng: 76.2673, country: 'India' },
    { name: 'Mysuru', lat: 12.2958, lng: 76.6394, country: 'India' },
    { name: 'Hampi', lat: 15.3350, lng: 76.4600, country: 'India' },
    { name: 'Puri', lat: 19.8135, lng: 85.8312, country: 'India' },
    { name: 'Gulmarg', lat: 34.0484, lng: 74.3805, country: 'India' },
    { name: 'Pahalgam', lat: 34.0161, lng: 75.3150, country: 'India' },
    { name: 'Sonamarg', lat: 34.3000, lng: 75.2833, country: 'India' },
    { name: 'Katra', lat: 32.9915, lng: 74.9318, country: 'India' },

    // India - State Capitals & Major Cities
    { name: 'Bhopal', lat: 23.2599, lng: 77.4126, country: 'India' },
    { name: 'Indore', lat: 22.7196, lng: 75.8577, country: 'India' },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882, country: 'India' },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898, country: 'India' },
    { name: 'Surat', lat: 21.1702, lng: 72.8311, country: 'India' },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812, country: 'India' },
    { name: 'Rajkot', lat: 22.3039, lng: 70.8022, country: 'India' },
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, country: 'India' },
    { name: 'Amritsar', lat: 31.6340, lng: 74.8723, country: 'India' },
    { name: 'Ludhiana', lat: 30.9010, lng: 75.8573, country: 'India' },
    { name: 'Dehradun', lat: 30.3165, lng: 78.0322, country: 'India' },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319, country: 'India' },
    { name: 'Patna', lat: 25.5941, lng: 85.1376, country: 'India' },
    { name: 'Ranchi', lat: 23.3441, lng: 85.3096, country: 'India' },
    { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, country: 'India' },
    { name: 'Cuttack', lat: 20.4625, lng: 85.8830, country: 'India' },
    { name: 'Guwahati', lat: 26.1445, lng: 91.7362, country: 'India' },
    { name: 'Imphal', lat: 24.8170, lng: 93.9368, country: 'India' },
    { name: 'Shillong', lat: 25.5788, lng: 91.8933, country: 'India' },
    { name: 'Aizawl', lat: 23.7271, lng: 92.7176, country: 'India' },
    { name: 'Agartala', lat: 23.8315, lng: 91.2868, country: 'India' },
    { name: 'Kohima', lat: 25.6751, lng: 94.1086, country: 'India' },
    { name: 'Itanagar', lat: 27.0844, lng: 93.6053, country: 'India' },
    { name: 'Gangtok', lat: 27.3389, lng: 88.6065, country: 'India' },
    { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, country: 'India' },
    { name: 'Kozhikode', lat: 11.2588, lng: 75.7804, country: 'India' },
    { name: 'Thrissur', lat: 10.5276, lng: 76.2144, country: 'India' },
    { name: 'Mangaluru', lat: 12.9141, lng: 74.8560, country: 'India' },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, country: 'India' },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198, country: 'India' },
    { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047, country: 'India' },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480, country: 'India' },
    { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, country: 'India' },
    { name: 'Tirupati', lat: 13.6288, lng: 79.4192, country: 'India' },

    // India - Additional Cities
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, country: 'India' },
    { name: 'Ajmer', lat: 26.4499, lng: 74.6399, country: 'India' },
    { name: 'Kota', lat: 25.2138, lng: 75.8648, country: 'India' },
    { name: 'Bikaner', lat: 28.0229, lng: 73.3119, country: 'India' },
    { name: 'Gwalior', lat: 26.2183, lng: 78.1828, country: 'India' },
    { name: 'Jabalpur', lat: 23.1815, lng: 79.9864, country: 'India' },
    { name: 'Raipur', lat: 21.2514, lng: 81.6296, country: 'India' },
    { name: 'Aurangabad', lat: 19.8762, lng: 75.3433, country: 'India' },
    { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, country: 'India' },
    { name: 'Thane', lat: 19.2183, lng: 72.9781, country: 'India' },
    { name: 'Pimpri-Chinchwad', lat: 18.6279, lng: 73.8009, country: 'India' },
    { name: 'Faridabad', lat: 28.4089, lng: 77.3178, country: 'India' },
    { name: 'Ghaziabad', lat: 28.6692, lng: 77.4538, country: 'India' },
    { name: 'Noida', lat: 28.5355, lng: 77.3910, country: 'India' },
    { name: 'Meerut', lat: 28.9845, lng: 77.7064, country: 'India' },
    { name: 'Agra', lat: 27.1767, lng: 78.0081, country: 'India' },
    { name: 'Prayagraj', lat: 25.4358, lng: 81.8463, country: 'India' },
    { name: 'Gorakhpur', lat: 26.7606, lng: 83.3732, country: 'India' },
    { name: 'Bareilly', lat: 28.3670, lng: 79.4304, country: 'India' },
    { name: 'Aligarh', lat: 27.8974, lng: 78.0880, country: 'India' },
    { name: 'Moradabad', lat: 28.8386, lng: 78.7733, country: 'India' },
    { name: 'Saharanpur', lat: 29.9680, lng: 77.5510, country: 'India' },
    { name: 'Mathura', lat: 27.4924, lng: 77.6737, country: 'India' },
    { name: 'Vrindavan', lat: 27.5810, lng: 77.6969, country: 'India' },
    { name: 'Ayodhya', lat: 26.7922, lng: 82.1998, country: 'India' },

    // Andaman & Nicobar Islands
    { name: 'Andaman & Nicobar Islands', lat: 11.7401, lng: 92.6586, country: 'India' },
    { name: 'Port Blair', lat: 11.6234, lng: 92.7265, country: 'India' },

    // Nepal
    { name: 'Kathmandu', lat: 27.7172, lng: 85.3240, country: 'Nepal' },
    { name: 'Pokhara', lat: 28.2096, lng: 83.9856, country: 'Nepal' },
    { name: 'Biratnagar', lat: 26.4525, lng: 87.2718, country: 'Nepal' },
    { name: 'Birgunj', lat: 27.0104, lng: 84.8770, country: 'Nepal' },
    { name: 'Butwal', lat: 27.7006, lng: 83.4483, country: 'Nepal' },
    { name: 'Dharan', lat: 26.8065, lng: 87.2846, country: 'Nepal' },
    { name: 'Janakpur', lat: 26.7288, lng: 85.9263, country: 'Nepal' },

    // Bhutan
    { name: 'Thimphu', lat: 27.4728, lng: 89.6393, country: 'Bhutan' },
    { name: 'Paro', lat: 27.4305, lng: 89.4137, country: 'Bhutan' },
    { name: 'Punakha', lat: 27.5921, lng: 89.8644, country: 'Bhutan' },
    { name: 'Phuntsholing', lat: 26.8516, lng: 89.3884, country: 'Bhutan' },
    { name: 'Gelephu', lat: 26.8862, lng: 90.4874, country: 'Bhutan' },
    { name: 'Wangdue Phodrang', lat: 27.4862, lng: 89.9013, country: 'Bhutan' },
    { name: 'Tawang', lat: 27.5860, lng: 91.8593, country: 'India' },

    // Japan
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
    { name: 'Osaka', lat: 34.6937, lng: 135.5023, country: 'Japan' },
    { name: 'Kyoto', lat: 35.0116, lng: 135.7681, country: 'Japan' },
    { name: 'Yokohama', lat: 35.4437, lng: 139.6380, country: 'Japan' },
    { name: 'Nagoya', lat: 35.1815, lng: 136.9066, country: 'Japan' },
    { name: 'Sapporo', lat: 43.0618, lng: 141.3545, country: 'Japan' },
    { name: 'Kobe', lat: 34.6901, lng: 135.1956, country: 'Japan' },
    { name: 'Fukuoka', lat: 33.5902, lng: 130.4017, country: 'Japan' },
    { name: 'Kawasaki', lat: 35.5309, lng: 139.7030, country: 'Japan' },
    { name: 'Saitama', lat: 35.8617, lng: 139.6455, country: 'Japan' },
    { name: 'Hiroshima', lat: 34.3853, lng: 132.4553, country: 'Japan' },
    { name: 'Sendai', lat: 38.2682, lng: 140.8694, country: 'Japan' },
    { name: 'Chiba', lat: 35.6073, lng: 140.1063, country: 'Japan' },
    { name: 'Kitakyushu', lat: 33.8835, lng: 130.8752, country: 'Japan' },

    // Africa - Nigeria
    { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria' },
    { name: 'Abuja', lat: 9.0765, lng: 7.3986, country: 'Nigeria' },
    { name: 'Kano', lat: 12.0022, lng: 8.5920, country: 'Nigeria' },
    { name: 'Kaduna', lat: 10.5222, lng: 7.4383, country: 'Nigeria' },
    { name: 'Jos', lat: 9.8965, lng: 8.8583, country: 'Nigeria' },
    { name: 'Maiduguri', lat: 11.8311, lng: 13.1510, country: 'Nigeria' },
    { name: 'Sokoto', lat: 13.0059, lng: 5.2476, country: 'Nigeria' },
    { name: 'Owerri', lat: 5.4836, lng: 7.0333, country: 'Nigeria' },
    { name: 'Uyo', lat: 5.0377, lng: 7.9128, country: 'Nigeria' },
    { name: 'Onitsha', lat: 6.1667, lng: 6.7833, country: 'Nigeria' },
    { name: 'Nnewi', lat: 6.0167, lng: 6.9167, country: 'Nigeria' },
    { name: 'Benin City', lat: 6.3350, lng: 5.6037, country: 'Nigeria' },
    { name: 'Zaria', lat: 11.0855, lng: 7.7199, country: 'Nigeria' },

    // Africa - Other
    { name: 'Kinshasa', lat: -4.4419, lng: 15.2663, country: 'DR Congo' },
    { name: 'Harare', lat: -17.8252, lng: 31.0335, country: 'Zimbabwe' },
    { name: 'Casablanca', lat: 33.5731, lng: -7.5898, country: 'Morocco' },

    // South Africa
    { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: 'South Africa' },
    { name: 'Cape Town', lat: -33.9249, lng: 18.4241, country: 'South Africa' },
    { name: 'Durban', lat: -29.8587, lng: 31.0218, country: 'South Africa' },
    { name: 'West Rand', lat: -26.1667, lng: 27.7500, country: 'South Africa' },

    // More Indian Cities from original list
    { name: 'Abohar', lat: 30.1453, lng: 74.1983, country: 'India' },
    { name: 'Adoni', lat: 15.6319, lng: 77.2773, country: 'India' },
    { name: 'Akola', lat: 20.7002, lng: 77.0082, country: 'India' },
    { name: 'Alwar', lat: 27.5530, lng: 76.6346, country: 'India' },
    { name: 'Amravati', lat: 20.9320, lng: 77.7523, country: 'India' },
    { name: 'Anantapuram', lat: 14.6819, lng: 77.6006, country: 'India' },
    { name: 'Asansol', lat: 23.6739, lng: 86.9524, country: 'India' },
    { name: 'Ballari', lat: 15.1394, lng: 76.9214, country: 'India' },
    { name: 'Ballia', lat: 25.7603, lng: 84.1484, country: 'India' },
    { name: 'Balasore', lat: 21.4934, lng: 86.9135, country: 'India' },
    { name: 'Belagavi', lat: 15.8497, lng: 74.4977, country: 'India' },
    { name: 'Berhampur', lat: 19.3150, lng: 84.7941, country: 'India' },
    { name: 'Bhagalpur', lat: 25.2425, lng: 86.9842, country: 'India' },
    { name: 'Bharatpur', lat: 27.2152, lng: 77.5030, country: 'India' },
    { name: 'Bhavnagar', lat: 21.7645, lng: 72.1519, country: 'India' },
    { name: 'Bhilai', lat: 21.2094, lng: 81.4285, country: 'India' },
    { name: 'Bhuj', lat: 23.2420, lng: 69.6669, country: 'India' },
    { name: 'Bidar', lat: 17.9127, lng: 77.5199, country: 'India' },
    { name: 'Bilaspur', lat: 22.0797, lng: 82.1391, country: 'India' },
    { name: 'Bokaro Steel City', lat: 23.6693, lng: 86.1511, country: 'India' },
    { name: 'Dhanbad', lat: 23.7957, lng: 86.4304, country: 'India' },
    { name: 'Durgapur', lat: 23.5204, lng: 87.3119, country: 'India' },
    { name: 'Eluru', lat: 16.7107, lng: 81.0952, country: 'India' },
    { name: 'Erode', lat: 11.3410, lng: 77.7172, country: 'India' },
    { name: 'Guntur', lat: 16.3067, lng: 80.4365, country: 'India' },
    { name: 'Hubli-Dharwad', lat: 15.3647, lng: 75.1240, country: 'India' },
    { name: 'Jamnagar', lat: 22.4707, lng: 70.0577, country: 'India' },
    { name: 'Jhansi', lat: 25.4484, lng: 78.5685, country: 'India' },
    { name: 'Kakinada', lat: 16.9891, lng: 82.2475, country: 'India' },
    { name: 'Kollam', lat: 8.8932, lng: 76.6141, country: 'India' },
    { name: 'Korba', lat: 22.3595, lng: 82.7501, country: 'India' },
    { name: 'Kurnool', lat: 15.8281, lng: 78.0373, country: 'India' },
    { name: 'Nellore', lat: 14.4426, lng: 79.9865, country: 'India' },
    { name: 'Rohtak', lat: 28.8955, lng: 76.6066, country: 'India' },
    { name: 'Rourkela', lat: 22.2604, lng: 84.8536, country: 'India' },
    { name: 'Salem', lat: 11.6643, lng: 78.1460, country: 'India' },
    { name: 'Sambalpur', lat: 21.4669, lng: 83.9756, country: 'India' },
    { name: 'Sangli', lat: 16.8524, lng: 74.5815, country: 'India' },
    { name: 'Siliguri', lat: 26.7271, lng: 88.6393, country: 'India' },
    { name: 'Thanjavur', lat: 10.7870, lng: 79.1378, country: 'India' },
    { name: 'Tirunelveli', lat: 8.7139, lng: 77.7567, country: 'India' },
    { name: 'Tumkur', lat: 13.3379, lng: 77.1173, country: 'India' },
    { name: 'Ujjain', lat: 23.1765, lng: 75.7885, country: 'India' },
    { name: 'Warangal', lat: 17.9689, lng: 79.5941, country: 'India' },

    // Puducherry
    { name: 'Puducherry', lat: 11.9416, lng: 79.8083, country: 'India' },

    // Daman & Diu
    { name: 'Daman & Diu', lat: 20.4283, lng: 72.8397, country: 'India' },

    // Dadra & Nagar Haveli
    { name: 'Dadra & Nagar Haveli', lat: 20.1809, lng: 73.0169, country: 'India' },
];

// Helper function to get coordinates for a destination
export function getCoordinatesForDestination(destinationName) {
    const dest = DESTINATION_COORDINATES.find(
        d => d.name.toLowerCase() === destinationName.toLowerCase()
    );
    return dest || null;
}

// Helper to get all unique countries
export function getUniqueCountries() {
    return [...new Set(DESTINATION_COORDINATES.map(d => d.country))];
}
