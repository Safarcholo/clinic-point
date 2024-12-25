export const treatments = [
  {
    category: "Basic Treatments",
    items: [
      {
        id: "botox",
        name: "Botox",
        description: "Upper part of the face - consists of 3 areas: forehead, between eyebrows, and eye sides.",
        price: "400 NIS per area",
        duration: "10 minutes",
        details: []
      },
      {
        id: "hyaluronic",
        name: "Hyaluronic Acid",
        description: "Lower part of the face (lips, cheeks, mouth-side wrinkles, etc...)",
        price: "1,000-1,400 NIS per syringe",
        duration: "20-30 minutes",
        details: [
          "Treatment time for a single area (usually for younger people): 20 minutes",
          "Overall facial hyaluronic acid treatment time: 30 minutes"
        ]
      },
      {
        id: "skin-booster",
        name: "Skin Booster",
        description: "Treatment to refresh facial skin, fills small wrinkles, fills post-acne scars, creates smoother skin",
        price: "1,100 NIS per treatment",
        duration: "30 minutes",
        details: [
          "First-time treatment: A series of 2-3 treatments with 1-1.5 months intervals",
          "Afterwards, one treatment as needed for a 'boost'"
        ]
      },
      {
        id: "profhilo",
        name: "Profhilo",
        description: "6-point treatment to refresh facial skin",
        price: "1,600 NIS per treatment",
        duration: "30 minutes",
        details: [
          "First-time treatment: A series of 2-3 treatments with 1-1.5 months intervals",
          "Treatment time: 15 minutes",
          "Total treatment time: 30 minutes"
        ]
      },
      {
        id: "threads",
        name: "Threads (Aptos)",
        description: "Facial skin lifting using threads. Usually a minimum of 2 threads on each side.",
        price: "450 NIS per thread",
        duration: "30-45 minutes",
        details: [
          "Very mature clients 45 minutes",
          "No thread treatments for eye lifting"
        ]
      }
    ]
  },
  {
    category: "Major Treatments",
    items: [
      {
        id: "sculptra",
        name: "Sculptra",
        description: "Skin renewal, encourages collagen production",
        price: "4,000 NIS",
        duration: "1 hour",
        details: [
          "Advantage is that it lasts up to 1.5-2 years",
          "First-time: Series of 2-3 treatments. Afterwards as needed",
          "The client should arrive 15 minutes early to apply numbing cream"
        ]
      },
      {
        id: "estafil",
        name: "Estafil",
        description: "Skin renewal, encourages collagen production",
        price: "3,500 NIS",
        duration: "1 hour",
        details: [
          "Advantage is that it lasts up to 1.5-2 years",
          "First-time: Series of 2-3 treatments. Afterwards as needed",
          "The client should arrive 15 minutes early to apply numbing cream"
        ]
      },
      {
        id: "oledia",
        name: "Oledia",
        description: "Skin renewal, encourages collagen production",
        price: "3,000 NIS",
        duration: "1 hour",
        details: [
          "Advantage is that it lasts up to 1.5-2 years",
          "First-time: Series of 2-3 treatments. Afterwards as needed",
          "The client should arrive 15 minutes early to apply numbing cream"
        ]
      }
    ]
  },
  {
    category: "Special Treatments",
    items: [
      {
        id: "botox-migraine",
        name: "Botox for Migraine",
        description: "Treatment for migraine relief",
        price: "3,500 NIS",
        duration: "Varies",
        details: [
          "Not 100% effective",
          "Sometimes works very well and sometimes has no effect",
          "No way to know in advance, should be considered carefully"
        ]
      },
      {
        id: "botox-sweating",
        name: "Botox for Excessive Sweating",
        description: "Treatment for palms, armpits",
        price: "3,500 NIS",
        duration: "Varies",
        details: [
          "Not 100% effective",
          "Sometimes works very well and sometimes has no effect",
          "No way to know in advance, should be considered carefully"
        ]
      }
    ]
  }
];

// Helper function to get all treatments as a flat array
export const getAllTreatments = () => {
  const savedTreatments = localStorage.getItem('treatments');
  if (savedTreatments) {
    const parsedTreatments = JSON.parse(savedTreatments);
    return parsedTreatments.reduce((acc, category) => [...acc, ...category.items], []);
  }
  return treatments.reduce((acc, category) => [...acc, ...category.items], []);
};

export const initializeTreatments = () => {
  if (!localStorage.getItem('treatments')) {
    localStorage.setItem('treatments', JSON.stringify(treatments));
  }
};