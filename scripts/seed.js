require('dotenv').config();
const mongoose   = require('mongoose');
const Admin      = require('../models/Admin');
const Project    = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Service    = require('../models/Service');
const TeamMember = require('../models/TeamMember');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Admin.deleteMany({}),
    Project.deleteMany({}),
    Testimonial.deleteMany({}),
    Service.deleteMany({}),
    TeamMember.deleteMany({})
  ]);
  console.log('🗑️  Cleared existing data');

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  await Admin.create({
    email:    process.env.ADMIN_SEED_EMAIL,
    password: process.env.ADMIN_SEED_PASSWORD,
    name:     'NG&J Admin'
  });
  console.log(`👤 Admin created: ${process.env.ADMIN_SEED_EMAIL}`);

  // ── SERVICES ───────────────────────────────────────────────────────────────
  await Service.insertMany([
    {
      title:       'Land Transportation Services',
      category:    'freight',
      chip:        'Most Requested',
      description: 'Our land transportation division provides reliable, efficient truckload (TL) and less-than-load (LTL) services for regional and domestic shipments across Nigeria and West Africa. Our service is unparalleled thanks to our wide network of professional providers and commitment to real-time shipment tracking and communication.',
      image:       'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1000&q=80',
      wide:        true,
      order:       1,
      active:      true
    },
    {
      title:       'Ocean Freight Transportation',
      category:    'freight',
      chip:        'Sea',
      description: 'One-stop solution for all sea-going freight — vessel selection, documentation, monitoring and tracking, and access to the world\'s best ocean freight carriers.',
      image:       'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=700&q=80',
      wide:        false,
      order:       2,
      active:      true
    },
    {
      title:       'Air Freight Logistics',
      category:    'freight',
      chip:        'Air',
      description: 'Air freight services to all major trading centers through an extensive network of airline and freight forwarding partners, including charters for large or specialized cargo.',
      image:       'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80',
      wide:        false,
      order:       3,
      active:      true
    },
    {
      title:       'Warehousing & Distribution',
      category:    'storage',
      chip:        'Warehousing',
      description: 'Cost-effective solutions for storing and moving goods worldwide — with constant, immediate access to goods and fast, effective global distribution.',
      image:       'https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&q=80',
      wide:        false,
      order:       4,
      active:      true
    },
    {
      title:       'Global Logistics',
      category:    'project',
      chip:        'Global',
      description: 'Custom tailored solutions designed to take full advantage of all available efficiencies in supply chains across West Africa and internationally.',
      image:       'https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=700&q=80',
      wide:        false,
      order:       5,
      active:      true
    },
    {
      title:       'Project Cargo',
      category:    'project',
      chip:        'Project',
      description: 'Full-scope management of complex cargo projects — risk evaluation, cost analysis, route surveying, documentation, and packing coordination.',
      image:       'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=700&q=80',
      wide:        false,
      order:       6,
      active:      true
    }
  ]);
  console.log('📦 Services seeded (6)');

  // ── TEAM MEMBERS ───────────────────────────────────────────────────────────
  await TeamMember.insertMany([
    {
      name:     'Joseph O. Akpara',
      role:     'Chairman / MD',
      bio:      'BSc Health Studies, Coventry University. Founded NG&J after realising the power of goods movement in driving modern economies. Extensive experience in business and public affairs.',
      initials: 'JA',
      gradient: 'linear-gradient(135deg,#1A2E4A,#233A5C)',
      order:    1,
      active:   true
    },
    {
      name:     'Mrs. Ngozi Akpara',
      role:     'Deputy Chairman / MD',
      bio:      'BSc Mental Health Studies, PG Diploma Community Public Health. Registered Manager, Dolphin Healthcare UK. Leadership excellence across healthcare and business management.',
      initials: 'NA',
      gradient: 'linear-gradient(135deg,#E8520A,#FF6B2B)',
      order:    2,
      active:   true
    },
    {
      name:     'Emmanuel Akpara',
      role:     'Director',
      bio:      'Qualified medical doctor. His precision and commitment to professional development bring operational excellence to the business at every level.',
      initials: 'EA',
      gradient: 'linear-gradient(135deg,#2D5B8A,#1A2E4A)',
      order:    3,
      active:   true
    },
    {
      name:     'Gideon Akpara',
      role:     'Director',
      bio:      'MSc Safety & Reliability Engineering, PG Diploma Petroleum Engineering, First Class Honours in Chemical Engineering. Business Development Manager, Delight Essential Services UK.',
      initials: 'GA',
      gradient: 'linear-gradient(135deg,#2E7D32,#1B5E20)',
      order:    4,
      active:   true
    },
    {
      name:     'Ambrose E. Esangbedo',
      role:     'Company Secretary & Legal Adviser',
      bio:      'LLB University of Lagos 1985, Nigerian Bar 1986, LLM University of Lagos 2007. Over 35 years of continuous active legal practice.',
      initials: 'AE',
      gradient: 'linear-gradient(135deg,#6B3A8A,#4A2660)',
      order:    5,
      active:   true
    }
  ]);
  console.log('👥 Team members seeded (5)');

  // ── TESTIMONIALS ───────────────────────────────────────────────────────────
  await Testimonial.insertMany([
    {
      name:     'Adeyemi Olajide',
      company:  'RetailCo Nigeria',
      role:     'Operations Manager',
      text:     'NG&J Swift transformed our supply chain operations in Lagos. Their responsiveness and professionalism is unmatched in West Africa. On-time delivery, every time.',
      rating:   5,
      initials: 'AO',
      color:    'linear-gradient(135deg,#E8520A,#FF6B2B)',
      active:   true,
      order:    1
    },
    {
      name:     'Blessing Ihejirika',
      company:  'AutoParts West Africa',
      role:     'Supply Chain Director',
      text:     'We\'ve used multiple freight forwarders over the years, but NG&J Swift stands out. Their documentation process is flawless and their 24/7 support is genuinely 24/7.',
      rating:   5,
      initials: 'BI',
      color:    'linear-gradient(135deg,#1A2E4A,#233A5C)',
      active:   true,
      order:    2
    },
    {
      name:     'Kwame Chamberlain',
      company:  'Accra Trade Imports',
      role:     'CEO',
      text:     'Our ocean freight from Europe used to be a nightmare. NG&J handled everything — booking, customs, last-mile delivery. Seamless. We haven\'t used anyone else since.',
      rating:   5,
      initials: 'KC',
      color:    'linear-gradient(135deg,#2E7D32,#1B5E20)',
      active:   true,
      order:    3
    },
    {
      name:     'Fatima Ngozi',
      company:  'Energy Solutions Ltd',
      role:     'Head of Procurement',
      text:     'The project cargo team handled our heavy industrial equipment with extraordinary precision. Risk assessment, route planning, special handling — all executed perfectly.',
      rating:   5,
      initials: 'FN',
      color:    'linear-gradient(135deg,#6B3A8A,#4A2660)',
      active:   true,
      order:    4
    },
    {
      name:     'Tunde Okonkwo',
      company:  'Lagos Consumer Goods Group',
      role:     'MD',
      text:     'What sets NG&J apart is their relationship approach. They don\'t just move cargo — they become a genuine extension of your team. Highly recommended for any business in West Africa.',
      rating:   5,
      initials: 'TO',
      color:    'linear-gradient(135deg,#C62828,#B71C1C)',
      active:   true,
      order:    5
    }
  ]);
  console.log('💬 Testimonials seeded (5)');

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  await Project.insertMany([
    {
      title:       'Lagos Port Ocean Freight Clearance',
      category:    'Ocean',
      description: 'Managed full documentation, customs clearance, and last-mile delivery for 40 FCL containers of industrial machinery from Rotterdam to Apapa Port, Lagos.',
      client:      'Dangote Group',
      location:    'Lagos, Nigeria',
      year:        2024,
      image:       'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=700&q=80',
      featured:    true,
      tags:        ['Ocean Freight', 'Customs Clearance', 'Lagos Port']
    },
    {
      title:       'West Africa Regional Land Distribution',
      category:    'Land',
      description: 'Coordinated weekly TL runs across 4 West African countries — Nigeria, Ghana, Benin, Togo — for a major FMCG client. Maintained 98% on-time delivery rate over 12 months.',
      client:      'Unilever West Africa',
      location:    'Lagos – Accra – Cotonou – Lomé',
      year:        2023,
      image:       'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=700&q=80',
      featured:    true,
      tags:        ['Land Transport', 'FMCG', 'Cross-Border']
    }
  ]);
  console.log('🏗️  Projects seeded (2)');

  console.log('\n✅ Seed complete');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
