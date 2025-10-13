// src/utils/locationData.js

// ⚠️ PLACEHOLDER: This data is a placeholder because the backend does not currently provide
// an API endpoint to fetch states and their corresponding local governments.
// When an endpoint like `GET /api/locations/states` is available, this static data
// should be replaced with a dynamic API call (e.g., using React Query).

export const states = [
  {
    name: 'Lagos State',
    lgas: ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  },
  {
    name: 'FCT, Abuja',
    lgas: ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
  },
  {
    name: 'Rivers State',
    lgas: ['Abua–Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio-Akpor', 'Ogba–Egbema–Ndoni', 'Ogu–Bolo', 'Okrika', 'Omuma', 'Opobo–Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
  },
  {
    name: 'Oyo State',
    lgas: ['Akinyele', 'Afijio', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Kajola', 'Lagelu', 'Ogbomosho North', 'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
  },
];

// Helper function to get LGAs for a given state name
export const getLgasByState = (stateName) => {
  const state = states.find(s => s.name === stateName);
  return state ? state.lgas : [];
};