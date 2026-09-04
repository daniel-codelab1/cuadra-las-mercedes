import type { Locale } from '@/i18n/routing'

import type { Localized } from './types'

/**
 * Un apartado del documento: un encabezado y sus párrafos.
 *
 * Los párrafos son cadenas y no `RichText` a propósito. `RichText` existe para
 * los textos de marketing, donde hay tramos en negrita; la prosa legal no los
 * lleva y modelarla así llenaría el archivo de envoltorios `[{ text: … }]` sin
 * ganar nada. Si algún día hace falta destacar un término definido, se cambia
 * el tipo aquí y `LegalDocument` pasa a pintar con `<RichText>`.
 */
export type LegalSection = {
  heading: string
  paragraphs: string[]
}

export type LegalDocument = {
  title: string
  /** Fecha en ISO. El formato visible lo decide el idioma, no el contenido. */
  updated: string
  intro: string
  sections: LegalSection[]
}

/** Los tres documentos, por su segmento de ruta. */
export type LegalSlug = 'terminos' | 'privacidad' | 'cookies'

export type LegalContent = Record<LegalSlug, LegalDocument>

/** Fecha de la última revisión. Al editar cualquier documento, actualizarla. */
const UPDATED = '2026-09-03'

/**
 * Textos legales del sitio.
 *
 * **No son un dictamen jurídico.** Son plantillas genéricas con la estructura
 * que se pide habitualmente —quién responde, qué datos se tratan, para qué, qué
 * derechos hay y cómo ejercerlos—, redactadas con Cuadra Las Mercedes como
 * sujeto. Antes de publicar tienen que pasar por un abogado, que es quien puede
 * confirmar qué exige la normativa venezolana en este caso concreto.
 *
 * **PENDIENTE — datos que faltan y hoy van como marcador:**
 *
 *  - La razón social y el RIF de la entidad que responde por el sitio.
 *  - Un domicilio y un correo de contacto reales.
 *  - Si se activan analíticas: hay que nombrarlas en la política de cookies.
 *
 * Cada marcador va escrito entre corchetes para que salte a la vista al
 * revisarlo y no se publique por descuido.
 */
