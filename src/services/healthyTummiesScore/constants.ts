
// Research-based nutritional recommendations by age (WHO/AAP guidelines)
export const NUTRITIONAL_RECOMMENDATIONS = {
  protein: { 6: 1.2, 12: 1.0, 24: 0.9, 36: 0.9 }, // g/kg/day
  iron: { 6: 11, 12: 7, 24: 7, 36: 10 }, // mg/day
  calcium: { 6: 200, 12: 260, 24: 700, 36: 700 }, // mg/day
  fiber: { 6: 5, 12: 8, 24: 14, 36: 16 }, // g/day
  sodium: { 6: 200, 12: 370, 24: 1000, 36: 1200 }, // mg/day max
  sugars: { 6: 0, 12: 25, 24: 25, 36: 25 } // g/day max
};

// Research-based additive risk categorization (AAP/FDA guidelines)
export const ADDITIVE_RISK_LEVELS = {
  artificial_colors: {
    'red 40': -40, 'e129': -40,
    'yellow 5': -35, 'e102': -35,
    'yellow 6': -35, 'e110': -35,
    'blue 1': -30, 'e133': -30,
    'red 3': -45, 'e127': -45,
    'green 3': -40, 'e143': -40
  },
  preservatives_high_risk: {
    'bha': -35, 'e320': -35,
    'bht': -30, 'e321': -30,
    'tbhq': -25, 'e319': -25,
    'sodium benzoate': -20,
    'potassium bromate': -50
  },
  artificial_sweeteners: {
    'aspartame': -30, 'e951': -30,
    'acesulfame k': -25, 'e950': -25,
    'sucralose': -20, 'e955': -20,
    'saccharin': -35, 'e954': -35
  },
  emulsifiers: {
    'carrageenan': -15,
    'polysorbate 80': -20,
    'lecithin': -5
  },
  flavor_enhancers: {
    'msg': -25, 'e621': -25,
    'disodium guanylate': -15,
    'disodium inosinate': -15
  },
  thickeners_stabilizers: {
    'xanthan gum': -5,
    'guar gum': -5,
    'agar': -3
  },
  natural_preservatives: {
    'vitamin e': 0, 'tocopherols': 0,
    'vitamin c': 0, 'ascorbic acid': 0,
    'citric acid': -2,
    'salt': -5
  },
  natural_colors: {
    'beetroot extract': 0,
    'turmeric': 0,
    'annatto': -2,
    'caramel color': -8
  }
};
