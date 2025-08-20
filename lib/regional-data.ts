// Comprehensive regional food, brand, and cultural data for enhanced categorization

export interface RegionalData {
  dishes: string[]
  brands: string[]
  keywords: string[]
  restaurants: string[]
  ingredients: string[]
  translations?: Record<string, string[]>
}

export interface CulturalPattern {
  [key: string]: RegionalData
}

// Extensive regional food and cultural data
export const regionalPatterns: Record<string, CulturalPattern> = {
  food_dining: {
    asian: {
      dishes: [
        // Chinese Dishes - Expanded
        'pho', 'ramen', 'udon', 'soba', 'dim sum', 'xiaolongbao', 'mapo tofu', 'kung pao chicken', 'sweet and sour pork', 'peking duck',
        'dan dan noodles', 'hot pot', 'shabu shabu', 'siu mai', 'har gow', 'congee', 'century egg', 'char siu', 'wonton soup',
        'chow mein', 'lo mein', 'beef and broccoli', 'orange chicken', 'general tso chicken', 'cashew chicken', 'egg fried rice',
        'yangzhou fried rice', 'beef noodle soup', 'zhajiangmian', 'lamian', 'biang biang noodles', 'liangpi', 'roujiamo',
        'baozi', 'mantou', 'jianbing', 'youtiao', 'douhua', 'tanghulu', 'mooncake', 'egg tart', 'pineapple bun',
        'wonbok soup', 'ma la tang', 'sichuan hotpot', 'mongolian beef', 'twice cooked pork', 'fish fragrant eggplant',
        'salt and pepper squid', 'crispy duck', 'tea smoked duck', 'white cut chicken', 'drunken chicken', 'beggar chicken',
        
        // Japanese Dishes - Expanded
        'sushi', 'sashimi', 'tempura', 'yakitori', 'teriyaki', 'miso soup', 'onigiri', 'donburi', 'katsu', 'gyoza', 'takoyaki', 'okonomiyaki',
        'chirashi', 'nigiri', 'maki', 'gunkan', 'temaki', 'inari', 'unagi', 'maguro', 'sake', 'hamachi', 'ika', 'ebi',
        'tonkatsu', 'chicken katsu', 'katsu curry', 'oyakodon', 'gyudon', 'katsudon', 'chirashidon', 'tekkadon',
        'yakisoba', 'yaki udon', 'champon', 'tsukemen', 'mazesoba', 'tantanmen', 'shoyu ramen', 'shio ramen', 'miso ramen', 'tonkotsu ramen',
        'zaru soba', 'tempura soba', 'kitsune udon', 'nabeyaki udon', 'hiyashi chuka', 'somen', 'kishimen',
        'sukiyaki', 'shabu shabu', 'yakiniku', 'teppanyaki', 'robatayaki', 'kushikatsu', 'karaage', 'chicken nanban',
        'bento', 'ekiben', 'makunouchi', 'sake bento', 'unagi bento', 'chirashi bento', 'katsu sando', 'onigiri sando',
        'wagyu', 'kobe beef', 'toro', 'uni', 'ikura', 'mentaiko', 'natto', 'edamame', 'agedashi tofu', 'hiyayakko',
        'mochi', 'dango', 'daifuku', 'dorayaki', 'taiyaki', 'imagawayaki', 'kakigori', 'soft serve', 'matcha ice cream',
        
        // Korean Dishes - Expanded
        'bibimbap', 'bulgogi', 'kimchi', 'korean bbq', 'galbi', 'japchae', 'ramyeon', 'kimchi jjigae', 'doenjang jjigae', 'sundubu jjigae',
        'samgyeopsal', 'dakgalbi', 'jjajangmyeon', 'jjamppong', 'naengmyeon', 'mul naengmyeon', 'bibim naengmyeon',
        'tteokbokki', 'hotteok', 'bungeoppang', 'pajeon', 'kimchi pancake', 'bindaetteok', 'gamjatang', 'seolleongtang',
        'gimbap', 'korean fried chicken', 'yangnyeom chicken', 'dakgangjeong', 'bossam', 'jokbal', 'sundae', 'gopchang',
        'haemul pajeon', 'kimchi bokkeumbap', 'dolsot bibimbap', 'yukhoe', 'sannakji', 'hongeo', 'makgeolli', 'soju',
        'banchan', 'pickled radish', 'bean sprout soup', 'miyeok guk', 'janchi guksu', 'kong guksu', 'makguksu',
        
        // Thai Dishes - Expanded
        'pad thai', 'tom yum', 'tom kha', 'green curry', 'red curry', 'massaman', 'som tam', 'larb', 'pad see ew', 'drunken noodles', 'mango sticky rice',
        'pad krapow', 'pad gai', 'pad pak', 'pad woon sen', 'boat noodles', 'khao soi', 'tom klong', 'gaeng som',
        'gaeng keow wan', 'gaeng phed', 'gaeng panang', 'gaeng kari', 'gaeng tai pla', 'jungle curry',
        'thai fried rice', 'pineapple fried rice', 'crab fried rice', 'mango salad', 'papaya salad', 'beef salad',
        'satay chicken', 'satay beef', 'grilled fish', 'whole fish', 'steamed fish', 'fish cakes', 'tod mun pla',
        'spring rolls', 'fresh rolls', 'summer rolls', 'fried wontons', 'thai dumplings', 'kanom krok', 'thai crepe',
        'coconut ice cream', 'thai tea', 'thai coffee', 'lychee', 'rambutan', 'durian', 'jackfruit',
        
        // Vietnamese Dishes - Expanded
        'pho bo', 'pho ga', 'banh mi', 'spring rolls', 'fresh spring rolls', 'bun bo hue', 'cao lau', 'mi quang',
        'com tam', 'com suon', 'bun cha', 'bun bo nam bo', 'bun rieu', 'hu tieu', 'banh xeo', 'banh cuon',
        'goi cuon', 'cha ca', 'bo kho', 'canh chua', 'thit nuong', 'nem nuong', 'grilled pork', 'lemongrass beef',
        'vietnamese coffee', 'che ba mau', 'che dau xanh', 'banh flan', 'banh chuoi', 'sticky rice', 'xoi',
        
        // Indonesian/Malaysian Dishes - Expanded
        'satay', 'rendang', 'nasi goreng', 'mee goreng', 'char kway teow', 'hokkien mee', 'laksa', 'bak kut teh', 'hainanese chicken rice',
        'nasi lemak', 'roti canai', 'roti prata', 'murtabak', 'teh tarik', 'kaya toast', 'laksa johor', 'assam laksa',
        'char siu', 'wanton mee', 'lor mee', 'mee siam', 'mee rebus', 'fish head curry', 'chili crab', 'black pepper crab',
        'sambal kangkung', 'gado gado', 'rujak', 'es campur', 'cendol', 'abc soup', 'fish ball soup', 'yong tau foo',
        'ayam penyet', 'bebek goreng', 'gudeg', 'soto ayam', 'rawon', 'bakso', 'martabak', 'pisang goreng',
        
        // Indian Subcontinent Dishes - Expanded
        'biryani', 'curry', 'tandoori', 'naan', 'chapati', 'samosa', 'momo', 'dal', 'palak paneer', 'butter chicken', 'chicken tikka',
        'vada pav', 'pav bhaji', 'dosa', 'idli', 'uttapam', 'chaat', 'bhel puri', 'sev puri', 'aloo tikki', 'chole bhature', 'rajma', 'masala dosa',
        'chicken curry', 'mutton curry', 'fish curry', 'prawn curry', 'egg curry', 'vegetable curry', 'korma', 'vindaloo', 'madras curry',
        'tikka masala', 'chicken makhani', 'kadai chicken', 'chicken jalfrezi', 'chicken biryani', 'mutton biryani', 'vegetable biryani',
        'pulao', 'jeera rice', 'lemon rice', 'coconut rice', 'tamarind rice', 'curd rice', 'khichdi', 'upma', 'poha',
        'paratha', 'stuffed paratha', 'aloo paratha', 'gobi paratha', 'paneer paratha', 'keema paratha', 'laccha paratha',
        'roti', 'phulka', 'bhatura', 'kulcha', 'garlic naan', 'butter naan', 'keema naan', 'peshwari naan',
        'pakora', 'onion bhaji', 'vegetable pakora', 'chicken pakora', 'fish pakora', 'paneer pakora', 'bread pakora',
        'kebab', 'seekh kebab', 'shami kebab', 'boti kebab', 'fish tikka', 'paneer tikka', 'hariyali kebab',
        'rasgulla', 'gulab jamun', 'jalebi', 'laddu', 'barfi', 'kheer', 'kulfi', 'falooda', 'lassi', 'chai',
        'thali', 'gujarati thali', 'punjabi thali', 'south indian thali', 'bengali thali', 'rajasthani thali',
        'street food', 'chola bhatura', 'pani puri', 'dahi puri', 'aloo chat', 'papdi chaat', 'bhel', 'jhunka bhakar'
      ],
      brands: [
        'yoshinoya', 'panda express', 'pf changs', 'benihana', 'wagamama', 'din tai fung',
        'haidilao', 'ajisen', 'ippudo', 'genki sushi', 'sushi zanmai', 'marugame udon',
        'coco ichibanya', 'pepper lunch', 'mos burger', 'jollibee', 'max s restaurant',
        'goldilocks', 'chowking', 'mang inasal', 'tokyo tokyo', 'shakey s pizza',
        'crystal jade', 'paradise dynasty', 'tim ho wan', 'tsui wah', 'cafe de coral',
        'fairwood', 'maxim s', 'tak shing', 'pai thai', 'boat noodle', 'mango tree',
        'pepperoni', 'bonchon', 'kyochon', 'mcdonald s asia', 'kfc asia'
      ],
      keywords: [
        'asian fusion', 'chinese takeout', 'thai food', 'japanese restaurant', 'korean bbq',
        'indian curry', 'vietnamese pho', 'sushi bar', 'dim sum restaurant', 'hot pot place',
        'asian buffet', 'oriental cuisine', 'authentic asian', 'traditional asian',
        'street food', 'night market', 'food court', 'hawker center', 'izakaya',
        'boba tea', 'bubble tea', 'asian dessert', 'mochi ice cream'
      ],
      restaurants: [
        'panda express', 'pick up stix', 'pei wei', 'noodles & company',
        'pho saigon', 'pho 24', 'golden dragon', 'china garden', 'bamboo house',
        'sakura japanese', 'tokyo express', 'hibachi grill', 'sushi boat',
        'thai basil', 'elephant bar', 'spice thai', 'curry house', 'bollywood cafe'
      ],
      ingredients: [
        'soy sauce', 'fish sauce', 'oyster sauce', 'sesame oil', 'rice vinegar',
        'miso paste', 'wasabi', 'ginger', 'lemongrass', 'galangal', 'kaffir lime',
        'coconut milk', 'tamarind', 'star anise', 'five spice', 'szechuan pepper',
        'kimchi', 'gochujang', 'mirin', 'sake', 'panko', 'nori', 'kombu'
      ]
    },
    
    european: {
      dishes: [
        // Italian Dishes - Massively Expanded
        'pasta', 'pizza', 'gelato', 'risotto', 'gnocchi', 'lasagna', 'carbonara', 'bolognese', 'margherita', 'caprese', 'tiramisu', 'panna cotta', 'bruschetta', 'antipasti',
        'spaghetti', 'fettuccine', 'linguine', 'penne', 'rigatoni', 'fusilli', 'tagliatelle', 'orecchiette', 'farfalle', 'ravioli', 'tortellini', 'agnolotti',
        'amatriciana', 'arrabbiata', 'puttanesca', 'cacio e pepe', 'aglio e olio', 'pomodoro', 'pesto', 'alfredo', 'quattro formaggi', 'carbonara',
        'pizza napoletana', 'pizza romana', 'calzone', 'focaccia', 'panettone', 'pandoro', 'cannoli', 'sfogliatelle', 'biscotti', 'amaretti',
        'osso buco', 'saltimbocca', 'chicken parmigiana', 'veal marsala', 'piccata', 'scaloppine', 'brasato', 'bollito misto', 'cotoletta alla milanese',
        'minestrone', 'ribollita', 'pasta e fagioli', 'stracciatella', 'italian wedding soup', 'zuppa inglese', 'acquacotta', 'cacciucco',
        'prosciutto', 'mortadella', 'salami', 'pancetta', 'guanciale', 'bresaola', 'coppa', 'nduja', 'gorgonzola', 'parmigiano reggiano', 'pecorino',
        'arancini', 'supplì', 'frittata', 'polenta', 'carpaccio', 'vitello tonnato', 'caponata', 'peperonata', 'bagna cauda',
        'espresso', 'cappuccino', 'macchiato', 'affogato', 'granita', 'sorbetto', 'zabaglione', 'semifreddo', 'cassata', 'gelato al pistacchio',
        
        // French Dishes - Massively Expanded
        'croissant', 'crepe', 'baguette', 'quiche', 'ratatouille', 'bouillabaisse', 'coq au vin', 'beef bourguignon', 'cassoulet', 'escargot', 'foie gras',
        'pain au chocolat', 'croissant aux amandes', 'brioche', 'eclair', 'profiterole', 'chouquette', 'macaron', 'madeleine', 'canelé', 'paris brest',
        'french onion soup', 'vichyssoise', 'potage', 'bisque', 'velouté', 'consommé', 'pot au feu', 'blanquette de veau', 'boeuf en daube',
        'duck confit', 'magret de canard', 'coq au riesling', 'lapin aux pruneaux', 'navarin d agneau', 'gigot d agneau', 'rôti de porc',
        'bouillabaisse', 'soupe de poisson', 'plateau de fruits de mer', 'moules marinières', 'coquilles saint jacques', 'sole meunière', 'saumon en papillote',
        'ratatouille', 'tian', 'pistou', 'salade niçoise', 'pissaladière', 'tapenade', 'anchoïade', 'aioli', 'rouille',
        'crème brûlée', 'mousse au chocolat', 'tarte tatin', 'clafoutis', 'far breton', 'kouign amann', 'mille feuille', 'opera cake',
        'champagne', 'bordeaux', 'burgundy', 'côtes du rhône', 'sancerre', 'chablis', 'cognac', 'armagnac', 'calvados',
        'fromage', 'camembert', 'brie', 'roquefort', 'chèvre', 'comté', 'gruyère', 'emmental', 'reblochon', 'munster',
        
        // Spanish Dishes - Massively Expanded
        'paella', 'tapas', 'gazpacho', 'churros', 'tortilla española', 'jamón ibérico', 'patatas bravas', 'sangria', 'crema catalana', 'pincho', 'croquetas',
        'paella valenciana', 'paella de mariscos', 'paella mixta', 'fideuà', 'arroz negro', 'arroz con pollo', 'risotto de bogavante',
        'jamón serrano', 'chorizo', 'morcilla', 'lomo', 'cecina', 'manchego', 'cabrales', 'membrillo', 'picos de europa',
        'gambas al ajillo', 'pulpo a la gallega', 'pimientos de padrón', 'boquerones', 'anchoas', 'bacalao', 'pescaito frito',
        'cocido madrileño', 'fabada asturiana', 'lentejas', 'callos', 'rabo de toro', 'cordero al horno', 'lechazo', 'cabrito',
        'salmorejo', 'ajo blanco', 'gazpacho andaluz', 'sopa de ajo', 'migas', 'torrijas', 'pestiños', 'polvorones', 'turrón',
        'flan', 'natillas', 'arroz con leche', 'leche frita', 'filloas', 'roscos', 'magdalenas', 'sobaos', 'quesada',
        'sangria', 'tinto de verano', 'rebujito', 'queimada', 'orujo', 'brandy', 'sherry', 'cava', 'rioja', 'ribera del duero',
        
        // German/Austrian Dishes - Massively Expanded  
        'schnitzel', 'bratwurst', 'sauerkraut', 'pretzel', 'strudel', 'sauerbraten', 'currywurst', 'döner kebab', 'spätzle', 'weisswurst',
        'wiener schnitzel', 'schnitzel wien', 'cordon bleu', 'rouladen', 'schweinebraten', 'eisbein', 'kassler', 'leberwurst',
        'knockwurst', 'bockwurst', 'leberkäse', 'flönz', 'himmel un ääd', 'rheinischer sauerbraten', 'himmel und erde',
        'sauerkraut', 'rotkohl', 'knödel', 'semmelknödel', 'leberknödel', 'speckknödel', 'kartoffelknödel', 'dampfnudel',
        'apfelstrudel', 'topfenstrudel', 'kaiserschmarrn', 'sachertorte', 'schwarzwälder kirschtorte', 'baumkuchen', 'stollen',
        'lebkuchen', 'pfeffernüsse', 'spekuloos', 'brezn', 'laugenstange', 'streuselkuchen', 'donauwelle', 'frankfurter kranz',
        'beer', 'weissbier', 'pilsner', 'märzen', 'oktoberfest', 'kölsch', 'altbier', 'berliner weisse', 'radler', 'schnapps',
        
        // British Dishes - Massively Expanded
        'fish and chips', 'bangers and mash', 'shepherd pie', 'beef wellington', 'spotted dick', 'toad in the hole', 'bubble and squeak', 'haggis',
        'full english breakfast', 'black pudding', 'baked beans', 'grilled tomatoes', 'mushrooms', 'fried bread', 'hash browns',
        'sunday roast', 'roast beef', 'roast lamb', 'roast pork', 'roast chicken', 'yorkshire pudding', 'roast potatoes', 'mint sauce', 'gravy',
        'cottage pie', 'cornish pasty', 'scotch egg', 'pork pie', 'steak and kidney pie', 'chicken and mushroom pie', 'mince pies',
        'fish pie', 'cod', 'haddock', 'plaice', 'sole', 'salmon', 'kippers', 'smoked haddock', 'jellied eels',
        'banoffee pie', 'eton mess', 'trifle', 'bread and butter pudding', 'sticky toffee pudding', 'treacle tart', 'jam roly poly',
        'scones', 'clotted cream', 'jam', 'afternoon tea', 'cucumber sandwiches', 'tea cakes', 'crumpets', 'muffins',
        'cheddar', 'stilton', 'wensleydale', 'lancashire', 'red leicester', 'double gloucester', 'caerphilly',
        'ale', 'bitter', 'mild', 'stout', 'porter', 'ipa', 'lager', 'cider', 'gin', 'whisky', 'scotch',
        
        // Greek Dishes - Massively Expanded
        'moussaka', 'souvlaki', 'gyros', 'tzatziki', 'baklava', 'spanakopita', 'dolmades', 'feta cheese', 'greek salad', 'ouzo',
        'lamb souvlaki', 'pork souvlaki', 'chicken souvlaki', 'beef souvlaki', 'greek meatballs', 'keftedes', 'bifteki', 'kontosouvli',
        'tyropita', 'kotopita', 'kreatopita', 'horiatiki', 'dakos', 'greek village salad', 'fasolada', 'revithia', 'fakes',
        'avgolemono', 'psarosoupa', 'kreatosoupa', 'magiritsa', 'trahana', 'youvarlakia', 'gemista', 'papoutsakia',
        'pastitsio', 'kokoras krasatos', 'arni me fasolakia', 'kouneli stifado', 'psari plaki', 'garides saganaki',
        'galaktoboureko', 'kataifi', 'loukoumades', 'diples', 'kourabiedes', 'melomakarona', 'tsoureki', 'vasilopita',
        'retsina', 'assyrtiko', 'agiorgitiko', 'xinomavro', 'metaxa', 'tsipouro', 'mastiha', 'greek coffee', 'frappe'
      ],
      brands: [
        'olive garden', 'papa johns', 'dominos', 'pizza hut', 'little caesars',
        'nandos', 'prezzo', 'zizzi', 'ask italian', 'pizza express', 'franco manca',
        'carluccio s', 'bella italia', 'strada', 'gourmet burger kitchen',
        'wagamama', 'leon', 'pret a manger', 'eat', 'itsu', 'wasabi',
        'costa coffee', 'nero', 'starbucks europe', 'paul', 'maison kayser'
      ],
      keywords: [
        'italian restaurant', 'french bistro', 'german food', 'british pub',
        'spanish tapas', 'mediterranean', 'european cuisine', 'continental',
        'trattatoria', 'brasserie', 'gastro pub', 'wine bar', 'pizzeria',
        'greek taverna', 'austrian cafe', 'swiss restaurant'
      ],
      restaurants: [
        'mama mia', 'little italy', 'villa roma', 'chez pierre', 'le bistro',
        'the bull', 'ye olde pub', 'spanish table', 'el toro', 'athens cafe',
        'oktoberfest', 'bavarian inn', 'swiss chalet', 'scandinavian house'
      ],
      ingredients: [
        'olive oil', 'balsamic vinegar', 'parmesan', 'mozzarella', 'prosciutto',
        'basil', 'oregano', 'thyme', 'rosemary', 'saffron', 'paprika',
        'chorizo', 'manchego', 'gruyere', 'emmental', 'bratwurst',
        'feta', 'kasseri', 'phyllo', 'ouzo', 'retsina'
      ]
    },

    american: {
      dishes: [
        // Classic American Fast Food & Burgers - Expanded
        'burger', 'cheeseburger', 'double cheeseburger', 'bacon cheeseburger', 'mushroom swiss burger', 'bbq burger', 'chicken burger', 'veggie burger',
        'hot dog', 'chili dog', 'corn dog', 'chicago dog', 'new york hot dog', 'footlong', 'bratwurst', 'italian sausage', 'polish sausage',
        'french fries', 'onion rings', 'chicken nuggets', 'chicken tenders', 'mozzarella sticks', 'jalapeño poppers', 'loaded fries', 'curly fries',
        
        // BBQ & Southern Cuisine - Expanded
        'bbq', 'ribs', 'baby back ribs', 'spare ribs', 'brisket', 'pulled pork', 'burnt ends', 'smoked turkey', 'smoked chicken', 'pork shoulder',
        'fried chicken', 'southern fried chicken', 'chicken and waffles', 'buffalo wings', 'hot wings', 'bbq wings', 'honey mustard wings',
        'mac and cheese', 'baked mac and cheese', 'lobster mac and cheese', 'bacon mac and cheese', 'truffle mac and cheese',
        'coleslaw', 'potato salad', 'baked beans', 'cornbread', 'hush puppies', 'biscuits and gravy', 'chicken biscuit', 'sausage biscuit',
        'grits', 'shrimp and grits', 'cheese grits', 'jambalaya', 'gumbo', 'red beans and rice', 'dirty rice', 'étouffee', 'po boy', 'muffuletta',
        
        // Tex-Mex & Mexican-American - Expanded
        'nachos', 'loaded nachos', 'cheese nachos', 'quesadilla', 'chicken quesadilla', 'steak quesadilla', 'veggie quesadilla',
        'burrito', 'bean burrito', 'beef burrito', 'chicken burrito', 'breakfast burrito', 'california burrito', 'wet burrito',
        'taco', 'soft taco', 'hard taco', 'fish taco', 'carnitas taco', 'al pastor taco', 'carne asada taco', 'chicken taco',
        'enchilada', 'cheese enchilada', 'chicken enchilada', 'beef enchilada', 'fajita', 'chicken fajita', 'steak fajita', 'shrimp fajita',
        'chimichanga', 'tostada', 'chalupa', 'gordita', 'tamale', 'chiles rellenos', 'guacamole', 'salsa', 'queso dip', 'seven layer dip',
        
        // Sandwiches & Deli - Expanded
        'sandwich', 'club sandwich', 'blt', 'grilled cheese', 'tuna sandwich', 'turkey sandwich', 'ham sandwich', 'pastrami sandwich',
        'reuben', 'cuban sandwich', 'meatball sub', 'italian sub', 'hoagie', 'hero', 'grinder', 'cheesesteak', 'philly cheesesteak',
        'sloppy joe', 'monte cristo', 'panini', 'melt', 'patty melt', 'tuna melt', 'chicken salad sandwich', 'egg salad sandwich',
        
        // Steaks & Seafood - Expanded
        'steak', 'ribeye', 'sirloin', 'filet mignon', 'new york strip', 'porterhouse', 't-bone', 'prime rib', 'beef tenderloin',
        'lobster', 'lobster roll', 'crab cakes', 'fish and chips', 'fried shrimp', 'shrimp scampi', 'clam chowder', 'manhattan clam chowder',
        'oysters', 'fried oysters', 'oyster po boy', 'crawfish boil', 'crab legs', 'lobster bisque', 'fish tacos', 'salmon', 'cod', 'catfish',
        
        // Breakfast & Brunch - Expanded
        'pancakes', 'blueberry pancakes', 'chocolate chip pancakes', 'buttermilk pancakes', 'stack of pancakes', 'pancake breakfast',
        'waffles', 'belgian waffles', 'chicken and waffles', 'waffle fries', 'french toast', 'stuffed french toast', 'cinnamon french toast',
        'eggs benedict', 'eggs florentine', 'eggs royale', 'huevos rancheros', 'eggs over easy', 'scrambled eggs', 'omelet', 'frittata',
        'bacon', 'sausage', 'breakfast sausage', 'canadian bacon', 'ham', 'hash browns', 'home fries', 'breakfast burrito', 'bagel and lox',
        
        // American Desserts - Expanded
        'apple pie', 'cherry pie', 'pumpkin pie', 'pecan pie', 'key lime pie', 'lemon meringue pie', 'banana cream pie', 'chess pie',
        'cheesecake', 'new york cheesecake', 'strawberry cheesecake', 'chocolate cheesecake', 'carrot cake', 'red velvet cake', 'pound cake',
        'brownies', 'chocolate brownies', 'fudge brownies', 'blondies', 'cookies', 'chocolate chip cookies', 'oatmeal cookies', 'snickerdoodles',
        'ice cream', 'vanilla ice cream', 'chocolate ice cream', 'strawberry ice cream', 'ice cream sundae', 'banana split', 'root beer float',
        'milkshake', 'chocolate shake', 'vanilla shake', 'strawberry shake', 'oreo shake', 'peanut butter shake',
        's mores', 'funnel cake', 'cotton candy', 'caramel apples', 'kettle corn', 'fudge', 'saltwater taffy', 'whoopie pie',
        
        // Regional American Specialties - Expanded
        'chicago deep dish pizza', 'new york pizza', 'detroit style pizza', 'california pizza', 'white pizza', 'pepperoni pizza',
        'buffalo chicken dip', 'spinach artichoke dip', 'pigs in a blanket', 'deviled eggs', 'potato skins', 'stuffed mushrooms',
        'coney dog', 'california burrito', 'garbage plate', 'horseshoe sandwich', 'loose meat sandwich', 'tavern sandwich',
        'chicken fried steak', 'country fried steak', 'meatloaf', 'pot roast', 'beef stew', 'chili', 'white chili', 'cincinnati chili',
        'tater tots', 'sweet potato fries', 'blooming onion', 'fried pickles', 'corn on the cob', 'elote', 'corndog', 'state fair food'
      ],
      brands: [
        'mcdonalds', 'burger king', 'wendys', 'taco bell', 'kfc', 'popeyes',
        'chick fil a', 'subway', 'chipotle', 'qdoba', 'five guys', 'in n out',
        'shake shack', 'white castle', 'jack in the box', 'carl s jr', 'hardee s',
        'arby s', 'sonic', 'dairy queen', 'a&w', 'long john silver s',
        'cracker barrel', 'denny s', 'ihop', 'waffle house', 'applebee s',
        'chili s', 'tgi friday s', 'olive garden', 'red lobster', 'outback steakhouse'
      ],
      keywords: [
        'american diner', 'fast food', 'bbq joint', 'steakhouse', 'sports bar',
        'burger joint', 'drive thru', 'all american', 'classic american',
        'southern food', 'tex mex', 'cajun', 'soul food', 'comfort food',
        'food truck', 'roadside diner', 'mom and pop', 'hometown cooking'
      ],
      restaurants: [
        'main street diner', 'highway cafe', 'corner grill', 'hometown bbq',
        'american classic', 'red barn', 'blue plate', 'silver spoon',
        'golden corral', 'country kitchen', 'family restaurant'
      ],
      ingredients: [
        'ground beef', 'bacon', 'cheddar cheese', 'american cheese', 'ranch dressing',
        'bbq sauce', 'hot sauce', 'maple syrup', 'corn', 'black beans',
        'avocado', 'jalapeño', 'cilantro', 'lime', 'sour cream'
      ]
    },

    middleEastern: {
      dishes: [
        // Lebanese & Levantine - Expanded
        'hummus', 'hummus bi tahini', 'falafel', 'baba ganoush', 'tabbouleh', 'fattoush', 'kibbeh', 'kibbeh nayyeh', 'labneh', 'muhammara',
        'shawarma', 'chicken shawarma', 'lamb shawarma', 'beef shawarma', 'shawarma plate', 'manakish', 'za atar', 'cheese manakish',
        'kebab', 'shish kebab', 'kofta kebab', 'lamb kebab', 'chicken kebab', 'kafta', 'arayes', 'mixed grill', 'grilled halloumi',
        'dolma', 'stuffed grape leaves', 'warak enab', 'stuffed zucchini', 'kousa mahshi', 'stuffed cabbage', 'malfouf mahshi',
        'mansaf', 'makloubeh', 'ouzi', 'freekeh', 'burghul', 'mjadara', 'fatteh', 'fatteh hummus', 'fatteh djaj',
        'knafeh', 'ma amoul', 'baklava', 'muhallabia', 'riz bil halib', 'malabi', 'atayef', 'qatayef', 'basbousa', 'namoura',
        
        // Turkish - Expanded
        'turkish delight', 'lokum', 'turkish coffee', 'baklava', 'kunefe', 'turkish breakfast', 'menemen', 'sucuklu yumurta',
        'doner kebab', 'iskender kebab', 'adana kebab', 'urfa kebab', 'chicken doner', 'lamb doner', 'mixed doner', 'doner plate',
        'lahmacun', 'pide', 'turkish pizza', 'borek', 'su boregi', 'sigara boregi', 'spinach borek', 'cheese borek',
        'meze', 'turkish meze', 'cacik', 'haydari', 'ezme', 'kisir', 'dolma', 'turkish dolma', 'yaprak dolma',
        'kofte', 'inegol kofte', 'izmir kofte', 'turkish meatballs', 'cerkez tavugu', 'mantı', 'turkish dumplings',
        'turkish tea', 'chai', 'ayran', 'turkish yogurt drink', 'raki', 'turkish raki', 'turkish wine', 'efes beer',
        
        // Persian/Iranian - Expanded
        'persian rice', 'tahdig', 'polo', 'chelow', 'ghormeh sabzi', 'fesenjan', 'khoreshte bademjan', 'khoresh gheymeh',
        'kabob koobideh', 'joojeh kabob', 'barg kabob', 'soltani', 'persian kabob', 'chenjeh kabob', 'kabob torsh',
        'ash reshteh', 'dizi', 'abgoosht', 'kashke bademjan', 'mirza ghasemi', 'kuku', 'khorak', 'persian stew',
        'persian tea', 'chai', 'doogh', 'faloodeh', 'bastani', 'saffron ice cream', 'rosewater', 'persian sweets',
        'lavash', 'barbari', 'sangak', 'taftoon', 'persian bread', 'nan', 'khubz', 'pita bread',
        
        // Israeli/Jewish - Expanded
        'shakshuka', 'hummus israeli', 'israeli salad', 'jachnun', 'malawach', 'sabich', 'bourekas', 'falafel israeli',
        'schnitzel', 'israeli schnitzel', 'jerusalem mixed grill', 'shawarma israeli', 'laffa', 'pita israeli',
        'halva', 'tahini', 'amba', 'zhug', 'harissa', 'israeli breakfast', 'cottage cheese', 'lebane', 'kashkaval',
        
        // Moroccan/North African - Expanded
        'tagine', 'chicken tagine', 'lamb tagine', 'beef tagine', 'vegetable tagine', 'couscous', 'couscous royal', 'seven vegetable couscous',
        'pastilla', 'bastilla', 'moroccan chicken pie', 'harira', 'moroccan soup', 'chermoula', 'preserved lemons', 'argan oil',
        'mechoui', 'moroccan lamb', 'kefta', 'moroccan meatballs', 'bissara', 'zaalouk', 'taktouka', 'moroccan salad',
        'mint tea', 'moroccan tea', 'atay', 'chebakia', 'ghriba', 'moroccan cookies', 'sellou', 'amlou', 'moroccan almonds',
        
        // Egyptian - Expanded
        'ful medames', 'foul', 'ta meya', 'egyptian falafel', 'koshari', 'molokhia', 'fatteh', 'egyptian fatteh',
        'mahshi', 'stuffed vegetables', 'warak enab', 'egyptian dolma', 'bamia', 'okra stew', 'roz bil laban', 'egyptian rice pudding',
        'basbousa', 'kunafa', 'qatayef', 'egyptian sweets', 'hibiscus tea', 'karkade', 'sahlab', 'egyptian drinks'
      ],
      brands: [
        'halal guys', 'cava', 'roti', 'mamoun s', 'sahara', 'pita pit',
        'shawarma king', 'jerusalem bakery', 'little lebanon', 'cedar land',
        'babylon cafe', 'istanbul grill', 'persian palace', 'gulf cuisine'
      ],
      keywords: [
        'middle eastern', 'mediterranean', 'halal food', 'kosher', 'arabic food',
        'turkish restaurant', 'persian cuisine', 'lebanese food', 'israeli food',
        'moroccan restaurant', 'egyptian food', 'syrian cuisine', 'jordanian food'
      ],
      restaurants: [
        'jerusalem cafe', 'babylon grill', 'cedar palace', 'olive branch',
        'crescent moon', 'golden pyramid', 'desert rose', 'palm tree',
        'istanbul kitchen', 'persian garden', 'arabian nights'
      ],
      ingredients: [
        'tahini', 'pomegranate molasses', 'sumac', 'za atar', 'harissa',
        'ras el hanout', 'baharat', 'cardamom', 'rose water', 'orange blossom',
        'date syrup', 'bulgur', 'freekeh', 'halloumi', 'labneh'
      ]
    },

    african: {
      dishes: [
        // West African - Expanded
        'jollof rice', 'nigerian jollof', 'ghanaian jollof', 'senegalese jollof', 'thieboudienne', 'jolof rice',
        'fufu', 'pounded yam', 'eba', 'amala', 'tuwo', 'banku', 'kenkey', 'tuo zaafi',
        'egusi', 'ogbono', 'pepper soup', 'bitter leaf soup', 'oxtail soup', 'palm nut soup', 'groundnut soup',
        'suya', 'kilishi', 'chinchinga', 'kebab', 'grilled meat', 'beef suya', 'chicken suya', 'ram suya',
        'plantain', 'fried plantain', 'kelewele', 'dodo', 'boli', 'roasted plantain', 'plantain chips',
        'yassa', 'chicken yassa', 'fish yassa', 'mafe', 'groundnut stew', 'peanut stew', 'maafe',
        'attiéké', 'kedjenou', 'alloco', 'foutou', 'placali', 'attieke', 'ivorian food',
        'waakye', 'red red', 'kontomire', 'palm soup', 'light soup', 'banku and tilapia',
        'akara', 'kosai', 'bean cakes', 'moi moi', 'steamed beans', 'ewa agoyin', 'beans and dodo',
        'puff puff', 'beignet', 'chin chin', 'kuli kuli', 'groundnut candy', 'tiger nut', 'zobo',
        
        // Ethiopian/Eritrean - Expanded
        'injera', 'ethiopian bread', 'teff', 'sourdough flatbread', 'injera bread', 'fermented bread',
        'doro wat', 'chicken stew', 'berbere chicken', 'ethiopian chicken', 'spicy chicken stew',
        'kitfo', 'ethiopian tartare', 'raw beef', 'spiced raw meat', 'gored gored', 'tire siga',
        'shiro', 'chickpea stew', 'shiro wat', 'lentil stew', 'misir wat', 'kik alicha', 'split pea stew',
        'berbere', 'ethiopian spice', 'mitmita', 'awaze', 'ethiopian spice blend', 'korarima',
        'tej', 'honey wine', 'ethiopian mead', 'tella', 'ethiopian beer', 'coffee ceremony', 'ethiopian coffee',
        'tibs', 'sauteed meat', 'beef tibs', 'lamb tibs', 'derek tibs', 'lega tibs', 'zilzil tibs',
        
        // South African - Expanded
        'bobotie', 'south african curry', 'cape malay curry', 'boerewors', 'boerewors roll', 'wors',
        'biltong', 'droewors', 'jerky', 'cured meat', 'springbok biltong', 'kudu biltong',
        'braai', 'south african bbq', 'shisa nyama', 'braai meat', 'sosaties', 'kebabs', 'lamb sosaties',
        'bunny chow', 'durban curry', 'curry bunny', 'mutton bunny', 'chicken bunny', 'bean bunny',
        'potjiekos', 'pot food', 'stew', 'potjie', 'three legged pot', 'cast iron cooking',
        'pap', 'mealie pap', 'stywe pap', 'slap pap', 'krummelpap', 'mielie meal', 'corn meal',
        'koeksisters', 'milk tart', 'melktert', 'rusks', 'beskuit', 'vetkoek', 'magwinya',
        'boerewors', 'wors rolls', 'peri peri chicken', 'nandos chicken', 'mozambican chicken',
        
        // East African - Expanded
        'ugali', 'posho', 'sima', 'corn meal', 'maize meal', 'ugali na nyama', 'ugali na mboga',
        'nyama choma', 'grilled meat', 'roasted meat', 'goat meat', 'beef nyama choma', 'mutton choma',
        'pilau', 'spiced rice', 'kenyan pilau', 'tanzanian pilau', 'coastal pilau', 'biryani',
        'chapati', 'east african chapati', 'flat bread', 'roti', 'kenyan chapati', 'ugandan chapati',
        'mandazi', 'swahili doughnuts', 'east african doughnuts', 'fried bread', 'sweet bread',
        'samaki', 'fish', 'tilapia', 'fish stew', 'coconut fish', 'fish curry', 'grilled fish',
        'sukuma wiki', 'collard greens', 'kale', 'leafy vegetables', 'mboga', 'vegetables',
        'githeri', 'maize and beans', 'mixed beans', 'kenyan githeri', 'mukimo', 'irio',
        'injera', 'ugali', 'sorghum', 'millet', 'cassava', 'sweet potato', 'yam', 'matoke',
        
        // North African - Expanded (additional to Middle Eastern section)
        'tagine', 'moroccan tagine', 'chicken tagine', 'lamb tagine', 'fish tagine', 'vegetable tagine',
        'couscous', 'moroccan couscous', 'algerian couscous', 'tunisian couscous', 'berber couscous',
        'harira', 'moroccan soup', 'ramadan soup', 'tomato soup', 'lentil soup', 'chickpea soup',
        'pastilla', 'bastilla', 'pigeon pie', 'chicken pie', 'seafood pastilla', 'sweet pastilla',
        'mechoui', 'slow roasted lamb', 'moroccan lamb', 'berber lamb', 'festival lamb',
        'chermoula', 'moroccan marinade', 'herb sauce', 'cilantro sauce', 'parsley sauce',
        'brik', 'tunisian pastry', 'phyllo pastry', 'egg brik', 'tuna brik', 'cheese brik'
      ],
      brands: [
        'nandos', 'chicken licken', 'steers', 'wimpy', 'ocean basket',
        'tashas', 'mugg & bean', 'vida e caffe', 'seattle coffee company'
      ],
      keywords: [
        'african cuisine', 'ethiopian food', 'moroccan restaurant', 'south african',
        'west african', 'east african', 'north african', 'authentic african',
        'traditional african', 'african spices', 'tribal cuisine'
      ],
      restaurants: [
        'addis red sea', 'marrakech', 'sahara tent', 'african kitchen',
        'zebra lounge', 'savanna grill', 'baobab tree', 'ubuntu'
      ],
      ingredients: [
        'berbere', 'harissa', 'ras el hanout', 'scotch bonnet', 'palm oil',
        'cassava', 'yam', 'plantain', 'okra', 'baobab', 'moringa',
        'tamarind', 'hibiscus', 'fonio', 'teff', 'millet'
      ]
    },

    latinAmerican: {
      dishes: [
        // Mexican - Expanded
        'quesadilla', 'cheese quesadilla', 'chicken quesadilla', 'steak quesadilla', 'mushroom quesadilla', 'veggie quesadilla',
        'enchilada', 'cheese enchilada', 'chicken enchilada', 'beef enchilada', 'verde enchilada', 'roja enchilada',
        'tamale', 'pork tamale', 'chicken tamale', 'cheese tamale', 'sweet tamale', 'masa tamale', 'oaxacan tamale',
        'pozole', 'pozole rojo', 'pozole verde', 'pozole blanco', 'hominy soup', 'pork pozole', 'chicken pozole',
        'mole', 'mole poblano', 'mole negro', 'mole coloradito', 'mole verde', 'chicken mole', 'turkey mole',
        'guacamole', 'fresh guacamole', 'chunky guacamole', 'spicy guacamole', 'avocado dip', 'holy guacamole',
        'salsa', 'salsa verde', 'salsa roja', 'pico de gallo', 'salsa fresca', 'hot salsa', 'mild salsa', 'chunky salsa',
        'carnitas', 'pork carnitas', 'slow cooked pork', 'mexican pulled pork', 'crispy carnitas', 'carnitas tacos',
        'al pastor', 'taco al pastor', 'marinated pork', 'spit roasted pork', 'pineapple pork', 'shepherd style',
        'barbacoa', 'beef barbacoa', 'lamb barbacoa', 'slow cooked beef', 'mexican barbacoa', 'barbacoa tacos',
        'cochinita pibil', 'yucatecan pork', 'achiote pork', 'banana leaf pork', 'pibil tacos', 'mayan pork',
        'chiles rellenos', 'stuffed peppers', 'poblano peppers', 'cheese stuffed peppers', 'battered peppers',
        'menudo', 'tripe soup', 'mexican hangover cure', 'weekend soup', 'hominy tripe soup', 'spicy tripe',
        'birria', 'goat stew', 'beef birria', 'birria tacos', 'consomme', 'jalisco stew', 'spicy goat',
        
        // Argentinian/Chilean - Expanded
        'empanada', 'beef empanada', 'chicken empanada', 'cheese empanada', 'ham empanada', 'spinach empanada', 'corn empanada',
        'parrillada', 'mixed grill', 'argentine grill', 'asado', 'argentine bbq', 'sunday asado', 'family asado',
        'chimichurri', 'green sauce', 'parsley sauce', 'herb sauce', 'argentine sauce', 'steak sauce',
        'anticucho', 'grilled hearts', 'peruvian skewers', 'beef heart', 'marinated skewers', 'street food',
        'choripan', 'chorizo sandwich', 'sausage sandwich', 'argentine sandwich', 'grilled sausage', 'street sandwich',
        'milanesa', 'breaded cutlet', 'chicken milanesa', 'beef milanesa', 'argentine schnitzel', 'fried cutlet',
        'dulce de leche', 'caramel', 'milk candy', 'argentine caramel', 'sweet milk', 'alfajor filling',
        'alfajor', 'sandwich cookie', 'dulce de leche cookie', 'coconut cookie', 'chocolate cookie', 'argentine cookie',
        
        // Peruvian - Expanded  
        'ceviche', 'fish ceviche', 'shrimp ceviche', 'mixed ceviche', 'tiger milk', 'leche de tigre', 'raw fish',
        'lomo saltado', 'beef stir fry', 'peruvian stir fry', 'soy beef', 'french fry beef', 'wok beef',
        'causa', 'potato terrine', 'layered potato', 'chicken causa', 'tuna causa', 'avocado causa', 'peruvian potato',
        'aji de gallina', 'creamy chicken', 'yellow pepper chicken', 'spicy chicken stew', 'peruvian chicken',
        'rocoto relleno', 'stuffed peppers', 'spicy peppers', 'arequipa peppers', 'cheese stuffed peppers',
        'papa rellena', 'stuffed potato', 'fried potato', 'meat stuffed potato', 'peruvian croquette',
        'anticucho', 'beef heart skewers', 'grilled heart', 'peruvian bbq', 'street food skewers',
        
        // Colombian/Venezuelan - Expanded
        'arepa', 'corn arepa', 'cheese arepa', 'chicken arepa', 'beef arepa', 'black bean arepa', 'venezuelan arepa',
        'bandeja paisa', 'colombian platter', 'beans and rice', 'fried egg plate', 'chicharron plate', 'avocado plate',
        'sancocho', 'hearty stew', 'chicken sancocho', 'beef sancocho', 'pork sancocho', 'vegetable stew', 'colombian stew',
        'ajiaco', 'potato soup', 'chicken soup', 'colombian soup', 'corn soup', 'bogota soup', 'creamy soup',
        'patacon', 'fried plantain', 'smashed plantain', 'twice fried plantain', 'plantain sandwich', 'tostones',
        'hallaca', 'venezuelan tamale', 'christmas tamale', 'banana leaf tamale', 'meat tamale', 'holiday food',
        'tequeño', 'cheese stick', 'fried cheese', 'venezuelan appetizer', 'white cheese stick', 'party food',
        
        // Central American - Expanded
        'pupusa', 'salvadoran pupusa', 'cheese pupusa', 'bean pupusa', 'pork pupusa', 'mixed pupusa', 'thick tortilla',
        'gallo pinto', 'beans and rice', 'costa rican breakfast', 'nicaraguan rice', 'spotted rooster', 'red beans rice',
        'casado', 'costa rican plate', 'married man plate', 'rice and beans plate', 'typical food', 'local food',
        'platano maduro', 'sweet plantain', 'fried plantain', 'ripe plantain', 'caramelized plantain', 'dessert plantain',
        'yuca', 'cassava', 'boiled yuca', 'fried yuca', 'mashed yuca', 'yuca con chicharron', 'tapioca root',
        
        // Cuban/Caribbean - Expanded
        'ropa vieja', 'shredded beef', 'old clothes', 'cuban beef', 'tomato beef', 'bell pepper beef', 'stewed beef',
        'moros y cristianos', 'black beans rice', 'moors and christians', 'cuban rice', 'mixed rice', 'cuban side',
        'tostones', 'twice fried plantain', 'smashed plantain', 'fried green plantain', 'plantain chips', 'patacones',
        'maduros', 'sweet plantain', 'fried ripe plantain', 'caramelized plantain', 'yellow plantain', 'sweet side',
        'cuban sandwich', 'cubano', 'pressed sandwich', 'ham sandwich', 'pork sandwich', 'pickle sandwich',
        'picadillo', 'ground beef', 'cuban hash', 'beef hash', 'raisin beef', 'olive beef', 'comfort food',
        
        // Desserts & Sweets - Expanded
        'churros', 'fried dough', 'cinnamon sugar', 'chocolate churros', 'filled churros', 'spanish donuts', 'crispy churros',
        'flan', 'caramel custard', 'cream caramel', 'vanilla flan', 'coconut flan', 'coffee flan', 'egg custard',
        'tres leches', 'three milk cake', 'milk cake', 'sponge cake', 'soaked cake', 'cream cake', 'latin cake',
        'dulce de leche', 'milk caramel', 'caramel sauce', 'sweet milk', 'boiled milk', 'condensed milk caramel',
        'horchata', 'rice drink', 'cinnamon drink', 'sweet rice milk', 'mexican drink', 'refreshing drink',
        'agua fresca', 'fresh water', 'fruit water', 'flavored water', 'jamaica water', 'tamarind water', 'lime water'
      ],
      brands: [
        'chipotle', 'qdoba', 'taco bell', 'el pollo loco', 'rubios', 'baja fresh',
        'moe s southwest', 'cafe rio', 'pancheros', 'del taco', 'taco john s',
        'pollo campero', 'pollo tropical', 'el torito', 'chevy s fresh mex'
      ],
      keywords: [
        'mexican food', 'latin american', 'spanish restaurant', 'tex mex',
        'authentic mexican', 'traditional latin', 'central american', 'south american',
        'caribbean food', 'cuban restaurant', 'peruvian cuisine', 'argentine grill',
        'taqueria', 'cantina', 'mercado', 'cocina'
      ],
      restaurants: [
        'casa mexico', 'el mariachi', 'la cocina', 'el pueblo', 'casa blanca',
        'los amigos', 'mi casa', 'el sombrero', 'la hacienda', 'el paso'
      ],
      ingredients: [
        'cilantro', 'lime', 'jalapeño', 'chipotle', 'poblano', 'serrano', 'habanero',
        'cumin', 'oregano', 'epazote', 'achiote', 'masa', 'hominy',
        'queso fresco', 'cotija', 'oaxaca cheese', 'crema', 'chorizo'
      ]
    }
  }
}

