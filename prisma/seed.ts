import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const locations = [
  { name: 'Aeroporto de Congonhas', city: 'São Paulo', state: 'SP' },
  { name: 'Aeroporto de Guarulhos', city: 'Guarulhos', state: 'SP' },
  { name: 'Aeroporto de Viracopos', city: 'Campinas', state: 'SP' },
  { name: 'Shopping Ibirapuera', city: 'São Paulo', state: 'SP' },
  { name: 'Centro - Av. Paulista', city: 'São Paulo', state: 'SP' },
]

const protections = [
  {
    slug: 'basica',
    name: 'Básica',
    pricePerDay: 45,
    benefits: JSON.stringify([
      'Proteção contra furto',
      'Proteção contra incêndio',
      'Perda total do veículo',
    ]),
  },
  {
    slug: 'padrao',
    name: 'Padrão',
    pricePerDay: 80,
    benefits: JSON.stringify([
      'Proteção contra furto',
      'Proteção contra incêndio',
      'Perda total do veículo',
      'Danos e/ou avarias causados por colisões e/ou eventos adversos',
      'Redução de Coparticipação',
    ]),
  },
  {
    slug: 'avancada',
    name: 'Avançada',
    pricePerDay: 120,
    benefits: JSON.stringify([
      'Proteção contra roubo',
      'Proteção contra furto',
      'Proteção contra incêndio',
      'Perda total do veículo',
      'Danos e/ou avarias causados por colisões e/ou eventos adversos',
      'Danos a vidros e pneus',
      'Proteção contra Terceiros',
      'Isenção total de Coparticipação',
    ]),
  },
]

const cars = [
  {
    slug: 'hb20',
    name: 'Hyundai HB20 1.0',
    category: 'Hatch Manual',
    description:
      'Intermediário Hatch Manual.\nGrupo C - Econômico Sedan com ar condicionado.',
    pricePerDay: 120,
    imageUrl: '/cars/hb20.png',
    images: JSON.stringify(['/cars/hb20.png', '/cars/hb20-detail.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Carro elétrico',
      'Freio ABS',
      '3 Malas',
      'Câmbio manual',
      'Direção hidráulica',
      '5 pessoas',
    ]),
    seats: 5,
    bags: 3,
    transmission: 'Manual',
  },
  {
    slug: 'honda-city',
    name: 'Honda City',
    category: 'Hatch Automático',
    description: 'Hatch Automático confortável para o dia a dia na cidade.',
    pricePerDay: 130,
    imageUrl: '/cars/honda-city.png',
    images: JSON.stringify(['/cars/honda-city.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '2 Malas',
      'Câmbio automático',
      'Direção elétrica',
      '5 pessoas',
    ]),
    seats: 5,
    bags: 2,
    transmission: 'Automático',
  },
  {
    slug: 'renegade',
    name: 'Jeep Renegade 1.3',
    category: 'Suv Automático',
    description: 'SUV Automático ideal para viagens e estrada.',
    pricePerDay: 140,
    imageUrl: '/cars/renegade.png',
    images: JSON.stringify(['/cars/renegade.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '3 Malas',
      'Câmbio automático',
      'Direção elétrica',
      '5 pessoas',
    ]),
    seats: 5,
    bags: 3,
    transmission: 'Automático',
  },
  {
    slug: 'fiat-cronos',
    name: 'Fiat Cronos',
    category: 'Sedan Manual',
    description: 'Sedan Manual espaçoso para família e trabalho.',
    pricePerDay: 130,
    imageUrl: '/cars/fiat-cronos.png',
    images: JSON.stringify(['/cars/fiat-cronos.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '3 Malas',
      'Câmbio manual',
      'Direção hidráulica',
      '5 pessoas',
    ]),
    seats: 5,
    bags: 3,
    transmission: 'Manual',
  },
  {
    slug: 'onix',
    name: 'Onix LTZ 1.0',
    category: 'Hatch Automático',
    description: 'Hatch Automático com ótimo custo-benefício.',
    pricePerDay: 130,
    imageUrl: '/cars/onix.png',
    images: JSON.stringify(['/cars/onix.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '2 Malas',
      'Câmbio automático',
      'Direção elétrica',
      '5 pessoas',
    ]),
    seats: 5,
    bags: 2,
    transmission: 'Automático',
  },
  {
    slug: 'gm-spin',
    name: 'GM Spin 1.8',
    category: 'Minivan Automática 7 Lugares',
    description: 'Minivan Automática com capacidade para 7 pessoas.',
    pricePerDay: 320,
    imageUrl: '/cars/gm-spin.png',
    images: JSON.stringify(['/cars/gm-spin.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '4 Malas',
      'Câmbio automático',
      'Direção hidráulica',
      '7 pessoas',
    ]),
    seats: 7,
    bags: 4,
    transmission: 'Automático',
  },
  {
    slug: 'vw-t-cross',
    name: 'VW T-Cross 1.0 Turbo',
    category: 'Suv Automático',
    description: 'SUV Automático turbo para mais desempenho.',
    pricePerDay: 150,
    imageUrl: '/cars/vw-t-cross.png',
    images: JSON.stringify(['/cars/vw-t-cross.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '3 Malas',
      'Câmbio automático',
      'Direção elétrica',
      '5 pessoas',
    ]),
    seats: 5,
    bags: 3,
    transmission: 'Automático',
  },
  {
    slug: 'honda-city-sedan',
    name: 'Honda City Sedan EX',
    category: 'Intermediário Automático',
    description: 'Sedan intermediário automático com acabamento premium.',
    pricePerDay: 150,
    imageUrl: '/cars/honda-city-sedan.png',
    images: JSON.stringify(['/cars/honda-city-sedan.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '3 Malas',
      'Câmbio automático',
      'Direção elétrica',
      '5 pessoas',
    ]),
    seats: 5,
    bags: 3,
    transmission: 'Automático',
  },
  {
    slug: 'fiat-mobi',
    name: 'Fiat Mobi 1.0',
    category: 'Compacto com Ar',
    description: 'Compacto econômico com ar-condicionado.',
    pricePerDay: 100,
    imageUrl: '/cars/fiat-mobi.png',
    images: JSON.stringify(['/cars/fiat-mobi.png']),
    features: JSON.stringify([
      'Ar condicionado',
      'Trava elétrica',
      'Freio ABS',
      '1 Mala',
      'Câmbio manual',
      'Direção hidráulica',
      '4 pessoas',
    ]),
    seats: 4,
    bags: 1,
    transmission: 'Manual',
  },
]

async function main() {
  await prisma.reservation.deleteMany()
  await prisma.user.deleteMany()
  await prisma.car.deleteMany()
  await prisma.protection.deleteMany()
  await prisma.location.deleteMany()

  await prisma.location.createMany({ data: locations })
  await prisma.protection.createMany({ data: protections })
  await prisma.car.createMany({ data: cars })

  const passwordHash = await bcrypt.hash('123456', 10)
  await prisma.user.create({
    data: {
      name: 'Cliente Hermex',
      email: 'cliente@hermex.com',
      passwordHash,
    },
  })

  console.log('Seed concluído com sucesso.')
  console.log('Usuário de teste: cliente@hermex.com / 123456')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