const legal: Localized<LegalContent> = {
  es: {
    terminos: {
      title: 'Términos y condiciones',
      updated: UPDATED,
      intro:
        'Estos términos regulan el acceso y el uso del sitio web de Cuadra Las Mercedes. ' +
        'Al navegar por él aceptas quedar sujeto a ellos; si no estás de acuerdo, te pedimos ' +
        'que no lo utilices.',
      sections: [
        {
          heading: 'Titularidad del sitio',
          paragraphs: [
            'Este sitio es titularidad de [razón social], identificada con [RIF], con domicilio ' +
              'en [dirección], Caracas, Venezuela. Para cualquier comunicación relacionada con ' +
              'estos términos puedes escribir a [correo de contacto].',
          ],
        },
        {
          heading: 'Objeto del sitio',
          paragraphs: [
            'El sitio tiene una finalidad informativa: presenta el proyecto de renovación urbana ' +
              'y comercial de Las Mercedes, los desarrollos asociados y las novedades de la zona.',
            'La información publicada no constituye una oferta comercial, una promesa de venta ' +
              'ni asesoría de inversión. Las características, plazos, imágenes y renders de los ' +
              'proyectos son referenciales y pueden variar.',
          ],
        },
        {
          heading: 'Uso permitido',
          paragraphs: [
            'Puedes consultar, descargar y reproducir el contenido para uso personal y no ' +
              'comercial. Queda prohibido usar el sitio con fines ilícitos, alterar su ' +
              'funcionamiento, intentar acceder a áreas restringidas o extraer datos de forma ' +
              'automatizada sin autorización previa.',
          ],
        },
        {
          heading: 'Propiedad intelectual',
          paragraphs: [
            'Los textos, imágenes, renders, planos, marcas, logotipos y demás elementos del ' +
              'sitio están protegidos por la legislación de propiedad intelectual e industrial y ' +
              'pertenecen a Cuadra Las Mercedes o a terceros que han autorizado su uso.',
            'No se concede ninguna licencia sobre ellos por el hecho de acceder al sitio. Su ' +
              'reproducción, distribución o transformación con fines comerciales requiere ' +
              'autorización escrita.',
          ],
        },
        {
          heading: 'Enlaces a sitios de terceros',
          paragraphs: [
            'El sitio puede enlazar a páginas de proyectos, aliados o redes sociales que no ' +
              'controlamos. No respondemos por su contenido, disponibilidad ni por sus prácticas ' +
              'de privacidad, que se rigen por sus propias condiciones.',
          ],
        },
        {
          heading: 'Disponibilidad y limitación de responsabilidad',
          paragraphs: [
            'Procuramos que el sitio esté disponible y que su información sea correcta y esté ' +
              'actualizada, pero no podemos garantizarlo de forma continua: puede haber ' +
              'interrupciones por mantenimiento, fallos técnicos o causas ajenas.',
            'En la medida en que lo permita la ley, no respondemos por los daños derivados del ' +
              'uso o la imposibilidad de uso del sitio, ni por decisiones tomadas basándose ' +
              'únicamente en la información aquí publicada.',
          ],
        },
        {
          heading: 'Cambios en estos términos',
          paragraphs: [
            'Podemos modificar estos términos cuando cambie el sitio o la normativa aplicable. ' +
              'La versión vigente es siempre la publicada en esta página, con su fecha de ' +
              'última actualización.',
          ],
        },
        {
          heading: 'Ley aplicable',
          paragraphs: [
            'Estos términos se rigen por las leyes de la República Bolivariana de Venezuela. ' +
              'Cualquier controversia se someterá a los tribunales competentes de [ciudad].',
          ],
        },
      ],
    },

    privacidad: {
      title: 'Política de privacidad',
      updated: UPDATED,
      intro:
        'Esta política explica qué datos personales tratamos cuando visitas el sitio de Cuadra ' +
        'Las Mercedes o nos escribes, para qué los usamos y qué derechos tienes sobre ellos.',
      sections: [
        {
          heading: 'Responsable del tratamiento',
          paragraphs: [
            '[Razón social], identificada con [RIF], con domicilio en [dirección], Caracas, ' +
              'Venezuela. Correo de contacto para asuntos de privacidad: [correo de contacto].',
          ],
        },
        {
          heading: 'Qué datos tratamos',
          paragraphs: [
            'Datos que nos facilitas: los que escribes en el formulario de contacto —nombre, ' +
              'correo electrónico y el mensaje que decidas enviarnos—.',
            'Datos técnicos de la visita: dirección IP, tipo de navegador y dispositivo, páginas ' +
              'consultadas y momento de la visita. Los genera la propia navegación y los registra ' +
              'nuestro proveedor de alojamiento.',
            'Preferencias guardadas en tu navegador, como el tema claro u oscuro y el idioma. Se ' +
              'quedan en tu equipo y no se envían a nuestros servidores.',
          ],
        },
        {
          heading: 'Para qué los usamos',
          paragraphs: [
            'Para atender tu solicitud cuando nos escribes, para mantener el sitio en ' +
              'funcionamiento y protegerlo frente a usos abusivos, y para entender de forma ' +
              'agregada cómo se usa y mejorarlo.',
            'No usamos tus datos para tomar decisiones automatizadas ni elaboramos perfiles con ' +
              'ellos.',
          ],
        },
        {
          heading: 'Base del tratamiento',
          paragraphs: [
            'Tratamos los datos del formulario con tu consentimiento, que das al enviarlo. Los ' +
              'datos técnicos se tratan por nuestro interés legítimo en mantener el sitio seguro ' +
              'y operativo.',
          ],
        },
        {
          heading: 'Con quién los compartimos',
          paragraphs: [
            'No vendemos ni cedemos tus datos. Sólo acceden a ellos los proveedores que nos ' +
              'prestan servicios para operar el sitio —alojamiento y envío de correo—, que los ' +
              'tratan siguiendo nuestras instrucciones.',
            'Algunos de esos proveedores pueden alojar la información fuera de Venezuela. En ese ' +
              'caso nos aseguramos de que ofrezcan garantías de protección equivalentes.',
          ],
        },
        {
          heading: 'Cuánto tiempo los conservamos',
          paragraphs: [
            'Los mensajes del formulario, el tiempo necesario para atender tu solicitud y ' +
              'mientras exista una relación derivada de ella. Los registros técnicos, durante el ' +
              'plazo que fije nuestro proveedor de alojamiento para su funcionamiento y ' +
              'seguridad.',
          ],
        },
        {
          heading: 'Tus derechos',
          paragraphs: [
            'Puedes pedirnos acceder a tus datos, rectificarlos si son inexactos, solicitar su ' +
              'eliminación, oponerte a determinados tratamientos o retirar tu consentimiento ' +
              'cuando lo hayas dado.',
            'Para ejercerlos, escribe a [correo de contacto] indicando qué solicitas. Te ' +
              'responderemos en un plazo razonable.',
          ],
        },
        {
          heading: 'Seguridad',
          paragraphs: [
            'Aplicamos medidas técnicas y organizativas razonables para proteger los datos frente ' +
              'a accesos no autorizados, pérdida o alteración. Ningún sistema es infalible, pero ' +
              'trabajamos para reducir ese riesgo.',
          ],
        },
        {
          heading: 'Menores de edad',
          paragraphs: [
            'El sitio no está dirigido a menores de edad y no recabamos datos suyos a sabiendas. ' +
              'Si detectamos que hemos recibido datos de un menor sin autorización, los ' +
              'eliminaremos.',
          ],
        },
        {
          heading: 'Cambios en esta política',
          paragraphs: [
            'Si cambian los tratamientos o la normativa, actualizaremos esta página. La versión ' +
              'vigente es la publicada aquí, con su fecha de última actualización.',
          ],
        },
      ],
    },

    cookies: {
      title: 'Política de cookies',
      updated: UPDATED,
      intro:
        'Esta política explica qué información guardamos en tu navegador cuando visitas el sitio ' +
        'de Cuadra Las Mercedes y cómo puedes controlarla.',
      sections: [
        {
          heading: 'Qué son las cookies',
          paragraphs: [
            'Una cookie es un archivo pequeño que un sitio guarda en tu navegador para recordar ' +
              'información entre visitas. Junto a ellas existen otros almacenamientos parecidos, ' +
              'como el almacenamiento local, que cumplen la misma función.',
          ],
        },
        {
          heading: 'Qué usamos en este sitio',
          paragraphs: [
            'Almacenamiento técnico y de preferencias: guardamos en tu navegador el tema claro u ' +
              'oscuro que elijas y el idioma de la interfaz, para que el sitio se vea como lo ' +
              'dejaste la próxima vez. Esta información se queda en tu equipo.',
            'Protección del formulario: al enviar el formulario de contacto, el servicio ' +
              'antispam que lo protege puede colocar cookies necesarias para verificar que la ' +
              'solicitud no proviene de un sistema automatizado.',
            'No usamos cookies publicitarias ni compartimos información con redes de anuncios.',
          ],
        },
        {
          heading: 'Cookies de terceros',
          paragraphs: [
            'Algunas páginas incorporan contenido alojado por terceros, como vídeos o mapas. Si ' +
              'ese contenido se carga, el tercero puede colocar sus propias cookies, sujetas a ' +
              'sus políticas.',
          ],
        },
        {
          heading: 'Cómo controlarlas',
          paragraphs: [
            'Puedes borrar o bloquear el almacenamiento desde la configuración de tu navegador. ' +
              'Ten en cuenta que si bloqueas el almacenamiento técnico, el sitio dejará de ' +
              'recordar tus preferencias y podría no funcionar correctamente.',
          ],
        },
        {
          heading: 'Cambios en esta política',
          paragraphs: [
            'Si añadimos o retiramos herramientas que usen cookies, actualizaremos esta página ' +
              'con su fecha de última revisión.',
          ],
        },
      ],
    },
  },

  en: {
    terminos: {
      title: 'Terms and conditions',
      updated: UPDATED,
      intro:
        'These terms govern access to and use of the Cuadra Las Mercedes website. By browsing ' +
        'it you agree to be bound by them; if you do not agree, please do not use the site.',
      sections: [
        {
          heading: 'Site ownership',
          paragraphs: [
            'This site is owned by [legal name], tax ID [tax ID], with registered address at ' +
              '[address], Caracas, Venezuela. For any communication regarding these terms, write ' +
              'to [contact email].',
          ],
        },
        {
          heading: 'Purpose of the site',
          paragraphs: [
            'The site is informational: it presents the urban and commercial renewal project of ' +
              'Las Mercedes, its associated developments and news from the area.',
            'The information published does not constitute a commercial offer, a promise of sale ' +
              'or investment advice. Project features, timelines, images and renderings are ' +
              'indicative and may change.',
          ],
        },
        {
          heading: 'Permitted use',
          paragraphs: [
            'You may consult, download and reproduce the content for personal, non-commercial ' +
              'use. Using the site for unlawful purposes, interfering with its operation, ' +
              'attempting to access restricted areas or extracting data automatically without ' +
              'prior authorisation is prohibited.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            'Texts, images, renderings, plans, trademarks, logos and other elements of the site ' +
              'are protected by intellectual and industrial property law and belong to Cuadra ' +
              'Las Mercedes or to third parties who have authorised their use.',
            'No licence over them is granted by accessing the site. Their reproduction, ' +
              'distribution or transformation for commercial purposes requires written ' +
              'authorisation.',
          ],
        },
        {
          heading: 'Links to third-party sites',
          paragraphs: [
            'The site may link to pages of projects, partners or social networks that we do not ' +
              'control. We are not responsible for their content, availability or privacy ' +
              'practices, which are governed by their own terms.',
          ],
        },
        {
          heading: 'Availability and limitation of liability',
          paragraphs: [
            'We aim to keep the site available and its information accurate and up to date, but ' +
              'we cannot guarantee this continuously: there may be interruptions due to ' +
              'maintenance, technical failures or causes beyond our control.',
            'To the extent permitted by law, we are not liable for damages arising from the use ' +
              'or inability to use the site, nor for decisions taken solely on the basis of the ' +
              'information published here.',
          ],
        },
        {
          heading: 'Changes to these terms',
          paragraphs: [
            'We may amend these terms when the site or the applicable regulations change. The ' +
              'version in force is always the one published on this page, with its last updated ' +
              'date.',
          ],
        },
        {
          heading: 'Governing law',
          paragraphs: [
            'These terms are governed by the laws of the Bolivarian Republic of Venezuela. Any ' +
              'dispute shall be submitted to the competent courts of [city].',
          ],
        },
      ],
    },

    privacidad: {
      title: 'Privacy policy',
      updated: UPDATED,
      intro:
        'This policy explains what personal data we process when you visit the Cuadra Las ' +
        'Mercedes website or write to us, what we use it for and what rights you have over it.',
      sections: [
        {
          heading: 'Data controller',
          paragraphs: [
            '[Legal name], tax ID [tax ID], with registered address at [address], Caracas, ' +
              'Venezuela. Contact email for privacy matters: [contact email].',
          ],
        },
        {
          heading: 'What data we process',
          paragraphs: [
            'Data you provide: what you write in the contact form — name, email address and the ' +
              'message you choose to send us.',
            'Technical data from your visit: IP address, browser and device type, pages viewed ' +
              'and time of visit. This is generated by browsing itself and recorded by our ' +
              'hosting provider.',
            'Preferences stored in your browser, such as light or dark theme and language. These ' +
              'stay on your device and are not sent to our servers.',
          ],
        },
        {
          heading: 'What we use it for',
          paragraphs: [
            'To answer your request when you write to us, to keep the site running and protect ' +
              'it from abuse, and to understand in aggregate how it is used so we can improve it.',
            'We do not use your data for automated decision-making, nor do we build profiles ' +
              'with it.',
          ],
        },
        {
          heading: 'Basis for processing',
          paragraphs: [
            'We process contact form data with your consent, given when you submit it. Technical ' +
              'data is processed on the basis of our legitimate interest in keeping the site ' +
              'secure and operational.',
          ],
        },
        {
          heading: 'Who we share it with',
          paragraphs: [
            'We do not sell or transfer your data. Only the providers that help us operate the ' +
              'site — hosting and email delivery — have access to it, and they process it ' +
              'following our instructions.',
            'Some of those providers may host the information outside Venezuela. Where that ' +
              'happens, we make sure they offer equivalent protection guarantees.',
          ],
        },
        {
          heading: 'How long we keep it',
          paragraphs: [
            'Contact form messages, for as long as needed to handle your request and while any ' +
              'relationship arising from it lasts. Technical logs, for the period set by our ' +
              'hosting provider for operation and security.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You may ask us to access your data, rectify it if inaccurate, request its deletion, ' +
              'object to certain processing or withdraw your consent where you have given it.',
            'To exercise them, write to [contact email] stating what you are requesting. We will ' +
              'reply within a reasonable time.',
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'We apply reasonable technical and organisational measures to protect data against ' +
              'unauthorised access, loss or alteration. No system is infallible, but we work to ' +
              'reduce that risk.',
          ],
        },
        {
          heading: 'Minors',
          paragraphs: [
            'The site is not aimed at minors and we do not knowingly collect their data. If we ' +
              'find we have received data from a minor without authorisation, we will delete it.',
          ],
        },
        {
          heading: 'Changes to this policy',
          paragraphs: [
            'If our processing or the applicable regulations change, we will update this page. ' +
              'The version in force is the one published here, with its last updated date.',
          ],
        },
      ],
    },

    cookies: {
      title: 'Cookie policy',
      updated: UPDATED,
      intro:
        'This policy explains what information we store in your browser when you visit the ' +
        'Cuadra Las Mercedes website and how you can control it.',
      sections: [
        {
          heading: 'What cookies are',
          paragraphs: [
            'A cookie is a small file that a site stores in your browser to remember information ' +
              'between visits. Alongside them there are similar storage mechanisms, such as local ' +
              'storage, that serve the same purpose.',
          ],
        },
        {
          heading: 'What we use on this site',
          paragraphs: [
            'Technical and preference storage: we store in your browser the light or dark theme ' +
              'you choose and the interface language, so the site looks the way you left it next ' +
              'time. This information stays on your device.',
            'Form protection: when you submit the contact form, the anti-spam service protecting ' +
              'it may set cookies needed to verify that the request does not come from an ' +
              'automated system.',
            'We do not use advertising cookies and we do not share information with ad networks.',
          ],
        },
        {
          heading: 'Third-party cookies',
          paragraphs: [
            'Some pages embed content hosted by third parties, such as videos or maps. If that ' +
              'content loads, the third party may set its own cookies, subject to its policies.',
          ],
        },
        {
          heading: 'How to control them',
          paragraphs: [
            'You can delete or block storage from your browser settings. Note that if you block ' +
              'technical storage, the site will stop remembering your preferences and may not ' +
              'work correctly.',
          ],
        },
        {
          heading: 'Changes to this policy',
          paragraphs: [
            'If we add or remove tools that use cookies, we will update this page with its last ' +
              'revision date.',
          ],
        },
      ],
    },
  },
}

export function getLegal(locale: Locale, slug: LegalSlug): LegalDocument {
  return legal[locale][slug]
}
