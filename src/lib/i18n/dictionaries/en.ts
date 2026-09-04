import type { DeepPartial } from "../get-dictionary";
import type { Segmento } from "../segments";
import type { es } from "./es";

/**
 * Paralelo de `es`. Cualquier clave ausente cae en fallback silencioso
 * a español (docs/contenido.md · i18n) — nunca "translation missing".
 *
 * Misma voz vigente que en español: del estudio, cercana, cálida y profesional.
 */

const umbralLine: Segmento[] = [
  { texto: "North Studio designs and builds sites that represent " },
  { texto: "an identity", enfasis: true },
  { texto: "." },
];

const studioPassage: Segmento[] = [
  { texto: "What makes someone memorable is " },
  { texto: "how they live", enfasis: true },
  { texto: " what they do." },
];

const studioClosing: Segmento[] = [
  { texto: "Websites built from the ground up to represent " },
  { texto: "your identity", enfasis: true },
  { texto: "." },
];

const studioCoda: Segmento[] = [
  { texto: "We want the experience to feel as " },
  { texto: "singular", enfasis: true },
  { texto: " as the person it represents." },
];

const conversationInvitation: Segmento[] = [
  { texto: "If you have a project in mind, " },
  { texto: "write to us", enfasis: true },
  { texto: "." },
];

export const en: DeepPartial<typeof es> = {
  notFound: "This page doesn't exist.",
  notFoundVolver: "Back to the start",
  meta: {
    title: "North Studio",
    description:
      "North Studio designs and builds sites that represent an identity. Websites, landing pages, portfolios and digital experiences.",
  },
  nav: {
    inicio: "North Studio — back to the start",
    secundaria: "Navigation",
    secciones: {
      trabajo: "Work",
      estudio: "Studio",
      contacto: "Contact",
    },
    menu: { abrir: "Menu", cerrar: "Close" },
    idioma: { corto: "ES", nombre: "Español" },
    tema: { accion: "Switch to", papel: "Paper", noche: "Night" },
  },
  umbral: {
    linea: umbralLine,
  },
  trabajo: {
    nombre: "Work",
    vacio: "The first project is on its way.",
    clientes: "Who we work with",
  },
  estudio: {
    nombre: "The studio",
    pasaje: studioPassage,
    cierre: studioClosing,
    remate: studioCoda,
    oficios: "Websites · Landing pages · Portfolios · Digital experiences",
  },
  conversacion: {
    invitacion: conversationInvitation,
    campos: {
      nombre: "Name",
      email: "Email",
      mensaje: "Your project",
    },
    enviar: "Send",
    enviando: "Sending",
    confirmacion: "It's here. We'll write back.",
    errores: {
      "nombre-vacio": "Your name is missing.",
      "nombre-largo": "That name is too long.",
      "email-vacio": "Your email is missing.",
      "email-invalido": "That address looks incomplete.",
      "email-largo": "That address is too long.",
      "mensaje-vacio": "Tell us something.",
      "mensaje-largo": "That's too long. Could you trim it?",
      limite: "Your messages already arrived. Give it a few minutes.",
      envio: "Something failed on our end. Try again in a while.",
    },
  },
  pie: {
    nombre: "Footer",
    instagram: "Instagram",
    email: "Email",
  },
  project: {
    borrador: "Draft — not published yet",
    con: "With",
    sitio: "View the site",
    sitioNuevaPestana: "(opens in a new tab)",
    volver: "Back to the work",
    conversacion: "Write",
  },
  acuse: {
    asunto: "Your message reached North Studio",
    saludo: "Hi",
    cuerpo: "Your message arrived. We'll write back soon, and a person writes it.",
    despedida: "North Studio",
    copia: "This is what you wrote:",
  },
};
