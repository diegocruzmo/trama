export const categories = [
  { id: 'jeans', label: 'Jeans' },
  { id: 'camisas', label: 'Camisas y camisetas' },
  { id: 'chaquetas', label: 'Chaquetas' },
  { id: 'pantalones', label: 'Pantalones y bermudas' },
  { id: 'buzos', label: 'Buzos' },
];

export const cuts = [
  { id: 'regular-straight', label: 'Regular y recto' },
  { id: 'skinny-slim', label: 'Skinny y slim' },
  { id: 'taper', label: 'Taper' },
  { id: 'loose-baggy', label: 'Loose y baggy' },
  { id: 'relaxed', label: 'Relaxed y boyfriend' },
];

export const categoryLabel = id => categories.find(category => category.id === id)?.label ?? id;
