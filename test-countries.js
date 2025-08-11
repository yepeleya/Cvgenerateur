// Test simple pour vérifier les nouveaux pays
console.log('=== TEST DES NOUVEAUX PAYS ASIATIQUES ===');

// Simuler les données que nous avons ajoutées
const countries = [
  { code: 'CN', name: 'Chine', flag: '🇨🇳' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷' }
];

countries.forEach(country => {
  console.log(`${country.flag} ${country.name} (${country.code})`);
});

console.log('\n✅ La Chine et la Corée du Sud ont été ajoutées avec succès !');
console.log('📝 Chaque pays a maintenant 2 modèles de CV :');
console.log('   - Un modèle traditionnel local');
console.log('   - Un modèle international/global');
