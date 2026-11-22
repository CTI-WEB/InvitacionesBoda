/**
 * Datos de la pareja.
 * Este es el único archivo que hay que editar para personalizar la invitación.
 * Los estilos y los componentes consumen esta información.
 */
export const weddingConfig = {
  locale: 'es-ES',

  couple: {
    first: 'Lucía',
    second: 'Alejandro',
    monogram: 'L&A',
  },

  wedding: {
    // Fecha local de la ceremonia (ISO 8601, única fuente de verdad).
    // Los horarios de cada evento viven en event.items[].time.
    date: '2026-12-10',
    venue: 'Hacienda San Miguel',
    city: 'Valle de Guadalupe, México',
  },

  hero: {
    /**
     * Fotografía principal (retrato vertical).
     * Guarda el archivo en src/assets/ y sustituye la línea siguiente:
     * image: new URL('../src/assets/hero.jpg', import.meta.url).href,
     * Sin imagen se muestra un monograma tipográfico como respaldo.
     */
    image: null,
    alt: 'Retrato de los novios',
  },

  texts: {
    overline: 'Nos casamos',
    cta: 'Abrir invitación',
    opening: 'Con la bendición de nuestras familias',
    headline: 'Nos encantaría compartir contigo el día en que unimos nuestras vidas',
    intro:
      'Una celebración íntima entre viñedos, luz cálida y las personas que hacen nuestra historia. Reserva la fecha: queremos brindar contigo.',
  },

  meta: {
    siteName: 'Lucía y Alejandro · Nuestra Boda',
    // Frase base; main.js le antepone nombres, fecha y lugar desde wedding.
    description:
      'Una celebración íntima entre viñedos, luz cálida y las personas que amamos.',
    // Imagen para compartir: 1200×630 px. Coloca el archivo en public/.
    // Ejemplo: './og-image.jpg' o '/og-image.jpg'.
    ogImage: './og-image.jpg',
    // URL pública absoluta del sitio. Si se deja vacía, se usa la actual.
    // url: 'https://lucia-y-alejandro.com/',
    url: '',
  },

  // Orden de las secciones dentro de la invitación abierta.
  sections: [
    'story',
    'event',
    'dressCode',
    'countdown',
    'gallery',
    'music',
    'gifts',
    'rsvp',
    'footer',
  ],

  story: {
    eyebrow: 'Nuestra historia',
    title: 'Un camino que elegimos recorrer juntos',
    items: [
      {
        date: 'Primavera 2021',
        text: 'Una mesa compartida, una conversación que no terminaba y la sensación de haber encontrado algo que no sabíamos que buscábamos.',
      },
      {
        date: 'Invierno 2023',
        text: 'Entre viajes, cafés largos y domingos sin prisa, dejamos de imaginar el futuro por separado.',
      },
      {
        date: 'Otoño 2025',
        text: 'Frente al mar, decidimos decir sí para siempre. Hoy queremos celebrarlo contigo.',
      },
    ],
  },

  event: {
    eyebrow: 'El gran día',
    title: 'Ceremonia y celebración',
    items: [
      {
        title: 'Ceremonia',
        time: '18:00',
        address: 'Hacienda San Miguel · Camino Real s/n, Valle de Guadalupe, Baja California',
        mapsUrl:
          'https://www.google.com/maps/search/?api=1&query=Hacienda+San+Miguel+Valle+de+Guadalupe',
      },
      {
        title: 'Recepción',
        time: '20:00',
        address: 'Jardín de los Olivos · Carretera 3 km 12, Valle de Guadalupe, Baja California',
        mapsUrl:
          'https://www.google.com/maps/search/?api=1&query=Valle+de+Guadalupe+Baja+California',
      },
    ],
  },

  dressCode: {
    eyebrow: 'Etiqueta',
    title: 'Código de vestimenta',
    code: 'Formal · Black Tie Optional',
    description:
      'Te pedimos un look elegante en tonos tierra y neutros. La celebración será al aire libre, entre jardines y empedrado: considera calzado cómodo para bailar hasta tarde.',
    palette: [
      { name: 'Marfil', hex: '#F5F0E8' },
      { name: 'Champagne', hex: '#D8C4A0' },
      { name: 'Bronce', hex: '#89745E' },
      { name: 'Carbón', hex: '#34302C' },
    ],
    avoid: [
      { name: 'Blanco', hex: '#FFFFFF' },
      { name: 'Rojo', hex: '#8C2F2F' },
      'Estampados muy llamativos',
    ],
  },

  countdown: {
    enabled: true,
    eyebrow: 'Cuenta regresiva',
    title: 'Falta cada vez menos para el gran día',
    message: 'Hoy es el día · ¡Nos casamos!',
  },

  gifts: {
    enabled: true,
    eyebrow: 'Mesa de Regalos',
    title: 'Tu presencia es nuestro mejor regalo',
    description:
      'Si deseas tener un detalle con nosotros, aquí tienes nuestras opciones.',
    bankDetails: [
      {
        bank: 'BBVA',
        name: 'Juan Pérez y María García',
        clabe: '012345678901234567',
      },
    ],
    registries: [
      {
        name: 'Liverpool',
        url: 'https://www.liverpool.com.mx',
      },
    ],
  },

  rsvp: {
    eyebrow: 'Confirmación de asistencia',
    title: '¿Nos acompañas?',
    description:
      'Tu presencia es el mejor regalo. Confirma tu asistencia y ayúdanos a preparar cada detalle de una noche inolvidable.',
    // Número de WhatsApp en formato internacional, sin "+" ni espacios.
    // Sustituye este ejemplo por el número real del enlace.
    phoneNumber: '5215551234567',
    // Opcionales: sobrescriben los mensajes prellenados.
    // confirmMessage: 'Hola, confirmo mi asistencia a la boda. ¡Nos vemos!',
    // declineMessage: 'Hola, lo siento, no podré asistir a la boda. Les envío mis mejores deseos.',
    // Si la invitación es personal, se añade el nombre al mensaje.
    // guestName: 'María',
  },

gallery: {
    eyebrow: 'Momentos',
    title: 'Nuestra galería',
    items: [
      {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
        alt: 'Pareja celebrando al aire libre',
        caption: 'Un instante inolvidable',
      },
      {
        src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
        alt: 'Detalles de la celebración de boda',
        caption: 'Preparativos del gran día',
      },
    ],
  },

  music: {
    enabled: true,
    eyebrow: 'Nuestra Canción',
    title: 'La melodía de nuestro amor',
    description: 'Esta canción nos recuerda el día que nos conocimos.',
    // Para usar el reproductor local, coloca el archivo en public/audio/
    // y escribe su ruta, por ejemplo: './audio/cancion.mp3'.
    audioSrc: '',
    // Enlace alternativo (Spotify o YouTube). Sustituye esta búsqueda por
    // la canción real cuando esté disponible.
    externalUrl: 'https://open.spotify.com/search/nuestra%20canci%C3%B3n',
    externalLabel: 'Escuchar en Spotify',
  },

  footer: {
    enabled: true,
    hashtag: '#JuanYMaria2026',
    // Opcional: convierte el hashtag en enlace, por ejemplo a Instagram.
    // hashtagUrl: 'https://www.instagram.com/explore/tags/juanymaria2026/',
    closing: 'Gracias por ser parte de nuestra historia',
    credits: 'Diseño con amor · 2026',
  },

}
