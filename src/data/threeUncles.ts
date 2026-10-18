// Every fact on the site lives here. Menus, prices, hours and contact details are
// transcribed from each location's own page on threeuncles.co.uk (October 2026).
// Catering from /chinese-catering-london, press and awards from /ourstory and the homepage.

export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export const DAYS: Day[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const DAY_NAMES: Record<Day, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

/** 24-hour "HH:MM", London time. */
export interface Span {
  open: string
  close: string
}
export type WeekHours = Record<Day, Span | null>

const every = (open: string, close: string): WeekHours =>
  Object.fromEntries(DAYS.map((d) => [d, { open, close }])) as WeekHours

export type Tag = 'v' | 'n'

export interface MenuItem {
  /** Stable key, used by the glass counter to read prices. */
  id?: string
  name: string
  price: number
  detail?: string
  tags?: Tag[]
}

export interface MenuGroup {
  title?: string
  items: MenuItem[]
}

export interface MenuSection {
  id: string
  title: string
  /** Character section mark, from their menu graphics. */
  mark: string
  kicker?: string
  groups: MenuGroup[]
  sauces?: { price: number; names: string[] }
  /** Plain lines, e.g. a drinks list. */
  lines?: string[]
  note?: string
  unavailable?: string
}

export interface Photo {
  src: string
  alt: string
  /** Width / height. */
  ratio: number
  credit?: string
}

export interface Faq {
  q: string
  a: string
}

export type Service = 'table' | 'counter'

export interface Location {
  slug: string
  name: string
  /** Words for the vertical neon sign, one per column. */
  sign: string[]
  area: string
  service: Service
  /** One line on how it works, for the fascia. */
  tagline: string
  /** How it works, in their words where they have them. */
  serviceNotes: string[]
  intro: string
  address: string[]
  postcode: string
  /** Postcode centroid (postcodes.io), used only to find the nearest site. */
  coords: [number, number]
  mapUrl: string
  phone?: { display: string; tel: string }
  email: string
  hours: WeekHours
  hoursText: string[]
  /** Minutes before closing that last orders are taken, where the site says so. */
  lastOrdersMinutes?: number
  lastOrdersText?: string
  opened: string
  menu: MenuSection[]
  /** Item ids shown as "what's good here". */
  highlights: string[]
  photos: Photo[]
  faq?: Faq[]
  sourceUrl: string
}

const img = (name: string) => `img/${name}`

const SAUCES = {
  price: 1,
  names: [
    'Soy & Rock Sugar',
    'Plum Sauce',
    'Ginger & Spring Onion Sauce',
    'Hainan Chilli Vinegar Sauce',
    'HK Chilli Oil',
  ],
}

const RICE_KICKER = 'Served with Pak Choi and steamed Jasmine rice'

const roastedCore = (opts: { porkOrder?: 'belly-first' | 'char-siu-first'; extraGroups?: MenuGroup[]; comboExtras?: MenuItem[] } = {}): MenuSection => {
  const belly: MenuItem = { id: 'pork-belly-rice', name: 'Crispy Pork Belly and Rice', price: 13.5 }
  const charSiu: MenuItem = { id: 'char-siu-rice', name: 'Char Siu BBQ Pork and Rice', price: 12.95 }
  return {
    id: 'roasted',
    title: 'Roasted',
    mark: '烤',
    kicker: RICE_KICKER,
    groups: [
      { title: 'Duck', items: [{ id: 'duck-rice', name: 'Roast Duck and Rice', price: 15.5 }] },
      { title: 'Pork', items: opts.porkOrder === 'char-siu-first' ? [charSiu, belly] : [belly, charSiu] },
      { title: 'Chicken', items: [{ id: 'hainan-rice', name: 'Hainan Chicken with Rice', price: 13.5 }] },
      ...(opts.extraGroups ?? []),
      {
        title: 'Roast Meat Combo',
        items: [
          { id: 'combo-2', name: 'Choose any 2 meats with rice', price: 14.95 },
          { id: 'combo-3', name: 'Choose any 3 meats with rice', price: 16.5 },
          ...(opts.comboExtras ?? []),
        ],
      },
    ],
    sauces: SAUCES,
  }
}

const loMein: MenuSection = {
  id: 'noodles',
  title: 'Lo Mein Noodles',
  mark: '麵',
  kicker: 'Egg Noodles topped with Roast Meat',
  groups: [
    {
      items: [
        { id: 'duck-char-siu-lo-mein', name: 'Roast Duck & Char Siu Lo Mein', price: 15.95 },
        { id: 'brisket-lo-mein', name: 'Beef Brisket & Mooli Lo Mein', price: 13.95 },
        { id: 'wonton-lo-mein', name: 'Wonton & Char Siu Lo Mein', price: 13.95 },
      ],
    },
  ],
}

const threeTreasures: MenuItem = {
  id: 'three-treasures',
  name: 'Three Treasures Platter for 2',
  price: 27.5,
  detail: 'Duck, Char Siu, Crispy Pork',
}

export const locations: Location[] = [
  {
    slug: 'brixton-village',
    name: 'Brixton Village',
    sign: ['BRIXTON', 'VILLAGE'],
    area: 'South London',
    service: 'table',
    tagline: 'Table service · eat in or take away · no bookings',
    serviceNotes: [
      'Table service. Eat in or take away.',
      'No reservations needed, first-come first-served.',
    ],
    intro:
      'Our first sit-down restaurant, inside the Brixton Village indoor market. White tiles, red neon, the roast meats hanging in the window and the kitchen in full view, with tables inside and out in the covered arcade.',
    address: ['Unit 19 & 20, Brixton Village', 'London SW9 8PR'],
    postcode: 'SW9 8PR',
    coords: [51.4625662, -0.1124847],
    mapUrl: 'https://maps.app.goo.gl/PLqUSUBot3qQFP5K7',
    phone: { display: '020 3903 8597', tel: '+442039038597' },
    email: 'brixton@threeuncles.co.uk',
    hours: {
      mon: { open: '11:45', close: '18:30' },
      tue: { open: '11:45', close: '22:00' },
      wed: { open: '11:45', close: '22:00' },
      thu: { open: '11:45', close: '22:00' },
      fri: { open: '11:45', close: '22:30' },
      sat: { open: '11:45', close: '22:30' },
      sun: { open: '11:45', close: '21:30' },
    },
    hoursText: [
      'MON: 11:45 AM – 6:30 PM',
      'TUES–THURS: 11:45 AM – 10:00 PM',
      'FRI–SAT: 11:45 AM – 10:30 PM',
      'SUN: 11:45 AM – 9:30 PM',
    ],
    opened: 'March 2022',
    menu: [
      roastedCore(),
      {
        id: 'specials',
        title: 'Brixton Specials',
        mark: '燒味',
        groups: [
          {
            items: [
              threeTreasures,
              { id: 'noodle-soup', name: 'Roast Duck & Char Siu Noodle Soup', price: 16.25, detail: 'Lai Fun Noodles' },
              {
                id: 'broccoli',
                name: 'Salt & Pepper Broccoli',
                price: 9.75,
                detail: 'Tenderstem Broccoli, Baby Corn, Fine Beans',
                tags: ['v'],
              },
              {
                id: 'mapo-tofu',
                name: 'Mushroom Mapo Tofu',
                price: 10.5,
                detail: 'Diced Mushrooms & Soft Tofu in a Spicy Chilli Oil',
                tags: ['v'],
              },
              { id: 'pak-choi', name: 'Pak Choi', price: 5.95 },
              { id: 'rice', name: 'Jasmine Rice', price: 2.75 },
            ],
          },
        ],
      },
      loMein,
      {
        id: 'dimsum',
        title: 'Dim Sum',
        mark: '點心',
        kicker: 'Freshly Steamed',
        groups: [
          {
            items: [
              { id: 'char-siu-bao', name: 'Char Siu Bao', price: 5.5 },
              { id: 'mushroom-bao', name: 'Mushroom & Pak Choi Bao', price: 5.5 },
              { id: 'lamb-dumplings', name: 'Lamb Dumplings with Chilli Vinegar', price: 7.5 },
              { id: 'siu-mai', name: 'Pork & Prawn Siu Mai', price: 6 },
              { id: 'chilli-wontons', name: 'Wontons in Chilli Oil', price: 6.75 },
              { id: 'fishballs', name: 'Curry Fishballs', price: 5.75 },
              { id: 'fried-wontons', name: 'Deep Fried Wontons', price: 7.75 },
            ],
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        mark: '喝',
        groups: [],
        lines: ['Wine, Beer, Soft Drinks & Fresh Juices'],
      },
    ],
    highlights: ['three-treasures', 'noodle-soup', 'duck-rice'],
    photos: [
      { src: img('brixton-shopfront'), alt: 'The blue Three Uncles shopfront in Brixton Village, red neon in the window and red benches in the arcade', ratio: 0.8 },
      { src: img('brixton-arcade'), alt: 'Diners at tables in the Brixton Village arcade outside Three Uncles', ratio: 0.8 },
      { src: img('brixton-dishes'), alt: 'Roast duck and char siu noodle soup, char siu, mushroom mapo tofu and fried wontons on a table', ratio: 1.5 },
    ],
    faq: [
      { q: 'Can I book a table?', a: 'No reservations needed, first-come first-served. Lunchtime can bring a queue, and it moves.' },
      { q: 'Can I eat in or take away?', a: 'Both. Sit down and we’ll serve you at the table, or take it away.' },
      {
        q: 'Is there anything vegetarian?',
        a: 'Two Brixton specials: Salt & Pepper Broccoli (v) and Mushroom Mapo Tofu (v). There’s also Mushroom & Pak Choi Bao in the dim sum.',
      },
      { q: 'Do you serve alcohol?', a: 'Yes. Wine and beer, plus soft drinks and fresh juices.' },
      { q: 'How do I find you?', a: 'Unit 19 & 20 inside Brixton Village market, about five minutes’ walk from Brixton tube.' },
    ],
    sourceUrl: 'https://www.threeuncles.co.uk/brixton',
  },
  {
    slug: 'liverpool-street',
    name: 'Liverpool Street',
    sign: ['LIVERPOOL', 'STREET'],
    area: 'The City',
    service: 'counter',
    tagline: 'Counter service · 15 seats · first come, first served',
    serviceNotes: [
      'Counter service with indoor seating for 15, first come first served.',
      'Soft drinks and fresh juices are in the display fridge.',
    ],
    intro: 'Our first location. We opened here in 2019 and have been serving hungry East Londoners ever since.',
    address: ['12 Devonshire Row, Liverpool Street', 'London EC2M 4RH'],
    postcode: 'EC2M 4RH',
    coords: [51.516863, -0.080078],
    mapUrl: 'https://maps.app.goo.gl/JhhJnqM8WvpcpjWW7',
    phone: { display: '020 7375 3573', tel: '+442073753573' },
    email: 'city@threeuncles.co.uk',
    hours: every('11:45', '21:00'),
    hoursText: ['MON – SUN: 11:45am – 9:00pm'],
    opened: '2019',
    menu: [
      roastedCore(),
      loMein,
      {
        id: 'dimsum',
        title: 'Dim Sum',
        mark: '點心',
        kicker: 'Freshly Steamed',
        groups: [
          {
            items: [
              { id: 'char-siu-bao', name: 'Char Siu Bao', price: 5.95 },
              { id: 'mushroom-bao', name: 'Mushroom & Pak Choi Bao', price: 5.5 },
              { id: 'lamb-dumplings', name: 'Lamb Dumplings with Chilli Vinegar', price: 7.5 },
              { id: 'siu-mai', name: 'Pork & Prawn Siu Mai', price: 6 },
              { id: 'chilli-wontons', name: 'Wontons in Chilli Oil', price: 7.25 },
              { id: 'fishballs', name: 'Curry Fishballs', price: 5.75 },
            ],
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        mark: '喝',
        groups: [],
        lines: ['Soft Drinks & Fresh Juices'],
        note: 'Our soft drinks and fresh juices can be found in the display fridge.',
      },
    ],
    highlights: ['duck-rice', 'combo-2', 'chilli-wontons'],
    photos: [
      { src: img('ls-neon-sign'), alt: 'The vertical red neon Three Uncles sign at Liverpool Street', ratio: 0.667 },
      { src: img('ls-hanging-ducks'), alt: 'Roast ducks hanging in the window at Liverpool Street', ratio: 1.5 },
      { src: img('ls-queue'), alt: 'A queue inside the door at Liverpool Street, white tiles and a 燒味 poster', ratio: 2.11 },
    ],
    sourceUrl: 'https://www.threeuncles.co.uk/liverpool-street',
  },
  {
    slug: 'camden',
    name: 'Camden',
    sign: ['CAMDEN'],
    area: 'North London',
    service: 'counter',
    tagline: 'Foodhall kiosk · communal seats over the canal',
    serviceNotes: [
      'Inside the Hawley Wharf foodhall, Camden Market.',
      'Plenty of communal seating overlooking the Regent’s Canal.',
    ],
    intro: 'Small but mighty: our little Chinese roast meats restaurant inside the famous Camden Market.',
    address: ['Unit 199, Hawley Wharf, 2nd Floor Foodhall', 'Water Ln., London NW1 8AA'],
    postcode: 'NW1 8AA',
    coords: [51.5418542, -0.144567],
    mapUrl: 'https://maps.app.goo.gl/hbqnnsuTVjTvd5kK6',
    phone: { display: '07597 602281', tel: '+447597602281' },
    email: 'camden@threeuncles.co.uk',
    hours: every('12:00', '20:45'),
    hoursText: ['MON – SUN: 12:00pm – 8:45pm'],
    opened: '2021',
    menu: [
      roastedCore(),
      loMein,
      {
        id: 'dimsum',
        title: 'Sides',
        mark: '點心',
        kicker: 'Freshly Steamed',
        groups: [
          {
            items: [
              { id: 'fishballs', name: 'Curry Fishballs', price: 5.75 },
              { id: 'char-siu-bao', name: 'Char Siu Bao', price: 5.95 },
              { id: 'chilli-wontons', name: 'Wontons in Chilli Oil', price: 7.25 },
              { id: 'mushroom-bao', name: 'Mushroom & Pak Choi Bao', price: 5.5 },
              { id: 'siu-mai', name: 'Pork & Prawn Siu Mai', price: 6 },
            ],
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        mark: '喝',
        groups: [],
        lines: ['Soft Drinks & Beer', 'Water, Coke, Diet Coke, Sprite, Tiger Beer'],
      },
    ],
    highlights: ['duck-rice', 'char-siu-rice', 'fishballs'],
    photos: [
      { src: img('camden-queue'), alt: 'Customers at the Camden glass counter, roast ducks hanging under the red neon sign', ratio: 0.667 },
      { src: img('char-siu-hanging'), alt: 'Glazed char siu hanging on hooks', ratio: 0.8 },
    ],
    sourceUrl: 'https://www.threeuncles.co.uk/camden',
  },
  {
    slug: 'st-pauls',
    name: 'St Paul’s',
    sign: ['ST', 'PAUL’S'],
    area: 'The City',
    service: 'counter',
    tagline: 'Counter service · grab and go · 40 seats',
    serviceNotes: ['Grab and go, with 40 seats and counter service.', 'A beer & wine selection.'],
    intro: 'Just a stone’s throw from St Paul’s Cathedral. Traditional Cantonese roast meats, always chopped fresh to order.',
    address: ['3 Old Bailey', 'London EC4M 7BG'],
    postcode: 'EC4M 7BG',
    coords: [51.514239, -0.1023503],
    mapUrl: 'https://maps.app.goo.gl/VmrphrCD6PXzZhYy9',
    phone: { display: '020 7248 0290', tel: '+442072480290' },
    email: 'stpauls@threeuncles.co.uk',
    hours: every('11:45', '21:00'),
    hoursText: ['MON – SUN: 11:45am – 9:00pm'],
    opened: '2023',
    menu: [
      roastedCore({ porkOrder: 'char-siu-first' }),
      {
        id: 'specials',
        title: 'St Paul’s Special',
        mark: '燒味',
        groups: [],
        unavailable: 'Currently unavailable. More to come soon.',
      },
      loMein,
      {
        id: 'dimsum',
        title: 'Dim Sum',
        mark: '點心',
        kicker: 'Freshly Cooked',
        groups: [
          {
            items: [
              { id: 'char-siu-bao', name: 'Char Siu Bao', price: 5.95 },
              { id: 'mushroom-bao', name: 'Mushroom & Pak Choi Bao', price: 5.5 },
              { id: 'lamb-dumplings', name: 'Lamb Dumplings with Chilli Vinegar', price: 7.25 },
              { id: 'siu-mai', name: 'Pork & Prawn Siu Mai', price: 6 },
              { id: 'chilli-wontons', name: 'Wontons in Chilli Oil', price: 7.25 },
              { id: 'fishballs', name: 'Curry Fishballs', price: 5.75 },
            ],
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        mark: '喝',
        groups: [],
        unavailable: 'Drinks list coming soon.',
      },
    ],
    highlights: ['duck-rice', 'pork-belly-rice', 'lamb-dumplings'],
    photos: [
      { src: img('stpauls-shopfront'), alt: 'The blue Three Uncles shopfront on Old Bailey, St Paul’s', ratio: 1 },
      { src: img('uncles-hoarding'), alt: 'The three uncles outside the St Paul’s site before it opened, their childhood photo on the hoarding', ratio: 0.804 },
    ],
    sourceUrl: 'https://www.threeuncles.co.uk/stpauls',
  },
  {
    slug: 'ealing',
    name: 'Ealing',
    sign: ['EALING'],
    area: 'West London',
    service: 'table',
    tagline: 'Table service · no bookings · outdoor seats in summer',
    serviceNotes: [
      'Casual, with table service. 35 indoor seats, plus outdoor seating in summer.',
      'No reservations needed, first-come first-served.',
    ],
    intro:
      'Directly across from the Ealing Filmworks: the spot for a meal before or after a movie. Our biggest restaurant yet, with its own special menu.',
    address: ['13 Filmworks Walk', 'London W5 5FA'],
    postcode: 'W5 5FA',
    coords: [51.512204, -0.306583],
    mapUrl: 'https://maps.app.goo.gl/3KERQG4SyDUEmE8T9',
    email: 'ealing@threeuncles.co.uk',
    hours: {
      mon: { open: '11:45', close: '21:30' },
      tue: { open: '11:45', close: '21:30' },
      wed: { open: '11:45', close: '21:30' },
      thu: { open: '11:45', close: '21:30' },
      fri: { open: '11:45', close: '22:00' },
      sat: { open: '11:45', close: '22:00' },
      sun: { open: '11:45', close: '21:00' },
    },
    hoursText: ['MON–THU: 11:45am – 9:30pm', 'FRI–SAT: 11:45am – 10pm', 'SUN: 11:45am – 9pm'],
    lastOrdersMinutes: 30,
    lastOrdersText: 'Last orders are 30 minutes before closing time.',
    opened: '2024',
    menu: [
      roastedCore({ comboExtras: [threeTreasures] }),
      {
        id: 'ealing-special',
        title: 'Ealing Special Menu',
        mark: '燒味',
        kicker: 'Some of Hong Kong’s favourite dishes, chosen for you by the Three Uncles.',
        groups: [
          {
            title: 'Small Dishes',
            items: [
              {
                id: 'prawn-toast',
                name: 'Banquet Prawn Toast',
                price: 8.95,
                detail: 'Deep-fried minced prawn on toast, garnished with black and white sesame seeds, served with our sweet and sour sauce',
              },
              {
                id: 'cheung-fun',
                name: 'Shek Wu Hui Chee Cheong Fun',
                price: 5,
                detail: 'Steamed rice noodle rolls drizzled with sesame paste, hoisin sauce, homemade chilli sauce, and topped with sesame seeds',
              },
            ],
          },
          {
            title: 'Large Dishes',
            items: [
              {
                id: 'curry-brisket',
                name: 'HK Curry Brisket with Rice',
                price: 13,
                detail: 'Braised beef brisket with potatoes and carrots in a mild Cantonese-style curry sauce, served with jasmine rice',
              },
            ],
          },
          {
            title: 'Desserts',
            items: [
              {
                id: 'custard-bun',
                name: 'Deep Fried Custard Bun',
                price: 5.25,
                detail: 'Deep-fried sweet bao filled with salted egg and creamy custard',
              },
              {
                id: 'mango-pudding',
                name: 'Mango Pudding',
                price: 5,
                detail: 'Chilled mango pudding topped with fresh mango purée, cream, and juicy mango chunks',
              },
            ],
          },
        ],
      },
      loMein,
      {
        id: 'noodle-soup',
        title: 'Noodle Soup',
        mark: '麵',
        groups: [
          { items: [{ id: 'noodle-soup', name: 'Roast Duck & Char Siu Noodle Soup', price: 16.25, detail: 'Lai Fun Noodles' }] },
        ],
      },
      {
        id: 'veg',
        title: 'Vegetables & Sides',
        mark: '烤',
        groups: [
          {
            items: [
              { id: 'broccoli', name: 'Salt & Pepper Broccoli', price: 9.75, detail: 'Tenderstem broccoli, Baby corn, Fine beans', tags: ['v'] },
              { id: 'mapo-tofu', name: 'Mushroom Mapo Tofu', price: 10.5, detail: 'Diced Mushrooms & Soft Tofu in a Spicy Chilli Oil', tags: ['v'] },
              { id: 'pak-choi', name: 'Pak Choi', price: 5.95, tags: ['v'] },
              { id: 'rice', name: 'Jasmine Rice', price: 2.75 },
            ],
          },
        ],
      },
      {
        id: 'dimsum',
        title: 'Dim Sum',
        mark: '點心',
        kicker: 'Freshly Steamed',
        groups: [
          {
            items: [
              { id: 'char-siu-bao', name: 'Char Siu Bao', price: 5.95 },
              { id: 'mushroom-bao', name: 'Mushroom & Pak Choi Bao', price: 5.5, tags: ['v'] },
              { id: 'lamb-dumplings', name: 'Lamb Dumplings with Chilli Vinegar', price: 7.5 },
              { id: 'siu-mai', name: 'Pork & Prawn Siu Mai', price: 6 },
              { id: 'chilli-wontons', name: 'Wontons in Chilli Oil', price: 7.25 },
              { id: 'fishballs', name: 'Curry Fishballs', price: 5.75, tags: ['n'] },
              { id: 'fried-wontons', name: 'Deep Fried Wontons', price: 7.95 },
            ],
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        mark: '喝',
        groups: [],
        lines: ['Wine, Beer, Soft Drinks & Fresh Juices'],
      },
    ],
    highlights: ['cheung-fun', 'curry-brisket', 'three-treasures'],
    photos: [
      { src: img('ealing-interior'), alt: 'Inside Three Uncles Ealing: red mesh ceiling, red pendant lights and the open counter', ratio: 1 },
      { src: img('ealing-specials'), alt: 'The Ealing special menu: curry brisket, prawn toast, cheung fun, custard buns', ratio: 1.5 },
      { src: img('ealing-cheung-fun'), alt: 'Shek Wu Hui chee cheong fun with sesame, hoisin and chilli sauces', ratio: 0.667 },
    ],
    sourceUrl: 'https://www.threeuncles.co.uk/ealing',
  },
  {
    slug: 'kings-cross',
    name: 'King’s Cross',
    sign: ['KING’S', 'CROSS'],
    area: 'North London',
    service: 'counter',
    tagline: 'Order at the counter · walk-ins only · 40 seats',
    serviceNotes: [
      'Walk-ins only. Order and pay at the counter, then collect your food when we call your number.',
      '40 seats inside, plus a few outside under a canopy. Eat in or take away.',
      'Beer and wine. Step-free entrance and an accessible toilet.',
    ],
    intro:
      'At 66 York Way, around five minutes’ walk behind King’s Cross station, with St Pancras, Granary Square and Coal Drops Yard nearby. Roast duck, char siu and crispy pork belly, chopped to order behind the glass counter.',
    address: ['66 York Way', 'London N1 9AG'],
    postcode: 'N1 9AG',
    coords: [51.534241, -0.121969],
    mapUrl: 'https://share.google/cZdSzHy9HUnkEC2BK',
    email: 'kingscross@threeuncles.co.uk',
    hours: every('11:45', '21:30'),
    hoursText: ['MON – SUN: 11:45am – 9:30pm'],
    lastOrdersMinutes: 15,
    lastOrdersText: 'Last orders are at 9:15pm.',
    opened: '2026',
    menu: [
      roastedCore({
        extraGroups: [
          { title: 'Tofu', items: [{ id: 'mapo-tofu-rice', name: 'Mushroom Mapo Tofu Rice', price: 12, tags: ['v'] }] },
        ],
      }),
      loMein,
      {
        id: 'dimsum',
        title: 'Dim Sum',
        mark: '點心',
        kicker: 'Freshly Steamed',
        groups: [
          {
            items: [
              { id: 'char-siu-bao', name: 'Char Siu Bao', price: 5.95 },
              { id: 'mushroom-bao', name: 'Mushroom & Pak Choi Bao', price: 5.5, tags: ['v'] },
              { id: 'lamb-dumplings', name: 'Lamb Dumplings with Chilli Vinegar', price: 7.5 },
              { id: 'siu-mai', name: 'Pork & Prawn Siu Mai', price: 6 },
              { id: 'chilli-wontons', name: 'Wontons in Chilli Oil', price: 7.25 },
              { id: 'fishballs', name: 'Curry Fishballs', price: 5.75, tags: ['n'] },
            ],
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        mark: '喝',
        groups: [],
        lines: ['Soft Drinks & Fresh Juices'],
        note: 'Our soft drinks and fresh juices can be found in the display fridge. We also serve beer and wine.',
      },
    ],
    highlights: ['duck-rice', 'mapo-tofu-rice', 'char-siu-bao'],
    photos: [{ src: img('roast-duck-plate'), alt: 'Chopped Cantonese roast duck on a blue-and-white plate', ratio: 0.8 }],
    faq: [
      {
        q: 'Where is Three Uncles King’s Cross?',
        a: 'You’ll find us at 66 York Way, London N1 9AG, behind King’s Cross station and around five minutes’ walk along York Way. Granary Square, Coal Drops Yard and St Pancras station are also nearby.',
      },
      {
        q: 'Can I book a table?',
        a: 'We’re walk-ins only and don’t take bookings. We’re open throughout the day for lunch and dinner, just drop in.',
      },
      {
        q: 'Can I eat in or order takeaway?',
        a: 'Both. We have 40 seats inside, plus a few outside, or you can take your food away. Order and pay at the counter, then collect your food when we call your number. We don’t currently offer delivery from King’s Cross.',
      },
      {
        q: 'Do you offer catering for offices in King’s Cross?',
        a: 'Yes, we offer catering for office lunches, meetings and events in King’s Cross. See our catering page to explore the options and send us an enquiry.',
      },
      { q: 'What are your opening hours?', a: 'We’re open Monday to Sunday, 11:45am–9:30pm. Last orders are at 9:15pm.' },
      {
        q: 'Do you have vegetarian and vegan options?',
        a: 'Yes. Our mushroom mapo tofu with jasmine rice, pak choi and Hong Kong chilli oil is vegan. Vegetarian options include mushroom and pak choi bao, and pak choi lo mein with egg noodles.',
      },
      { q: 'Is the restaurant wheelchair accessible?', a: 'Yes. We have a step-free entrance, wheelchair access and an accessible toilet.' },
      {
        q: 'Do you have outdoor seating, and are dogs welcome?',
        a: 'We have a small outdoor seating area under a canopy, sheltered from the rain. Pet dogs are welcome outside, but not inside the restaurant. Guide dogs are welcome inside.',
      },
      { q: 'Do you serve alcohol?', a: 'Yes, we serve beer and wine.' },
    ],
    sourceUrl: 'https://www.threeuncles.co.uk/kings-cross',
  },
  {
    slug: 'brent-cross',
    name: 'Brent Cross',
    sign: ['BRENT', 'CROSS'],
    area: 'North London',
    service: 'counter',
    tagline: 'Kiosk in the District Food Hall, ground floor',
    serviceNotes: [
      'A roast meats kiosk inside the District Food Hall, ground floor of Brent Cross Shopping Centre.',
      'A quick bite between shops, or a pit stop before heading home.',
    ],
    intro: 'Shop ’til you chop. Freshly chopped Cantonese BBQ, rice boxes, noodles and steaming dim sum, inside Brent Cross Shopping Centre.',
    address: ['Unit 4, District Foodhall, Brent Cross Shopping Centre', 'Prince Charles Drive, London NW4 3FP'],
    postcode: 'NW4 3FP',
    coords: [51.576419, -0.223766],
    mapUrl: 'https://maps.app.goo.gl/aab6oyx6J3SJAMro8',
    phone: { display: '07404 305444', tel: '+447404305444' },
    email: 'brentcross@threeuncles.co.uk',
    hours: every('12:00', '21:00'),
    hoursText: ['MON – SUN: 12pm – 9pm'],
    lastOrdersMinutes: 30,
    lastOrdersText: 'Last orders are 30 minutes before closing time.',
    opened: 'April 2025',
    menu: [
      roastedCore(),
      loMein,
      {
        id: 'noodle-soup',
        title: 'Noodle Soup',
        mark: '麵',
        groups: [
          { items: [{ id: 'noodle-soup', name: 'Roast Duck & Char Siu Noodle Soup', price: 14.5, detail: 'Lai Fun Noodles' }] },
        ],
      },
      {
        id: 'veg',
        title: 'Vegetables & Sides',
        mark: '烤',
        groups: [
          {
            items: [
              { id: 'broccoli', name: 'Salt & Pepper Broccoli', price: 7.95, detail: 'Tenderstem broccoli, Baby corn, Fine beans', tags: ['v'] },
              { id: 'mapo-tofu', name: 'Mushroom Mapo Tofu', price: 9, detail: 'Diced Mushrooms & Soft Tofu in a Spicy Chilli Oil', tags: ['v'] },
              { id: 'pak-choi', name: 'Pak Choi', price: 5.95, tags: ['v'] },
              { id: 'rice', name: 'Jasmine Rice', price: 2.75 },
            ],
          },
        ],
      },
      {
        id: 'dimsum',
        title: 'Dim Sum',
        mark: '點心',
        kicker: 'Freshly Steamed',
        groups: [
          {
            items: [
              { id: 'char-siu-bao', name: 'Char Siu Bao', price: 5.95 },
              { id: 'mushroom-bao', name: 'Mushroom & Pak Choi Bao', price: 5.5, tags: ['v'] },
              { id: 'lamb-dumplings', name: 'Lamb Dumplings with Chilli Vinegar', price: 7.25 },
              { id: 'siu-mai', name: 'Pork & Prawn Siu Mai', price: 6 },
              { id: 'chilli-wontons', name: 'Wontons in Chilli Oil', price: 7.25 },
              { id: 'fishballs', name: 'Curry Fishballs', price: 5.75, tags: ['n'] },
            ],
          },
        ],
      },
      {
        id: 'drinks',
        title: 'Drinks',
        mark: '喝',
        groups: [],
        lines: ['Wine, Beer, Soft Drinks & Fresh Juices'],
      },
    ],
    highlights: ['duck-rice', 'noodle-soup', 'broccoli'],
    photos: [{ src: img('bao'), alt: 'Char siu bao in a bamboo steamer', ratio: 0.8 }],
    sourceUrl: 'https://www.threeuncles.co.uk/brent-cross',
  },
]

export const bermondsey = {
  name: 'Bermondsey',
  sign: ['BERMONDSEY'],
  note: 'Delivery only, from our Deliveroo Editions kitchen.',
  url: 'https://deliveroo.co.uk/menu/london/bermondsey-2-editions/three-uncles-editions-ber',
  opened: '2023',
}

export const leadSlug = 'brixton-village'

export const group = {
  name: 'Three Uncles',
  legalName: 'Three Uncles Group Ltd',
  email: 'info@threeuncles.co.uk',
  instagram: { handle: '@three.uncles', url: 'https://www.instagram.com/three.uncles/' },
  facebook: 'https://www.facebook.com/three.uncles.london/',
  deliveroo: 'https://deliveroo.co.uk/brands/three-uncles',
  identityBy: 'Studio NinetyOne',
}

export const uncles = [
  {
    nickname: 'Uncle Sidney',
    name: 'Pui Sing Tsang',
    line: 'Ran his own Chinese restaurants before the three of them opened one together.',
  },
  {
    nickname: 'Uncle Lim',
    name: 'Cheong Yew',
    line: 'Chef. The one behind the curry sauce on the fishballs.',
  },
  {
    nickname: 'Uncle Mo',
    name: 'Mo Kwok',
    line: 'Chef, trained as a roast meat master. His father was a roast meat chef in Hong Kong in the 1970s and 80s.',
  },
]

// Their own words, from /ourstory.
export const storyLetter = [
  'We are three Hong Kong born childhood friends, chefs and restaurateurs who emigrated to the UK over 20 years ago. In 2019 we finally realised our dream to open a restaurant together and launched Three Uncles in London’s Liverpool Street.',
  'Siu Mei brings back treasured memories for us; growing up in Hong Kong in the 70s we would visit the famous roast meat cafes near Wan Chai market and watch the skilled chefs chopping delicious chunks of roast duck and char siu pork.',
  'Siu Mei remains one of the most popular types of food for everyday Hong Kongers, but in London we found you can only really find it in restaurants in Chinatown.',
  'All our roast meat recipes use the classic Cantonese technique; marinate on the inside, rub on the outside, hang and fan dry overnight, roast, rest, and serve.',
  'We look forward to bringing this much-loved everyday food to London to make it available to all as you would find across the Far East.',
]
export const storySignOff = '~Pui Sing, Cheong Yew & Mo (The Three Uncles)'

export const method = [
  { step: 'Marinate', detail: 'on the inside' },
  { step: 'Rub', detail: 'on the outside' },
  { step: 'Hang', detail: 'on the hooks' },
  { step: 'Fan dry', detail: 'overnight' },
  { step: 'Roast', detail: 'in ovens shipped from Hong Kong' },
  { step: 'Rest', detail: 'before it’s cut' },
  { step: 'Chop', detail: 'to order, behind the glass counter' },
]

// Dates checked against trade press and their own news posts. Their /ourstory
// timeline has Camden in 2020 and Brixton in 2021; both opened a year later.
export interface Milestone {
  year: string
  title: string
  body: string
  opens?: string[]
}
export const timeline: Milestone[] = [
  {
    year: '2019',
    title: 'Liverpool Street',
    body: 'A tiny roast meat counter on Devonshire Row, just off Bishopsgate. Queues from day one, and a fire alarm that went off every time the crispy pork went in.',
    opens: ['liverpool-street'],
  },
  {
    year: '2021',
    title: 'Camden',
    body: 'September: a small roast meat kiosk in the Hawley Wharf foodhall, overlooking the Regent’s Canal, brings siu mei north.',
    opens: ['camden'],
  },
  {
    year: '2022',
    title: 'Brixton Village',
    body: 'March: the first Three Uncles you can sit down in, in the old Tiger and Pig unit, with new special dishes. The Evening Standard reviews it; Time Out and The Good Food Guide follow.',
    opens: ['brixton-village'],
  },
  {
    year: '2023',
    title: 'St Paul’s and Bermondsey',
    body: 'A second City site on Old Bailey, and a Deliveroo Editions kitchen in Bermondsey for south London delivery.',
    opens: ['st-pauls', 'bermondsey'],
  },
  {
    year: '2024',
    title: 'Ealing',
    body: 'Our biggest restaurant yet opens opposite Ealing Filmworks, with its own special menu.',
    opens: ['ealing'],
  },
  {
    year: '2025',
    title: 'Brent Cross',
    body: 'A kiosk in the District Food Hall opens in April. Three Uncles wins Best Chinese Restaurant (London) at the Deliveroo Restaurant Awards.',
    opens: ['brent-cross'],
  },
  {
    year: '2026',
    title: 'King’s Cross',
    body: 'Our newest, at 66 York Way: order at the counter, 40 seats inside, beer and wine. Nominated at the City AM Toast Awards; featured by Condé Nast Traveller among London’s best Chinese restaurants.',
    opens: ['kings-cross'],
  },
]

// Worded exactly as on /ourstory.
export const awards = [
  { label: 'Winner', text: 'Best Chinese Restaurant (London), Deliveroo Restaurant Awards 2025', url: 'https://www.threeuncles.co.uk/news/deliveroo-restaurant-awards-2025-three-uncles' },
  { label: 'Shortlisted', text: 'Scalable Concept of the Year, R200 Awards 2025', url: 'https://www.threeuncles.co.uk/news/three-uncles-shortlisted-for-most-scalable-concept' },
  { label: 'Featured', text: 'Most Influential Restaurant Brands 2025, Restaurant Online', url: 'https://www.restaurantonline.co.uk/Article/2025/04/28/what-are-the-most-influential-new-restaurant-brands/' },
  { label: 'Nominated', text: 'Best Casual Dining Restaurant, City AM Toast Awards 2026', url: 'https://www.threeuncles.co.uk/news/best-casual-dining-at-the-city-am-toast-awards-2026' },
  { label: 'Featured', text: 'Among London’s Best Chinese Restaurants, Condé Nast Traveller 2026', url: 'https://www.threeuncles.co.uk/news/three-uncles-named-among-london-s-best-chinese-restaurants-by-condé-nast-traveller' },
  { label: 'Featured', text: 'Best Restaurants Near Liverpool Street, Ideal Magazine', url: 'https://www.threeuncles.co.uk/news/three-uncles-featured-among-the-best-restaurants-near-liverpool-street-by-ideal-magazine' },
  { label: 'Featured', text: 'Camden Market Guide, Dinner Ladies', url: 'https://www.dinnerladiesltd.com/behind-the-scenes/street-food-101-dinner-ladies-guide-to-camden-market' },
]

// Quotes worded exactly as credited on the homepage and /ourstory.
export interface Quote {
  source: string
  author?: string
  note?: string
  text: string
  /** Sites the piece was about, for showing on location pages. */
  about?: string[]
}
export const press: Quote[] = [
  {
    source: 'Evening Standard',
    author: 'Jimi Famurewa',
    text: '…cooking of immense focus, skill and real endorphin-spiking intensity. It is ancient artistry, sharpened by its placement in a slick new frame',
    about: ['brixton-village'],
  },
  {
    source: 'The Telegraph',
    author: 'Keith Miller',
    text: 'the roast meats were superb... A particular hit was Hainan chicken...But for want of a cleverer phrase, it’s just profoundly, soul-soothingly chickeny.',
  },
  {
    source: 'The Good Food Guide',
    text: 'The duck (‘a wondrous blush pink’) is cooked to near perfection.',
    about: ['brixton-village'],
  },
  { source: 'Eater London', text: 'Elite Cantonese roast meat.' },
  { source: 'Time Out', note: '2023', text: 'One of London’s Best Chinese Restaurants', about: ['brixton-village'] },
  { source: 'Hot Dinners', text: 'They’ve got a hell of a reputation for their cantonese roast meats.' },
  {
    source: 'City Matters',
    text: 'Serving up damn good Cantonese roasted meats, noodles and dim sum they brought takeaway-friendly Chinese food out of Chinatown and into the Square Mile. And we all got to benefit from this when we were in the area.',
    about: ['liverpool-street'],
  },
  { source: 'Ealing Nub News', text: 'Easily the best Cantonese food in the area.', about: ['ealing'] },
  { source: 'Olive Magazine', text: 'Best Chinese Restaurants in London 2021' },
  {
    source: 'House of Coco',
    text: 'Three Uncles is changing the Asian street food game for good. These dishes, genuinely authentic and so wonderfully executed, reminded me of busy Sunday evenings in my grandmother’s kitchen, bringing me closer to home in a way that only good food can achieve.',
  },
]

export const catering = {
  email: 'catering@threeuncles.co.uk',
  intro:
    'Cantonese roast meat catering for London offices and private events. Delivered fresh, on platters ready to share.',
  replyPromise: 'We’ll come back to you with a quote within 24 hours.',
  packages: [
    {
      id: 'platter-16',
      name: 'Mixed Roast Meat Platters',
      perHead: 16,
      dimSumChoices: 2,
      meats: ['Roast duck', 'Char siu', 'Crispy pork', 'Hainan chicken'],
      includes: ['Choice of two dim sum dishes', 'Jasmine rice', 'Lo mein noodles with pak choi', 'All sauces included'],
      veg: 'Vegetarian option available: Mushroom mapo tofu (v)',
    },
    {
      id: 'platter-20',
      name: 'Mixed Roast Meat Platters',
      perHead: 20,
      dimSumChoices: 3,
      meats: ['Roast duck', 'Char siu', 'Crispy pork', 'Hainan chicken'],
      includes: ['Choice of three dim sum dishes', 'Jasmine rice', 'Lo mein noodles with pak choi', 'All sauces included'],
      veg: 'Vegetarian option available: Mushroom mapo tofu (v)',
    },
  ],
  boxes: 'Anything from the main menu in individual meal boxes, delivered directly to offices or events.',
  // From their catering platters post.
  dimSum: [
    'Pork & prawn siu mai',
    'Pork & prawn wontons in chilli oil',
    'Lamb dumplings in chilli vinegar',
    'Char siu bbq pork bao',
    'Curry fishballs',
    'Mushroom & pak choi bao (v)',
  ],
  byWeight: [
    { id: 'whole-duck', name: 'Whole Duck', price: 39.5 },
    { id: 'half-duck', name: 'Half Duck', price: 20 },
    { id: 'pork-belly-kg', name: 'Crispy Pork Belly (Kilo)', price: 35.5 },
    { id: 'pork-belly-half', name: 'Crispy Pork Belly (Half)', price: 19 },
    { id: 'char-siu-kg', name: 'Char Siu Pork (Kilo)', price: 35.5 },
    { id: 'char-siu-half', name: 'Char Siu Pork (Half)', price: 18 },
  ],
  rules: {
    collectionMin: 300,
    deliveryMin: 1000,
    deliveryHeadcount: 75,
    largeOrder: 500,
    noticeSmall: 48,
    noticeLarge: 72,
    deliverooNoticeHours: 24,
  },
  clients: ['Amazon', 'Blank Street', 'Sky'],
  faq: [
    {
      q: 'What is the minimum order?',
      a: 'For delivery to your office or venue, the minimum order is £1,000. For catering orders between £300 and £1,000, we offer collection from any branch.',
    },
    {
      q: 'What if I want to order catering less than £300?',
      a: 'For orders under £300, we suggest placing an advance order via Deliveroo with at least 24 hours’ notice.',
    },
    {
      q: 'Do you deliver to weddings and private events?',
      a: 'Yes, for orders over the minimum spend: typically 75 people or more, or £1,000.',
    },
    { q: 'Can I customise the menu?', a: 'Yes. The set menus are suggestions and can be customised.' },
    {
      q: 'How far in advance should I order?',
      a: 'Orders under £500: ideally 48 hours’ notice. Larger orders: ideally 72 hours’ notice. For urgent requests, email catering@threeuncles.co.uk.',
    },
    { q: 'Do you deliver outside of London?', a: 'No. We currently only deliver within London.' },
    {
      q: 'Are disposable plates and cutlery provided?',
      a: 'We provide napkins, disposable chopsticks and disposable cutlery. If you need plates, email catering@threeuncles.co.uk.',
    },
    { q: 'Can I pay via invoice?', a: 'Yes. Payment can be made via invoice or payment link.' },
  ],
}

export const newsletter = {
  title: 'Join our newsletter',
  consent: 'Yes, I want to be notified.',
}

export const SITE_URL = 'https://alexwilder-dev.github.io/three-uncles/'
