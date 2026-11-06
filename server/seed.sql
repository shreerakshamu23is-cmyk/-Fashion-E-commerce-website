-- QUIET BATTLES™ Database Seed Data
USE quietbattles;

-- Insert Admins (Password: admin123)
INSERT INTO admins (id, email, password_hash)
VALUES (
  1,
  'admin@quietbattles.com',
  '$2a$10$Z8bD7NeJ0.VLID3//HY6pO4bCz0gP8shqKyw30vLGYuPiZqP070fq'
) ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Insert Series 01 to 04 with Distinct Studio Garment Photography
INSERT INTO series (id, title, slug, description, cover_image, status)
VALUES (
  1,
  'SERIES 01 – THE GENTLE ARMOR™',
  'series-01',
  'A collection about quiet strength and everyday courage. Heavyweight organic cotton, relaxed fit silhouettes, and concealed seamlines engineered to shelter the spirit against external clamor.',
  '/assets/photos/series-01-tshirt.webp',
  'published'
),
(
  2,
  'SERIES 02 – UNRECORDED HOURS™',
  'series-02',
  'A chronicle of sleepless dedication and solitary craft. Architected for the quiet late hours when the world sleeps. Garments cut from dense organic cotton with relaxed drop-shoulder silhouettes and concealed interior tape.',
  '/assets/photos/series-02-tshirt.webp',
  'published'
),
(
  3,
  'SERIES 03 – THE SILENT WEIGHT™',
  'series-03',
  'An inquiry into psychological gravity and emotional resilience. Double-knit organic cotton engineered to provide physical grounding and structured composure under pressure.',
  '/assets/photos/series-03-tshirt.webp',
  'published'
),
(
  4,
  'SERIES 04 – THE UNBROKEN LINE™',
  'series-04',
  'Continuous seam architecture and garment-washed finish designed for sustained daily wear. Minimalist luxury streetwear built for everyday survival and unyielding posture.',
  '/assets/photos/series-04-tshirt.webp',
  'published'
) ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), cover_image=VALUES(cover_image);

-- Insert 5 Chapters for Series 01
INSERT INTO chapters (id, series_id, number, title, slug, story, hero_image, status, sort_order)
VALUES
(
  1,
  1,
  '01',
  'The Beginning',
  'the-beginning',
  'Before any posture can be taken, there is the room before the mirror. The initial weight of awareness. We do not set out to build barriers; we set out to understand where our edges end and the world begins. The first garment is not an armor against enemies, but a quiet perimeter drawn around the tender self.',
  '/assets/chapter-01.svg',
  'published',
  1
),
(
  2,
  1,
  '02',
  'The Silence',
  'the-silence',
  'There is a quiet battle that happens when you refuse to scream. When the noise of expectations presses on every collarbone, the only dignified response is stillness. We crafted this chapter out of heavyweight organic cotton that absorbs vibrations rather than reflecting them. The silence is not emptiness; it is the dense composure of water beneath quiet ice.',
  '/assets/chapter-02.svg',
  'published',
  2
),
(
  3,
  1,
  '03',
  'The Struggle',
  'the-struggle',
  'Tension gives fabric its memory. To bend without snapping, to take the friction of modern existence and turn it into character. Here, the seams are double-reinforced with concealed single-needle stitching, honoring the invisible internal wars that never appear on a resume or an invoice.',
  '/assets/chapter-03.svg',
  'published',
  3
),
(
  4,
  1,
  '04',
  'The Strength',
  'the-strength',
  'True power in clothing does not announce itself with aggressive branding or flamboyant geometry. It is felt in the density of the organic cotton, the precision of the shoulder lines, and the weight resting calmly on the wearer. You do not explain yourself when your presence is grounded in honest material.',
  '/assets/chapter-04.svg',
  'published',
  4
),
(
  5,
  1,
  '05',
  'The Becoming',
  'the-becoming',
  'At the end of endurance lies integration. The battles you fought are no longer scars you hide; they are woven into the very structure of who you have become. The armor is gentle because it no longer fears the touch of the world.',
  '/assets/chapter-05.svg',
  'published',
  5
),
-- Series 02 Chapters
(
  6,
  2,
  '01',
  'The Midnight Oil',
  'the-midnight-oil',
  'When the city lights dim, the true craft begins. Unrecorded hours spent iterating against the dark.',
  '/assets/chapter-01.svg',
  'published',
  1
),
(
  7,
  2,
  '02',
  'The Solitary Desk',
  'the-solitary-desk',
  'No spectators, no validation. Only the steady rhythm of intentional work.',
  '/assets/chapter-02.svg',
  'published',
  2
),
(
  8,
  2,
  '03',
  'The Drift',
  'the-drift',
  'Between fatigue and breakthrough lies the drift. Dropped shoulder tailoring allows fluid posture shifts.',
  '/assets/chapter-03.svg',
  'published',
  3
),
(
  9,
  2,
  '04',
  'The Focus',
  'the-focus',
  'External noise fades to a murmur. The garment protects against distraction with tactile weight.',
  '/assets/chapter-04.svg',
  'published',
  4
),
(
  10,
  2,
  '05',
  'The First Light',
  'the-first-light',
  'The dawn returns without ceremony. The work is finished; the wearer stands unhurried.',
  '/assets/chapter-05.svg',
  'published',
  5
),
-- Series 03 Chapters
(
  11,
  3,
  '01',
  'The Gravity',
  'the-gravity',
  'Weight is not a punishment; it is an anchor. To feel grounded against rapid changes in circumstance.',
  '/assets/chapter-01.svg',
  'published',
  1
),
(
  12,
  3,
  '02',
  'The Anchor',
  'the-anchor',
  'When storms arise, a solid foundation prevents drift. Concealed seamlines hold structural composure.',
  '/assets/chapter-02.svg',
  'published',
  2
),
(
  13,
  3,
  '03',
  'The Undertow',
  'the-undertow',
  'Recognizing hidden pressures before they pull you under. Double-knit cotton provides reassuring density.',
  '/assets/chapter-03.svg',
  'published',
  3
),
(
  14,
  3,
  '04',
  'The Equilibrium',
  'the-equilibrium',
  'Balancing external resistance with internal calm. The silhouette remains poised and dignified.',
  '/assets/chapter-04.svg',
  'published',
  4
),
(
  15,
  3,
  '05',
  'The Release',
  'the-release',
  'Letting go of weight that was never yours to carry. The garment breathes effortlessly against skin.',
  '/assets/chapter-05.svg',
  'published',
  5
),
-- Series 04 Chapters
(
  16,
  4,
  '01',
  'The Horizon',
  'the-horizon',
  'Fixing your gaze beyond immediate friction. Continuous seam architecture engineered for long journeys.',
  '/assets/chapter-01.svg',
  'published',
  1
),
(
  17,
  4,
  '02',
  'The Stride',
  'the-stride',
  'Movement without haste. The garment flexes with anatomical ease, never binding.',
  '/assets/chapter-02.svg',
  'published',
  2
),
(
  18,
  4,
  '03',
  'The Repetition',
  'the-repetition',
  'Doing the quiet work again and again. Heavyweight cotton weathers every cycle with dignity.',
  '/assets/chapter-03.svg',
  'published',
  3
),
(
  19,
  4,
  '04',
  'The Posture',
  'the-posture',
  'Holding oneself upright through adversity. Dropped shoulders maintain an elegant, composed line.',
  '/assets/chapter-04.svg',
  'published',
  4
),
(
  20,
  4,
  '05',
  'The Continuity',
  'the-continuity',
  'The unbroken line that connects every quiet struggle to who you are today.',
  '/assets/chapter-05.svg',
  'published',
  5
)
ON DUPLICATE KEY UPDATE title=VALUES(title), story=VALUES(story);

