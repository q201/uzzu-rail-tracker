/* ==========================================================================
   UZZU RAIL TRACKER - COMPREHENSIVE STATION INDEX & STATE STORE
   Cached in Application State / LocalStorage for Instant Local Filtering (<1ms)
   Without making unnecessary API calls on every keystroke.
   ========================================================================== */

export const ALL_INDIAN_STATIONS = [
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi' },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'BCT', name: 'Mumbai Central (BCT)', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'CSMT', name: 'Mumbai CSM Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'RKMP', name: 'Rani Kamalapati', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat' },
  { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat' },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya', city: 'Mughalsarai', state: 'Uttar Pradesh' },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Secunderabad', state: 'Telangana' },
  { code: 'VSKP', name: 'Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Trivandrum', state: 'Kerala' },
  { code: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', state: 'Kerala' },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh' },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh' },
  { code: 'VGLJ', name: 'VGL Jhansi Junction', city: 'Jhansi', state: 'Uttar Pradesh' },
  { code: 'BINA', name: 'Bina Junction', city: 'Bina', state: 'Madhya Pradesh' },
  { code: 'BPKA', name: 'Bhopalka', city: 'Bhopalka', state: 'Madhya Pradesh' },
  { code: 'SB', name: 'Sarai Bhopat', city: 'Sarai Bhopat', state: 'Uttar Pradesh' },
  { code: 'CPU', name: 'Chopan', city: 'Chopan', state: 'Uttar Pradesh' },
  { code: 'BOKR', name: 'Bhokar', city: 'Nanded', state: 'Maharashtra' },
  { code: 'TATA', name: 'Tatanagar Junction', city: 'Jamshedpur', state: 'Jharkhand' },
  { code: 'ROU', name: 'Rourkela Junction', city: 'Rourkela', state: 'Odisha' },
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha' },
  { code: 'CTPS', name: 'Chandrapura', city: 'Chandrapura', state: 'Jharkhand' },
  { code: 'DHN', name: 'Dhanbad Junction', city: 'Dhanbad', state: 'Jharkhand' },
  { code: 'KGM', name: 'Kathgodam', city: 'Nainital', state: 'Uttarakhand' },
  { code: 'HW', name: 'Haridwar Junction', city: 'Haridwar', state: 'Uttarakhand' },
  { code: 'DDN', name: 'Dehradun', city: 'Dehradun', state: 'Uttarakhand' },
  { code: 'DDR', name: 'Dadar Western', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'BVI', name: 'Borivali', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'VR', name: 'Virar', city: 'Palghar', state: 'Maharashtra' },
  { code: 'PLG', name: 'Palghar', city: 'Palghar', state: 'Maharashtra' },
  { code: 'VAPI', name: 'Vapi', city: 'Vapi', state: 'Gujarat' },
  { code: 'BL', name: 'Valsad', city: 'Valsad', state: 'Gujarat' },
  { code: 'NVS', name: 'Navsari', city: 'Navsari', state: 'Gujarat' },
  { code: 'BH', name: 'Bharuch Junction', city: 'Bharuch', state: 'Gujarat' },
  { code: 'AKV', name: 'Ankleshwar Junction', city: 'Ankleshwar', state: 'Gujarat' },
  { code: 'ANND', name: 'Anand Junction', city: 'Anand', state: 'Gujarat' },
  { code: 'ND', name: 'Nadiad Junction', city: 'Nadiad', state: 'Gujarat' },
  { code: 'RTM', name: 'Ratlam Junction', city: 'Ratlam', state: 'Madhya Pradesh' },
  { code: 'NMH', name: 'Nimach', city: 'Nimach', state: 'Madhya Pradesh' },
  { code: 'MDS', name: 'Mandsaur', city: 'Mandsaur', state: 'Madhya Pradesh' },
  { code: 'INDB', name: 'Indore Junction', city: 'Indore', state: 'Madhya Pradesh' },
  { code: 'UJN', name: 'Ujjain Junction', city: 'Ujjain', state: 'Madhya Pradesh' },
  { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan' },
  { code: 'SWM', name: 'Sawai Madhopur', city: 'Sawai Madhopur', state: 'Rajasthan' },
  { code: 'MTJ', name: 'Mathura Junction', city: 'Mathura', state: 'Uttar Pradesh' },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi' },
  { code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', state: 'Delhi' },
  { code: 'DLI', name: 'Old Delhi Junction', city: 'Delhi', state: 'Delhi' },
  { code: 'UMB', name: 'Ambala Cantt', city: 'Ambala', state: 'Haryana' },
  { code: 'LDH', name: 'Ludhiana Junction', city: 'Ludhiana', state: 'Punjab' },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir' },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu and Kashmir' },
  { code: 'MB', name: 'Moradabad', city: 'Moradabad', state: 'Uttar Pradesh' },
  { code: 'BE', name: 'Bareilly Junction', city: 'Bareilly', state: 'Uttar Pradesh' },
  { code: 'SPN', name: 'Shahjahanpur', city: 'Shahjahanpur', state: 'Uttar Pradesh' },
  { code: 'AY', name: 'Ayodhya Dham Junction', city: 'Ayodhya', state: 'Uttar Pradesh' },
  { code: 'PRYJ', name: 'Prayagraj Junction', city: 'Prayagraj', state: 'Uttar Pradesh' },
  { code: 'MUP', name: 'Murshipatnam', city: 'Murshipatnam', state: 'Andhra Pradesh' },
  { code: 'GNT', name: 'Guntur Junction', city: 'Guntur', state: 'Andhra Pradesh' },
  { code: 'BZA', name: 'Vijayawada Junction', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { code: 'RJY', name: 'Rajahmundry', city: 'Rajahmundry', state: 'Andhra Pradesh' },
  { code: 'NLR', name: 'Nellore', city: 'Nellore', state: 'Andhra Pradesh' },
  { code: 'RU', name: 'Renigunta Junction', city: 'Tirupati', state: 'Andhra Pradesh' },
  { code: 'TPTY', name: 'Tirupati Main', city: 'Tirupati', state: 'Andhra Pradesh' },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu' },
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu' },
  { code: 'TPJ', name: 'Tiruchchirappalli', city: 'Trichy', state: 'Tamil Nadu' },
  { code: 'CLT', name: 'Kozhikode', city: 'Calicut', state: 'Kerala' },
  { code: 'CAN', name: 'Kannur', city: 'Cannanore', state: 'Kerala' },
  { code: 'MAQ', name: 'Mangaluru Central', city: 'Mangalore', state: 'Karnataka' },
  { code: 'MAJN', name: 'Mangaluru Junction', city: 'Mangalore', state: 'Karnataka' },
  { code: 'UBL', name: 'SSS Hubballi Junction', city: 'Hubli', state: 'Karnataka' },
  { code: 'BGM', name: 'Belagavi', city: 'Belgaum', state: 'Karnataka' },
  { code: 'MYS', name: 'Mysuru Junction', city: 'Mysore', state: 'Karnataka' }
];

/**
 * Filter stations from state memory by query string (matching code, name, city, state)
 * Executes instantly in memory (<1ms) without sending HTTP API calls on keystrokes.
 */
export function filterStationsFromState(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [];

  return ALL_INDIAN_STATIONS.filter(
    st =>
      st.code.toLowerCase().includes(q) ||
      st.name.toLowerCase().includes(q) ||
      st.city.toLowerCase().includes(q) ||
      (st.state && st.state.toLowerCase().includes(q))
  ).slice(0, 8);
}
