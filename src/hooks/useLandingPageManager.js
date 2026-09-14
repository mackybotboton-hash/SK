import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sk_landing_page_data';

const DEFAULT_DATA = {
  heroTitle: 'Empowering the Youth of Barangay Diatagon',
  heroDesc: 'Welcome to the centralized monitoring portal for Barangay Diatagon, Lianga, Surigao del Sur. Streamlining SK project proposals, 10% Barangay General Fund management, and youth development records.',
  facebookLink: 'https://www.facebook.com/sk.diatagon',
  facebookFollowers: '1.5K+',
  location: 'Purok 2, Diatagon, Lianga, Surigao del Sur, 8307',
  shortLocation: 'Purok 2',
  officials: [
    { id: '1', name: 'SK Chairperson', role: 'Executive Head & Ex-Officio Member', desc: 'Leads the SK Council, presides over youth policy & budget authorizations.', icon: '👑' },
    { id: '2', name: 'SK Secretary', role: 'Records & Communications', desc: 'Maintains official minutes, resolution archives, and public notices.', icon: '📜' },
    { id: '3', name: 'SK Treasurer', role: 'Financial Management', desc: 'Manages the 10% SK Fund allocations, statutory limits, and financial reports.', icon: '⚖️' },
    { id: '4', name: 'SK Kagawad (Youth Welfare)', role: 'Committee Chair', desc: 'Oversees youth health, wellness, and social development programs.', icon: '🌱' },
    { id: '5', name: 'SK Kagawad (Sports & Culture)', role: 'Committee Chair', desc: 'Organizes sports festivals, cultural activities, and youth tournaments.', icon: '🏆' },
    { id: '6', name: 'SK Kagawad (Education & Tech)', role: 'Committee Chair', desc: 'Drives educational assistance, digital literacy, and skill workshops.', icon: '🎓' }
  ]
};

export default function useLandingPageManager() {
  const [landingData, setLandingData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_DATA, ...parsed };
      }
      return DEFAULT_DATA;
    } catch (e) {
      return DEFAULT_DATA;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(landingData));
  }, [landingData]);

  const updateHeroContent = (updates) => {
    setLandingData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addOfficial = (official) => {
    setLandingData(prev => ({
      ...prev,
      officials: [...prev.officials, { ...official, id: Date.now().toString() }]
    }));
  };

  const updateOfficial = (id, updates) => {
    setLandingData(prev => ({
      ...prev,
      officials: prev.officials.map(o => o.id === id ? { ...o, ...updates } : o)
    }));
  };

  const removeOfficial = (id) => {
    setLandingData(prev => ({
      ...prev,
      officials: prev.officials.filter(o => o.id !== id)
    }));
  };

  return {
    landingData,
    updateHeroContent,
    addOfficial,
    updateOfficial,
    removeOfficial
  };
}