// Global brand recognition database
export const globalBrands = {
  food: [
    // Fast Food Giants
    'mcdonalds', 'kfc', 'burger king', 'subway', 'pizza hut', 'dominos', 'taco bell',
    'starbucks', 'dunkin', 'tim hortons', 'costa coffee', 'nero caffe',
    // Regional Fast Food
    'jollibee', 'max s restaurant', 'chowking', 'yoshinoya', 'mos burger',
    'lotteria', 'freshness burger', 'coco ichibanya', 'sukiya', 'matsuya',
    // Casual Dining
    'olive garden', 'red lobster', 'applebee s', 'chili s', 'tgi friday s',
    'nandos', 'wagamama', 'yo sushi', 'pizza express', 'prezzo',
    // Coffee Chains
    'blue bottle', 'philz', 'peet s', 'dutch bros', 'caribou coffee',
    'second cup', 'gloria jean s', 'the coffee bean', 'pacific coffee'
  ],
  retail: [
    // Global Retail
    'amazon', 'walmart', 'target', 'costco', 'best buy', 'apple store',
    'carrefour', 'tesco', 'sainsbury s', 'asda', 'lidl', 'aldi',
    'metro', 'real', 'kaufland', 'mercadona', 'dia', 'el corte ingles',
    // Asian Retail
    'uniqlo', 'muji', 'don quijote', 'family mart', '7 eleven', 'lawson',
    'sm mall', 'robinsons', 'ayala malls', 'megaworld', 'shopwise',
    'lotte mart', 'homeplus', 'emart', 'cj olive young', 'gs25'
  ],
  brands: [
    // Tech
    'apple', 'samsung', 'google', 'microsoft', 'sony', 'lg', 'panasonic',
    'xiaomi', 'huawei', 'oppo', 'vivo', 'oneplus', 'realme', 'honor',
    // Fashion
    'nike', 'adidas', 'puma', 'under armour', 'lululemon', 'uniqlo',
    'h&m', 'zara', 'gap', 'forever 21', 'primark', 'marks spencer'
  ]
}

