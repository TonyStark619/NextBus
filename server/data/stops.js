// Comprehensive stops across major Indian cities
const stops = [
  // Karnataka - Bangalore
  { id: 'KA-BLR-1', name: 'Majestic Bus Stand', lat: 12.9716, lon: 77.5946, city: 'Bangalore', state: 'Karnataka' },
  { id: 'KA-BLR-2', name: 'Electronic City', lat: 12.8456, lon: 77.6603, city: 'Bangalore', state: 'Karnataka' },
  { id: 'KA-BLR-3', name: 'Whitefield', lat: 12.9698, lon: 77.7500, city: 'Bangalore', state: 'Karnataka' },
  { id: 'KA-BLR-4', name: 'Koramangala', lat: 12.9352, lon: 77.6245, city: 'Bangalore', state: 'Karnataka' },
  { id: 'KA-BLR-5', name: 'Indiranagar', lat: 12.9719, lon: 77.6412, city: 'Bangalore', state: 'Karnataka' },
  
  // Maharashtra - Mumbai
  { id: 'MH-MUM-1', name: 'CST Railway Station', lat: 18.9398, lon: 72.8355, city: 'Mumbai', state: 'Maharashtra' },
  { id: 'MH-MUM-2', name: 'Bandra Kurla Complex', lat: 19.0596, lon: 72.8295, city: 'Mumbai', state: 'Maharashtra' },
  { id: 'MH-MUM-3', name: 'Andheri', lat: 19.1136, lon: 72.8697, city: 'Mumbai', state: 'Maharashtra' },
  { id: 'MH-MUM-4', name: 'Powai', lat: 19.1176, lon: 72.9060, city: 'Mumbai', state: 'Maharashtra' },
  { id: 'MH-MUM-5', name: 'Thane', lat: 19.2183, lon: 72.9781, city: 'Mumbai', state: 'Maharashtra' },
  
  // Delhi
  { id: 'DL-DEL-1', name: 'Connaught Place', lat: 28.6315, lon: 77.2167, city: 'Delhi', state: 'Delhi' },
  { id: 'DL-DEL-2', name: 'Karol Bagh', lat: 28.6517, lon: 77.1909, city: 'Delhi', state: 'Delhi' },
  { id: 'DL-DEL-3', name: 'Lajpat Nagar', lat: 28.5679, lon: 77.2431, city: 'Delhi', state: 'Delhi' },
  { id: 'DL-DEL-4', name: 'Rohini', lat: 28.7434, lon: 77.0670, city: 'Delhi', state: 'Delhi' },
  { id: 'DL-DEL-5', name: 'Dwarka', lat: 28.5921, lon: 77.0465, city: 'Delhi', state: 'Delhi' },
  
  // Tamil Nadu - Chennai
  { id: 'TN-CHN-1', name: 'Central Railway Station', lat: 13.0827, lon: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'TN-CHN-2', name: 'T. Nagar', lat: 13.0418, lon: 80.2341, city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'TN-CHN-3', name: 'Anna Nagar', lat: 13.0878, lon: 80.2200, city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'TN-CHN-4', name: 'Velachery', lat: 12.9816, lon: 80.2200, city: 'Chennai', state: 'Tamil Nadu' },
  { id: 'TN-CHN-5', name: 'Tambaram', lat: 12.9246, lon: 80.1470, city: 'Chennai', state: 'Tamil Nadu' },
  
  // West Bengal - Kolkata
  { id: 'WB-KOL-1', name: 'Howrah Station', lat: 22.5851, lon: 88.3468, city: 'Kolkata', state: 'West Bengal' },
  { id: 'WB-KOL-2', name: 'Park Street', lat: 22.5525, lon: 88.3632, city: 'Kolkata', state: 'West Bengal' },
  { id: 'WB-KOL-3', name: 'Salt Lake', lat: 22.5937, lon: 88.4095, city: 'Kolkata', state: 'West Bengal' },
  { id: 'WB-KOL-4', name: 'New Town', lat: 22.5804, lon: 88.4634, city: 'Kolkata', state: 'West Bengal' },
  { id: 'WB-KOL-5', name: 'Dum Dum', lat: 22.6253, lon: 88.4200, city: 'Kolkata', state: 'West Bengal' },
  
  // Telangana - Hyderabad
  { id: 'TS-HYD-1', name: 'Secunderabad', lat: 17.4399, lon: 78.4983, city: 'Hyderabad', state: 'Telangana' },
  { id: 'TS-HYD-2', name: 'HITEC City', lat: 17.4474, lon: 78.3563, city: 'Hyderabad', state: 'Telangana' },
  { id: 'TS-HYD-3', name: 'Gachibowli', lat: 17.4399, lon: 78.3484, city: 'Hyderabad', state: 'Telangana' },
  { id: 'TS-HYD-4', name: 'Banjara Hills', lat: 17.4065, lon: 78.4772, city: 'Hyderabad', state: 'Telangana' },
  { id: 'TS-HYD-5', name: 'Charminar', lat: 17.3616, lon: 78.4747, city: 'Hyderabad', state: 'Telangana' },
  
  // Gujarat - Ahmedabad
  { id: 'GJ-AHM-1', name: 'Kalupur Railway Station', lat: 23.0225, lon: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  { id: 'GJ-AHM-2', name: 'Maninagar', lat: 23.0068, lon: 72.6120, city: 'Ahmedabad', state: 'Gujarat' },
  { id: 'GJ-AHM-3', name: 'Vastrapur', lat: 23.0225, lon: 72.5400, city: 'Ahmedabad', state: 'Gujarat' },
  { id: 'GJ-AHM-4', name: 'Bodakdev', lat: 23.0225, lon: 72.5400, city: 'Ahmedabad', state: 'Gujarat' },
  { id: 'GJ-AHM-5', name: 'Naroda', lat: 23.0700, lon: 72.6500, city: 'Ahmedabad', state: 'Gujarat' },
  
  // Rajasthan - Jaipur
  { id: 'RJ-JAI-1', name: 'Pink City', lat: 26.9124, lon: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  { id: 'RJ-JAI-2', name: 'Vaishali Nagar', lat: 26.9124, lon: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  { id: 'RJ-JAI-3', name: 'C-Scheme', lat: 26.9124, lon: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  { id: 'RJ-JAI-4', name: 'Malviya Nagar', lat: 26.9124, lon: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  { id: 'RJ-JAI-5', name: 'Sitapura', lat: 26.9124, lon: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
];

// Comprehensive bus lines across states
const lines = [
  // Karnataka routes
  { id: 'KA-1', name: 'Majestic to Electronic City', headwayMinutes: 8, patternStopIds: ['KA-BLR-1','KA-BLR-2'], state: 'Karnataka' },
  { id: 'KA-2', name: 'Whitefield Express', headwayMinutes: 12, patternStopIds: ['KA-BLR-1','KA-BLR-3','KA-BLR-4'], state: 'Karnataka' },
  { id: 'KA-3', name: 'Indiranagar Local', headwayMinutes: 6, patternStopIds: ['KA-BLR-1','KA-BLR-5','KA-BLR-4'], state: 'Karnataka' },
  
  // Maharashtra routes
  { id: 'MH-1', name: 'CST to BKC', headwayMinutes: 10, patternStopIds: ['MH-MUM-1','MH-MUM-2'], state: 'Maharashtra' },
  { id: 'MH-2', name: 'Andheri Express', headwayMinutes: 15, patternStopIds: ['MH-MUM-1','MH-MUM-3','MH-MUM-4'], state: 'Maharashtra' },
  { id: 'MH-3', name: 'Thane Local', headwayMinutes: 8, patternStopIds: ['MH-MUM-1','MH-MUM-5'], state: 'Maharashtra' },
  
  // Delhi routes
  { id: 'DL-1', name: 'CP to Karol Bagh', headwayMinutes: 5, patternStopIds: ['DL-DEL-1','DL-DEL-2'], state: 'Delhi' },
  { id: 'DL-2', name: 'Lajpat Nagar Express', headwayMinutes: 7, patternStopIds: ['DL-DEL-1','DL-DEL-3'], state: 'Delhi' },
  { id: 'DL-3', name: 'Rohini Metro Feeder', headwayMinutes: 4, patternStopIds: ['DL-DEL-1','DL-DEL-4'], state: 'Delhi' },
  { id: 'DL-4', name: 'Dwarka Express', headwayMinutes: 12, patternStopIds: ['DL-DEL-1','DL-DEL-5'], state: 'Delhi' },
  
  // Tamil Nadu routes
  { id: 'TN-1', name: 'Central to T. Nagar', headwayMinutes: 6, patternStopIds: ['TN-CHN-1','TN-CHN-2'], state: 'Tamil Nadu' },
  { id: 'TN-2', name: 'Anna Nagar Local', headwayMinutes: 8, patternStopIds: ['TN-CHN-1','TN-CHN-3'], state: 'Tamil Nadu' },
  { id: 'TN-3', name: 'Velachery Express', headwayMinutes: 10, patternStopIds: ['TN-CHN-1','TN-CHN-4','TN-CHN-5'], state: 'Tamil Nadu' },
  
  // West Bengal routes
  { id: 'WB-1', name: 'Howrah to Park Street', headwayMinutes: 5, patternStopIds: ['WB-KOL-1','WB-KOL-2'], state: 'West Bengal' },
  { id: 'WB-2', name: 'Salt Lake Express', headwayMinutes: 15, patternStopIds: ['WB-KOL-1','WB-KOL-3','WB-KOL-4'], state: 'West Bengal' },
  { id: 'WB-3', name: 'Dum Dum Local', headwayMinutes: 8, patternStopIds: ['WB-KOL-1','WB-KOL-5'], state: 'West Bengal' },
  
  // Telangana routes
  { id: 'TS-1', name: 'Secunderabad to HITEC', headwayMinutes: 12, patternStopIds: ['TS-HYD-1','TS-HYD-2','TS-HYD-3'], state: 'Telangana' },
  { id: 'TS-2', name: 'Banjara Hills Local', headwayMinutes: 6, patternStopIds: ['TS-HYD-1','TS-HYD-4'], state: 'Telangana' },
  { id: 'TS-3', name: 'Charminar Express', headwayMinutes: 10, patternStopIds: ['TS-HYD-1','TS-HYD-5'], state: 'Telangana' },
  
  // Gujarat routes
  { id: 'GJ-1', name: 'Kalupur to Maninagar', headwayMinutes: 8, patternStopIds: ['GJ-AHM-1','GJ-AHM-2'], state: 'Gujarat' },
  { id: 'GJ-2', name: 'Vastrapur Local', headwayMinutes: 6, patternStopIds: ['GJ-AHM-1','GJ-AHM-3','GJ-AHM-4'], state: 'Gujarat' },
  { id: 'GJ-3', name: 'Naroda Express', headwayMinutes: 15, patternStopIds: ['GJ-AHM-1','GJ-AHM-5'], state: 'Gujarat' },
  
  // Rajasthan routes
  { id: 'RJ-1', name: 'Pink City Local', headwayMinutes: 10, patternStopIds: ['RJ-JAI-1','RJ-JAI-2'], state: 'Rajasthan' },
  { id: 'RJ-2', name: 'C-Scheme Express', headwayMinutes: 12, patternStopIds: ['RJ-JAI-1','RJ-JAI-3','RJ-JAI-4'], state: 'Rajasthan' },
  { id: 'RJ-3', name: 'Sitapura Local', headwayMinutes: 8, patternStopIds: ['RJ-JAI-1','RJ-JAI-5'], state: 'Rajasthan' },
];

function generateUpcomingTimes(headwayMinutes, count = 5) {
  const now = Date.now();
  const headwayMs = headwayMinutes * 60 * 1000;
  // Anchor departures at multiples of headway from midnight
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const sinceMidnight = now - today.getTime();
  const remainder = sinceMidnight % headwayMs;
  const firstDeparture = now + (headwayMs - remainder);
  const times = [];
  for (let i = 0; i < count; i++) times.push(new Date(firstDeparture + i * headwayMs).toISOString());
  return times;
}

module.exports = { stops, lines, generateUpcomingTimes };


