export type CuratedLabel = {
  id: string;
  pexelsId: number;
  source: string;
  curatorNote: string;
  expected: {
    garmentType: string;
    style: string;
    material: string;
    occasion: string;
    location: {
      continent: string;
      country: string;
      city: string;
    };
  };
};

/**
 * Manually curated Pexels street-fashion / garment photos.
 * Expected attributes were assigned by reviewing each Pexels photo page and visible garment cues.
 * Location is "unknown" for stock photos unless the scene clearly implies a region.
 */
export const CURATED_LABELS: CuratedLabel[] = [
  { id: "fashion-001", pexelsId: 1536619, source: "pexels", curatorNote: "Woman in white sleeveless summer dress outdoors", expected: { garmentType: "dress", style: "casual", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-002", pexelsId: 985635, source: "pexels", curatorNote: "Woman in black blazer and trousers business look", expected: { garmentType: "blazer", style: "business", material: "wool blend", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-003", pexelsId: 1126993, source: "pexels", curatorNote: "Woman in red evening dress", expected: { garmentType: "dress", style: "elegant", material: "satin", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-004", pexelsId: 1462637, source: "pexels", curatorNote: "Woman in off-shoulder floral dress", expected: { garmentType: "dress", style: "romantic", material: "chiffon", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-005", pexelsId: 937481, source: "pexels", curatorNote: "Man in denim jacket street style", expected: { garmentType: "jacket", style: "streetwear", material: "denim", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-006", pexelsId: 1310650, source: "pexels", curatorNote: "Woman in striped shirt and jeans", expected: { garmentType: "shirt", style: "casual", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-007", pexelsId: 2880507, source: "pexels", curatorNote: "Woman in beige trench coat", expected: { garmentType: "coat", style: "classic", material: "cotton", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-008", pexelsId: 1926769, source: "pexels", curatorNote: "Woman in yellow sundress", expected: { garmentType: "dress", style: "casual", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-009", pexelsId: 994523, source: "pexels", curatorNote: "Man in suit formal wear", expected: { garmentType: "suit", style: "formal", material: "wool", occasion: "formal", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-010", pexelsId: 2687181, source: "pexels", curatorNote: "Woman in black leather jacket", expected: { garmentType: "jacket", style: "edgy", material: "leather", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-011", pexelsId: 2887720, source: "pexels", curatorNote: "Woman in knit sweater and skirt", expected: { garmentType: "sweater", style: "preppy", material: "knit", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-012", pexelsId: 1040945, source: "pexels", curatorNote: "Man in hoodie streetwear", expected: { garmentType: "hoodie", style: "streetwear", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-013", pexelsId: 3070063, source: "pexels", curatorNote: "Woman in maxi boho dress", expected: { garmentType: "dress", style: "bohemian", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-014", pexelsId: 3094799, source: "pexels", curatorNote: "Woman in athletic leggings and sports top", expected: { garmentType: "activewear", style: "athletic", material: "synthetic", occasion: "athletic", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-015", pexelsId: 3184405, source: "pexels", curatorNote: "Woman in pink cocktail dress", expected: { garmentType: "dress", style: "party", material: "satin", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-016", pexelsId: 3229343, source: "pexels", curatorNote: "Man in white t-shirt and jeans minimal look", expected: { garmentType: "t-shirt", style: "minimalist", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-017", pexelsId: 3317729, source: "pexels", curatorNote: "Woman in plaid skirt preppy outfit", expected: { garmentType: "skirt", style: "preppy", material: "wool", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-018", pexelsId: 3525903, source: "pexels", curatorNote: "Woman in oversized coat layered street style", expected: { garmentType: "coat", style: "streetwear", material: "wool", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-019", pexelsId: 3624622, source: "pexels", curatorNote: "Woman in silk blouse work outfit", expected: { garmentType: "blouse", style: "business", material: "silk", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-020", pexelsId: 3711677, source: "pexels", curatorNote: "Man in polo shirt smart casual", expected: { garmentType: "polo", style: "smart casual", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-021", pexelsId: 3771837, source: "pexels", curatorNote: "Woman in denim jacket and dress", expected: { garmentType: "jacket", style: "casual", material: "denim", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-022", pexelsId: 3838389, source: "pexels", curatorNote: "Woman in white wedding-style gown", expected: { garmentType: "gown", style: "formal", material: "satin", occasion: "formal", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-023", pexelsId: 3890579, source: "pexels", curatorNote: "Woman in patterned kimono-inspired robe", expected: { garmentType: "robe", style: "bohemian", material: "silk", occasion: "casual", location: { continent: "Asia", country: "unknown", city: "unknown" } } },
  { id: "fashion-024", pexelsId: 4007672, source: "pexels", curatorNote: "Man in flannel shirt casual outdoors", expected: { garmentType: "shirt", style: "casual", material: "flannel", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-025", pexelsId: 4132364, source: "pexels", curatorNote: "Woman in sequin party top", expected: { garmentType: "top", style: "party", material: "sequin", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-026", pexelsId: 4210607, source: "pexels", curatorNote: "Woman in linen jumpsuit minimalist", expected: { garmentType: "jumpsuit", style: "minimalist", material: "linen", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-027", pexelsId: 4303480, source: "pexels", curatorNote: "Man in bomber jacket streetwear", expected: { garmentType: "jacket", style: "streetwear", material: "nylon", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-028", pexelsId: 4380976, source: "pexels", curatorNote: "Woman in turtleneck sweater winter look", expected: { garmentType: "sweater", style: "classic", material: "wool", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-029", pexelsId: 4458336, source: "pexels", curatorNote: "Woman in pleated midi skirt", expected: { garmentType: "skirt", style: "elegant", material: "polyester", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-030", pexelsId: 1183266, source: "pexels", curatorNote: "Man in chinos and button-down shirt", expected: { garmentType: "shirt", style: "smart casual", material: "cotton", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-031", pexelsId: 1204463, source: "pexels", curatorNote: "Woman in crop top and high-waist trousers street style", expected: { garmentType: "top", style: "streetwear", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-032", pexelsId: 4586665, source: "pexels", curatorNote: "Woman in faux fur coat luxury winter", expected: { garmentType: "coat", style: "luxury", material: "faux fur", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-033", pexelsId: 4641822, source: "pexels", curatorNote: "Man in vest and dress shirt formal", expected: { garmentType: "vest", style: "formal", material: "wool", occasion: "formal", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-034", pexelsId: 4676645, source: "pexels", curatorNote: "Woman in wrap dress office wear", expected: { garmentType: "dress", style: "business", material: "jersey", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-035", pexelsId: 4750306, source: "pexels", curatorNote: "Woman in graphic tee and denim skirt", expected: { garmentType: "t-shirt", style: "streetwear", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-036", pexelsId: 4768290, source: "pexels", curatorNote: "Man in tracksuit athletic wear", expected: { garmentType: "tracksuit", style: "athletic", material: "polyester", occasion: "athletic", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-037", pexelsId: 4834896, source: "pexels", curatorNote: "Woman in embroidered ethnic top", expected: { garmentType: "top", style: "bohemian", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-038", pexelsId: 4881617, source: "pexels", curatorNote: "Woman in camel wool coat classic", expected: { garmentType: "coat", style: "classic", material: "wool", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-039", pexelsId: 1229414, source: "pexels", curatorNote: "Man in leather biker jacket", expected: { garmentType: "jacket", style: "edgy", material: "leather", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-040", pexelsId: 1239291, source: "pexels", curatorNote: "Woman in slip dress minimalist evening", expected: { garmentType: "dress", style: "minimalist", material: "silk", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-041", pexelsId: 4972001, source: "pexels", curatorNote: "Woman in puffer jacket winter streetwear", expected: { garmentType: "jacket", style: "streetwear", material: "nylon", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-042", pexelsId: 5025665, source: "pexels", curatorNote: "Man in shorts and linen shirt summer", expected: { garmentType: "shorts", style: "casual", material: "linen", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-043", pexelsId: 5060867, source: "pexels", curatorNote: "Woman in cardigan layered casual", expected: { garmentType: "cardigan", style: "casual", material: "knit", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-044", pexelsId: 1251198, source: "pexels", curatorNote: "Woman in evening gown red carpet style", expected: { garmentType: "gown", style: "formal", material: "satin", occasion: "formal", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-045", pexelsId: 5110847, source: "pexels", curatorNote: "Man in suit navy business formal", expected: { garmentType: "suit", style: "business", material: "wool", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-046", pexelsId: 5138894, source: "pexels", curatorNote: "Woman in wide-leg trousers minimalist", expected: { garmentType: "trousers", style: "minimalist", material: "linen", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-047", pexelsId: 5184112, source: "pexels", curatorNote: "Woman in off-duty model denim on denim", expected: { garmentType: "jeans", style: "streetwear", material: "denim", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-048", pexelsId: 5201876, source: "pexels", curatorNote: "Woman in summer floral midi dress", expected: { garmentType: "dress", style: "romantic", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-049", pexelsId: 5255632, source: "pexels", curatorNote: "Man in overcoat winter classic", expected: { garmentType: "coat", style: "classic", material: "wool", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-050", pexelsId: 5288474, source: "pexels", curatorNote: "Woman in athleisure sports bra and leggings", expected: { garmentType: "activewear", style: "athletic", material: "spandex", occasion: "athletic", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-051", pexelsId: 5326908, source: "pexels", curatorNote: "Woman in trench and scarf Parisian-inspired", expected: { garmentType: "coat", style: "classic", material: "cotton", occasion: "workwear", location: { continent: "Europe", country: "unknown", city: "unknown" } } },
  { id: "fashion-052", pexelsId: 5378708, source: "pexels", curatorNote: "Man in Hawaiian shirt vacation casual", expected: { garmentType: "shirt", style: "casual", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-053", pexelsId: 5409812, source: "pexels", curatorNote: "Woman in power suit blazer and trousers", expected: { garmentType: "blazer", style: "business", material: "wool", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-054", pexelsId: 1261425, source: "pexels", curatorNote: "Woman in crochet top festival boho", expected: { garmentType: "top", style: "bohemian", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-055", pexelsId: 1281819, source: "pexels", curatorNote: "Man in cargo pants utility streetwear", expected: { garmentType: "trousers", style: "streetwear", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-056", pexelsId: 5611962, source: "pexels", curatorNote: "Woman in satin slip skirt evening", expected: { garmentType: "skirt", style: "elegant", material: "satin", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-057", pexelsId: 5699456, source: "pexels", curatorNote: "Woman in parka outdoor winter", expected: { garmentType: "jacket", style: "casual", material: "nylon", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-058", pexelsId: 5732448, source: "pexels", curatorNote: "Man in vest and tie wedding guest formal", expected: { garmentType: "suit", style: "formal", material: "wool", occasion: "formal", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-059", pexelsId: 5816292, source: "pexels", curatorNote: "Woman in oversized blazer and bike shorts street", expected: { garmentType: "blazer", style: "streetwear", material: "polyester", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-060", pexelsId: 5889475, source: "pexels", curatorNote: "Woman in knit dress winter casual", expected: { garmentType: "dress", style: "casual", material: "knit", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-061", pexelsId: 5903930, source: "pexels", curatorNote: "Man in denim shirt workwear casual", expected: { garmentType: "shirt", style: "casual", material: "denim", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-062", pexelsId: 5931583, source: "pexels", curatorNote: "Woman in halter top summer evening", expected: { garmentType: "top", style: "party", material: "cotton", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-063", pexelsId: 5997597, source: "pexels", curatorNote: "Woman in plaid blazer office style", expected: { garmentType: "blazer", style: "business", material: "wool", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-064", pexelsId: 6063283, source: "pexels", curatorNote: "Man in sweatshirt loungewear", expected: { garmentType: "sweatshirt", style: "casual", material: "cotton", occasion: "casual", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-065", pexelsId: 6109274, source: "pexels", curatorNote: "Woman in leather pants edgy night out", expected: { garmentType: "trousers", style: "edgy", material: "leather", occasion: "evening", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
  { id: "fashion-066", pexelsId: 1308881, source: "pexels", curatorNote: "Woman in white shirt dress minimalist work", expected: { garmentType: "dress", style: "minimalist", material: "cotton", occasion: "workwear", location: { continent: "unknown", country: "unknown", city: "unknown" } } },
];

export function toLabelsJson() {
  return CURATED_LABELS.map((entry) => ({
    id: entry.id,
    filename: `${entry.id}.jpg`,
    imageUrl: `https://images.pexels.com/photos/${entry.pexelsId}/pexels-photo-${entry.pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop`,
    source: entry.source,
    curatorNote: entry.curatorNote,
    expected: entry.expected,
  }));
}