// Multilingual patterns for common terms
export const multilingualPatterns = {
  food: {
    en: ['food', 'meal', 'eat', 'hungry', 'restaurant', 'dining', 'cuisine'],
    es: ['comida', 'comer', 'hambre', 'restaurante', 'cocina', 'almuerzo', 'cena'],
    fr: ['nourriture', 'manger', 'faim', 'restaurant', 'cuisine', 'repas', 'dîner'],
    de: ['essen', 'hunger', 'restaurant', 'mahlzeit', 'küche', 'speise', 'gastronomie'],
    it: ['cibo', 'mangiare', 'fame', 'ristorante', 'cucina', 'pranzo', 'cena'],
    pt: ['comida', 'comer', 'fome', 'restaurante', 'cozinha', 'almoço', 'jantar'],
    zh: ['食物', '吃', '餐厅', '饿', '菜', '饭', '美食', '料理'],
    ja: ['食べ物', '食べる', 'レストラン', '空腹', '料理', 'グルメ', '食事'],
    ko: ['음식', '먹다', '식당', '배고픈', '요리', '맛집', '식사'],
    ar: ['طعام', 'أكل', 'جوعان', 'مطعم', 'طبخ', 'وجبة'],
    hi: ['खाना', 'भोजन', 'भूखा', 'रेस्तरां', 'रसोई', 'खाद्य']
  },
  shopping: {
    en: ['buy', 'purchase', 'shopping', 'store', 'mall', 'sale', 'discount'],
    es: ['comprar', 'compra', 'tienda', 'centro comercial', 'rebaja', 'descuento'],
    fr: ['acheter', 'achat', 'magasin', 'centre commercial', 'solde', 'remise'],
    de: ['kaufen', 'einkaufen', 'geschäft', 'einkaufszentrum', 'verkauf', 'rabatt'],
    it: ['comprare', 'acquisto', 'negozio', 'centro commerciale', 'saldo', 'sconto'],
    pt: ['comprar', 'compra', 'loja', 'shopping', 'promoção', 'desconto'],
    zh: ['买', '购买', '商店', '购物', '商城', '打折', '优惠'],
    ja: ['買う', '購入', '店', 'ショッピング', 'セール', '割引'],
    ko: ['사다', '구매', '상점', '쇼핑', '할인', '세일'],
    ar: ['شراء', 'متجر', 'تسوق', 'مول', 'تخفيض'],
    hi: ['खरीदना', 'दुकान', 'शॉपिंग', 'मॉल', 'छूट']
  }
}

