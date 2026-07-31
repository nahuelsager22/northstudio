import type { DeepPartial } from "../get-dictionary";
import type { Segmento } from "../segments";
import type { es } from "./es";

/**
 * Paralelo de `es`. Cualquier clave ausente cae en fallback silencioso
 * a español (experience-architecture.md §6) — nunca "translation missing".
 *
 * Misma voz vigente que en español: del estudio, cercana, cálida y profesional.
 */

const umbralLine: Segmento[] = [
  { texto: "North Studio designs and builds sites that represent " },
  { texto: "an identity", enfasis: true },
  { texto: "." },
];

const studioPassage: Segmento[] = [
  { texto: "Before proposing anything, the studio " },
  { texto: "looks", enfasis: true },
  {
    texto:
      ". The decisions in a project come from understanding who they represent.",
  },
];

const studioClosing: Segmento[] = [
  {
    texto:
      "Two people in the same profession rarely need the same site. What makes someone memorable is almost never ",
  },
  { texto: "what they do", enfasis: true },
  { texto: ", but how they live it." },
];

const studioDelivery: Segmento[] = [
  { texto: "What's left at the end is a site that's " },
  { texto: "yours", enfasis: true },
  { texto: ", one you can update and grow without it losing coherence." },
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
      "North Studio designs and builds sites that represent an identity. Discovery, experience architecture, art direction, design and development.",
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
  },
  estudio: {
    nombre: "The studio",
    pasaje: studioPassage,
    cierre: studioClosing,
    entrega: studioDelivery,
    oficios: "Discovery · Experience · Art direction · Design · Development",
  },
  conversacion: {
    invitacion: conversationInvitation,
    campos: {
      nombre: "Name",
      email: "Email",
      mensaje: "Your project",
    },
    ayudaMensaje: "What you want to make, who it's for, and where you are with it.",
    enviar: "Send",
    enviando: "Sending",
    confirmacion: "Your message arrived. We'll read it carefully and write back.",
    errores: {
      "nombre-vacio": "Your name is missing.",
      "nombre-largo": "That name is longer than we can take.",
      "email-vacio": "Without an address there's nowhere to write back.",
      "email-invalido": "That address looks incomplete. Mind checking it?",
      "email-largo": "That address is longer than we can take.",
      "mensaje-vacio": "Tell us something, even if it's brief.",
      "mensaje-largo": "That's longer than we can take. Could you trim it a little?",
      limite: "Your messages already arrived. Give it a few minutes and we'll go on.",
      envio: "Something failed on our end and the message didn't go out. Try again in a while.",
    },
  },
  project: {
    borrador: "Draft — not published yet",
    con: "With",
    sitio: "View the site",
    sitioNuevaPestana: "(opens in a new tab)",
    volver: "Back to the work",
    conversacion: "Start a conversation",
  },
  acuse: {
    asunto: "Your message reached North Studio",
    saludo: "Hi",
    cuerpo:
      "Your message came through. We'll read it carefully and you'll get a reply written by a person, not an automatic one.",
    despedida: "North Studio",
    copia: "This is what you wrote:",
  },
};