-- Insert Products 01 to 04 (Linked to Chapter 02 of each Series)
INSERT INTO products (id, chapter_id, name, slug, description, price, images, sizes, stock)
VALUES 
(
  1,
  2,
  'The Gentle Armor T-Shirt',
  'the-gentle-armor-tshirt',
  'Crafted from heavyweight organic cotton with a garment-washed finish, this relaxed fit T-shirt rests with the resolute quiet of an ancient sanctuary. Features concealed seams, a reinforced ribbed crewneck collar, and dropped shoulder tailoring. Designed to provide a protective sanctuary in motion.',
  999.00,
  JSON_ARRAY(
    '/assets/photos/series-01-tshirt.webp',
    '/assets/tshirt-lineart.svg',
    '/assets/photos/tshirt-detail.webp',
    '/assets/photos/tshirt-fabric.webp'
  ),
  JSON_ARRAY('S', 'M', 'L', 'XL'),
  24
),
(
  2,
  7,
  'The Unrecorded Hours T-Shirt',
  'unrecorded-hours-tshirt',
  'Cut from dense 100% organic cotton in washed ash charcoal with an oversized drop-shoulder silhouette, this garment is tailored for long nights of solitary dedication. Features reinforced collar construction and concealed hem tape.',
  1099.00,
  JSON_ARRAY(
    '/assets/photos/series-02-tshirt.webp',
    '/assets/series-02-cover.svg',
    '/assets/photos/tshirt-detail.webp',
    '/assets/photos/tshirt-fabric.webp'
  ),
  JSON_ARRAY('S', 'M', 'L', 'XL'),
  30
),
(
  3,
  12,
  'The Silent Weight Boxy Tee',
  'silent-weight-tshirt',
  'Engineered from structured double-knit organic cotton jersey in deep matte obsidian. Built with an architectural boxy silhouette, high ribbed collar, and center spine reinforcement to provide physical grounding.',
  1199.00,
  JSON_ARRAY(
    '/assets/photos/series-03-tshirt.webp',
    '/assets/series-03-cover.svg',
    '/assets/photos/tshirt-detail.webp',
    '/assets/photos/tshirt-fabric.webp'
  ),
  JSON_ARRAY('S', 'M', 'L', 'XL'),
  18
),
(
  4,
  17,
  'The Unbroken Line Architectural Tee',
  'unbroken-line-tshirt',
  'Anatomical seam architecture cut in garment-washed faded black organic cotton. Flatlock concealed stitching curves fluidly with body motion, delivering effortless daily resilience.',
  1299.00,
  JSON_ARRAY(
    '/assets/photos/series-04-tshirt.webp',
    '/assets/series-04-cover.svg',
    '/assets/photos/tshirt-detail.webp',
    '/assets/photos/tshirt-fabric.webp'
  ),
  JSON_ARRAY('S', 'M', 'L', 'XL'),
  22
)
ON DUPLICATE KEY UPDATE name=VALUES(name), slug=VALUES(slug), description=VALUES(description), price=VALUES(price), images=VALUES(images);