// Cultural context detection patterns
export const culturalMarkers = {
  asian: ['asian', 'oriental', 'eastern', 'chopsticks', 'rice', 'noodles', 'soy sauce'],
  european: ['european', 'continental', 'mediterranean', 'wine', 'cheese', 'bread'],
  american: ['american', 'usa', 'us', 'all american', 'classic american', 'hometown'],
  middleEastern: ['middle eastern', 'arabic', 'halal', 'kosher', 'mediterranean', 'levantine'],
  african: ['african', 'ethiopian', 'moroccan', 'south african', 'west african', 'east african'],
  latinAmerican: ['latin', 'mexican', 'spanish', 'latino', 'hispanic', 'south american', 'central american']
}

// Currency and pricing patterns by region
export const regionalCurrencies = {
  usd: { symbol: '$', regex: /\$\d+(\.\d{2})?/, regions: ['american', 'general'] },
  eur: { symbol: '€', regex: /€\d+(\.\d{2})?/, regions: ['european'] },
  gbp: { symbol: '£', regex: /£\d+(\.\d{2})?/, regions: ['european', 'british'] },
  jpy: { symbol: '¥', regex: /¥\d+/, regions: ['asian', 'japanese'] },
  cny: { symbol: '¥', regex: /¥\d+(\.\d{2})?/, regions: ['asian', 'chinese'] },
  inr: { symbol: '₹', regex: /₹\d+(\.\d{2})?/, regions: ['asian', 'indian'] },
  krw: { symbol: '₩', regex: /₩\d+/, regions: ['asian', 'korean'] },
  php: { symbol: '₱', regex: /₱\d+(\.\d{2})?/, regions: ['asian', 'filipino'] },
  thb: { symbol: '฿', regex: /฿\d+(\.\d{2})?/, regions: ['asian', 'thai'] },
  sgd: { symbol: 'S$', regex: /S\$\d+(\.\d{2})?/, regions: ['asian', 'singaporean'] },
  mxn: { symbol: '$', regex: /\$\d+(\.\d{2})?\s*MXN/, regions: ['latinAmerican', 'mexican'] },
  brl: { symbol: 'R$', regex: /R\$\d+(\.\d{2})?/, regions: ['latinAmerican', 'brazilian'] },
  ars: { symbol: '$', regex: /\$\d+(\.\d{2})?\s*ARS/, regions: ['latinAmerican', 'argentinian'] }
}