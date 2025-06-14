
import { ScanResult } from './types';

export class MockDataService {
  static generateMockScanResult(): ScanResult {
    const mockProducts = [
      {
        productName: "Organic Baby Rice Cereal",
        brand: "Happy Baby",
        healthyTummiesScore: 85,
        scoreInterpretation: "Good option with minor considerations",
        scoreEmoji: "✅",
        scoreColor: "text-green-500",
        primaryMessage: "A solid choice with some minor areas for consideration.",
        nutriscore: "B",
        novaGroup: 2,
        ecoscore: "B"
      },
      {
        productName: "Sweet Potato Baby Food Puree",
        brand: "Gerber",
        healthyTummiesScore: 92,
        scoreInterpretation: "Excellent choice for your baby",
        scoreEmoji: "🌟",
        scoreColor: "text-green-600", 
        primaryMessage: "This product meets the highest standards for baby nutrition and safety.",
        nutriscore: "A",
        novaGroup: 1,
        ecoscore: "A"
      },
      {
        productName: "Fruit Snacks with Artificial Colors",
        brand: "Generic Brand",
        healthyTummiesScore: 25,
        scoreInterpretation: "Not recommended for your baby",
        scoreEmoji: "❌",
        scoreColor: "text-red-500",
        primaryMessage: "This product has significant concerns for baby nutrition and safety.",
        nutriscore: "E",
        novaGroup: 4,
        ecoscore: "D"
      }
    ];

    const selectedProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    
    return {
      product: {
        productName: selectedProduct.productName,
        brand: selectedProduct.brand,
        ingredients: ["Organic rice", "Iron", "Vitamin B1", "Vitamin B6"],
        nutritionalInfo: {
          calories: 120,
          protein: 2.5,
          carbs: 25,
          fat: 1.0,
          fiber: 0.5,
          sodium: 5,
          sugar: 1
        },
        allergens: [],
        additives: [],
        certifications: ["Organic", "Non-GMO"],
        imageUrl: "/placeholder.svg"
      },
      healthyTummiesScore: selectedProduct.healthyTummiesScore,
      scoreInterpretation: selectedProduct.scoreInterpretation,
      scoreEmoji: selectedProduct.scoreEmoji,
      scoreColor: selectedProduct.scoreColor,
      primaryMessage: selectedProduct.primaryMessage,
      detailedExplanations: [
        "💪 Rich in iron for healthy development",
        "🌱 Organic ingredients reduce exposure to pesticides",
        "✅ Age-appropriate texture and nutrition"
      ],
      breakdown: {
        age_appropriateness: 90,
        nutritional_quality: 85,
        safety_processing: 95,
        personalization: 80,
        external_scores: 88
      },
      nutriscore: selectedProduct.nutriscore,
      novaGroup: selectedProduct.novaGroup,
      ecoscore: selectedProduct.ecoscore,
      ageAppropriate: true,
      recommendations: [
        "Great choice for introducing solids",
        "Mix with breast milk for smoother texture"
      ],
      warningFlags: []
    };
  }
}
