"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Hotspot = { id: string; title: string; description: string; example: string; x: number; y: number; z: number; sortOrder: number };
type ThreeDModel = { id: string; slug: string; title: string; description: string; purpose: string; components: string[]; modelUrl: string | null; thumbnailUrl: string | null; hotspots: Hotspot[] };

function modelHotspotPosition(slug: string, hotspot: Hotspot, index: number) {
  if (slug === "access-point") return hotspot.x + "m 0.245m " + hotspot.z + "m";
  if (slug === "router") return hotspot.x + "m 0.17m 0.08m";
  if (slug === "switch") return hotspot.x + "m 0.145m 0.04m";
  if (slug === "network-card") return hotspot.x + "m 0.08m 0m";
  if (slug === "rj45-connector") return ((-0.054 + index * 0.036).toFixed(3)) + "m 0.174m 0.16m";
  if (slug === "ethernet-cable") return hotspot.x + "m 0.56m -0.1m";
  return hotspot.x + "m " + hotspot.y + "m " + hotspot.z + "m";
}

function DeviceIllustration({ slug, title }: { slug: string; title: string }) {
  const label = `Illustration of ${title}`;
    if (slug === "ethernet-cable") return <svg viewBox="0 0 440 300" role="img" aria-label={`${label}: Ethernet cable and RJ45 connectors`}>
    <defs>
      <linearGradient id="cb-plug" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f2f7fa"/><stop offset="1" stopColor="#93a9bd"/></linearGradient>
      <linearGradient id="cb-gold" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe9a8"/><stop offset="1" stopColor="#c07f1f"/></linearGradient>
    </defs>
    <ellipse cx="220" cy="256" rx="150" ry="14" fill="#000" opacity=".5"/>
    <path d="M70 220C120 118 200 108 242 160s78 82 133-12" fill="none" stroke="#0b1420" strokeWidth="27" strokeLinecap="round"/>
    <path d="M70 220C120 118 200 108 242 160s78 82 133-12" fill="none" stroke="#33475e" strokeWidth="20" strokeLinecap="round"/>
    <path d="M70 220C120 118 200 108 242 160s78 82 133-12" fill="none" stroke="#8fa8bd" strokeWidth="3" strokeLinecap="round" opacity=".6"/>
    <g transform="translate(70 220) rotate(-58)">
      <path d="M0-9-20-14-20 14 0 9Z" fill="#22303f" stroke="#0b1420" strokeWidth="2"/>
      <rect x="0" y="-16" width="46" height="32" rx="6" fill="url(#cb-plug)" stroke="#3d556b" strokeWidth="2.5"/>
      <path d="M6-16v-12l30-4 4 10-32 6Z" fill="#9db4c6" stroke="#3d556b" strokeWidth="2"/>
      <rect x="38" y="-11" width="6" height="22" rx="1.5" fill="#0f2a3d"/>
      <path d="M39-9v5m0 4v5m0 4v5" stroke="url(#cb-gold)" strokeWidth="3"/>
    </g>
    <g transform="translate(375 148) rotate(38)">
      <path d="M0-9-20-14-20 14 0 9Z" fill="#22303f" stroke="#0b1420" strokeWidth="2"/>
      <rect x="0" y="-16" width="46" height="32" rx="6" fill="url(#cb-plug)" stroke="#3d556b" strokeWidth="2.5"/>
      <path d="M6-16v-12l30-4 4 10-32 6Z" fill="#9db4c6" stroke="#3d556b" strokeWidth="2"/>
      <rect x="38" y="-11" width="6" height="22" rx="1.5" fill="#0f2a3d"/>
      <path d="M39-9v5m0 4v5m0 4v5" stroke="url(#cb-gold)" strokeWidth="3"/>
    </g>
    <circle cx="150" cy="150" r="9" fill="#22d3ee" opacity=".25"/><circle cx="150" cy="150" r="4" fill="#22d3ee"/>
    <circle cx="242" cy="160" r="9" fill="#22d3ee" opacity=".25"/><circle cx="242" cy="160" r="4" fill="#22d3ee"/>
    <circle cx="310" cy="150" r="9" fill="#e2a63b" opacity=".3"/><circle cx="310" cy="150" r="4" fill="#e2a63b"/>
    <text x="220" y="288" textAnchor="middle" fill="#a99bcb" fontSize="11" fontFamily="monospace" letterSpacing="2">UTP CAT6 · T568B</text>
  </svg>;
  if (title.toLowerCase().includes("rj45")) return <svg viewBox="0 0 440 300" role="img" aria-label="Illustration of an RJ45 connector with eight gold contacts and a locking tab">
    <defs>
      <linearGradient id="rj2-shell" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f4f8fc"/><stop offset="1" stopColor="#8ba3b8"/></linearGradient>
      <linearGradient id="rj2-gold" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe9a8"/><stop offset="1" stopColor="#b87a1c"/></linearGradient>
      <linearGradient id="rj2-boot" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7d95a9"/><stop offset="1" stopColor="#42566a"/></linearGradient>
    </defs>
    <ellipse cx="220" cy="272" rx="112" ry="13" fill="#000" opacity=".5"/>
    <rect x="202" y="244" width="36" height="40" rx="10" fill="#22364a"/>
    <rect x="209" y="244" width="6" height="40" fill="#8fa8bd" opacity=".5"/>
    <path d="M188 192h64l-9 54h-46Z" fill="url(#rj2-boot)" stroke="#2c3f52" strokeWidth="2.5"/>
    <path d="M191 206h58M193 220h54M195 234h50" stroke="#2c3f52" strokeWidth="2.5" opacity=".8"/>
    <path d="M200 64 208 28h46l-8 36Z" fill="#b9cdd9" stroke="#3d556b" strokeWidth="2.5"/>
    <path d="M206 64h40" stroke="#3d556b" strokeWidth="2"/>
    <rect x="132" y="108" width="20" height="62" rx="4" fill="#9db4c6" stroke="#3d556b" strokeWidth="2"/>
    <rect x="288" y="108" width="20" height="62" rx="4" fill="#9db4c6" stroke="#3d556b" strokeWidth="2"/>
    <rect x="150" y="60" width="140" height="134" rx="10" fill="url(#rj2-shell)" stroke="#33475c" strokeWidth="3"/>
    <rect x="150" y="60" width="28" height="134" fill="#000" opacity=".14"/>
    <rect x="262" y="60" width="28" height="134" fill="#000" opacity=".1"/>
    <rect x="150" y="60" width="140" height="22" rx="10" fill="#fff" opacity=".35"/>
    <rect x="168" y="88" width="104" height="42" rx="4" fill="#0e283b" stroke="#33475c" strokeWidth="2"/>
    <rect x="173" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="185.5" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="198" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="210.5" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="223" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="235.5" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="248" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="260.5" y="93" width="8" height="32" rx="2" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="168" y="140" width="104" height="40" rx="4" fill="#0e283b" stroke="#33475c" strokeWidth="2"/>
    <rect x="173" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="185.5" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="198" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="210.5" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="223" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="235.5" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="248" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="260.5" y="156" width="8" height="20" rx="1.5" fill="url(#rj2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <text x="220" y="292" textAnchor="middle" fill="#a99bcb" fontSize="11" fontFamily="monospace" letterSpacing="2">8P8C · RJ45</text>
  </svg>;
  if (title.toLowerCase().includes("interface card") || title.toLowerCase().includes("nic")) return <svg viewBox="0 0 440 300" role="img" aria-label="Illustration of a PCIe NIC card with an RJ45 Ethernet port">
    <defs>
      <linearGradient id="nic2-pcb" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0f6a50"/><stop offset="1" stopColor="#073023"/></linearGradient>
      <linearGradient id="nic2-gold" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe9a8"/><stop offset="1" stopColor="#b87a1c"/></linearGradient>
      <linearGradient id="nic2-metal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f2f6f8"/><stop offset="1" stopColor="#8499aa"/></linearGradient>
      <linearGradient id="nic2-chip" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#232b33"/><stop offset="1" stopColor="#05070a"/></linearGradient>
    </defs>
    <ellipse cx="225" cy="262" rx="155" ry="14" fill="#000" opacity=".5"/>
    <rect x="56" y="46" width="28" height="184" rx="3" fill="url(#nic2-metal)" stroke="#4c6070" strokeWidth="2.5"/>
    <circle cx="70" cy="66" r="5.5" fill="#10161c"/><circle cx="70" cy="66" r="5.5" fill="none" stroke="#8fa2b0" strokeWidth="1.5"/>
    <circle cx="70" cy="210" r="5.5" fill="#10161c"/><circle cx="70" cy="210" r="5.5" fill="none" stroke="#8fa2b0" strokeWidth="1.5"/>
    <rect x="84" y="58" width="276" height="152" rx="6" fill="url(#nic2-pcb)" stroke="#04241a" strokeWidth="3"/>
    <rect x="90" y="64" width="264" height="140" rx="4" fill="none" stroke="#2f8f6f" strokeWidth="1" opacity=".5"/>
    <path d="M232 140h18M196 176v14h20M160 150v20h24" fill="none" stroke="#3aa87f" strokeWidth="2" opacity=".55"/>
    <path d="M260 190h40v-12M130 120h24" fill="none" stroke="#3aa87f" strokeWidth="2" opacity=".55"/>
    <text x="200" y="84" fill="#dff5e9" fontSize="10" fontFamily="monospace" letterSpacing="2" opacity=".9">GIGABIT ETHERNET</text>
    <text x="96" y="200" fill="#dff5e9" fontSize="8" fontFamily="monospace" letterSpacing="1" opacity=".7">NX-1000 · REV A</text>
    <circle cx="330" cy="192" r="11" fill="#04241a" stroke="#c8d6de" strokeWidth="2"/><circle cx="330" cy="192" r="5" fill="#10161c"/>
    <rect x="148" y="108" width="72" height="62" rx="4" fill="url(#nic2-chip)" stroke="#454f59" strokeWidth="2.5"/>
    <rect x="148" y="108" width="72" height="10" rx="4" fill="#fff" opacity=".06"/>
    <circle cx="158" cy="118" r="3" fill="url(#nic2-gold)"/>
    <text x="184" y="146" textAnchor="middle" fill="#8fa2b0" fontSize="10" fontFamily="monospace" letterSpacing="1">NX9400</text>
    <rect x="238" y="102" width="92" height="74" rx="4" fill="url(#nic2-metal)" stroke="#4c6070" strokeWidth="2.5"/>
    <rect x="246" y="110" width="76" height="42" rx="2" fill="#0a141c" stroke="#2c3a45" strokeWidth="2"/>
    <rect x="250" y="116" width="6" height="30" fill="url(#nic2-gold)"/><rect x="259" y="116" width="6" height="30" fill="url(#nic2-gold)"/><rect x="268" y="116" width="6" height="30" fill="url(#nic2-gold)"/><rect x="277" y="116" width="6" height="30" fill="url(#nic2-gold)"/><rect x="286" y="116" width="6" height="30" fill="url(#nic2-gold)"/><rect x="295" y="116" width="6" height="30" fill="url(#nic2-gold)"/><rect x="304" y="116" width="6" height="30" fill="url(#nic2-gold)"/><rect x="313" y="116" width="6" height="30" fill="url(#nic2-gold)"/>
    <circle cx="253" cy="164" r="8" fill="#34d399" opacity=".3"/><circle cx="253" cy="164" r="3.5" fill="#34d399"/>
    <circle cx="269" cy="164" r="8" fill="#e2a63b" opacity=".3"/><circle cx="269" cy="164" r="3.5" fill="#e2a63b"/>
    <text x="288" y="160" fill="#c3d7dd" fontSize="8" fontFamily="monospace">LINK</text><text x="288" y="172" fill="#c3d7dd" fontSize="8" fontFamily="monospace">ACT</text>
    <rect x="148" y="182" width="36" height="17" rx="8" fill="url(#nic2-metal)" stroke="#4c6070" strokeWidth="2"/>
    <rect x="194" y="180" width="15" height="23" rx="3" fill="#16283c" stroke="#33475c" strokeWidth="2"/><rect x="194" y="180" width="15" height="5" fill="#c8d6de" opacity=".8"/>
    <rect x="214" y="180" width="15" height="23" rx="3" fill="#16283c" stroke="#33475c" strokeWidth="2"/><rect x="214" y="180" width="15" height="5" fill="#c8d6de" opacity=".8"/>
    <rect x="96" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="119" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="142" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="165" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="196" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="219" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="242" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="265" y="210" width="19" height="24" fill="url(#nic2-gold)" stroke="#7a4d12" strokeWidth="1"/>
    <rect x="96" y="210" width="188" height="4" fill="#fff" opacity=".25"/>
    <text x="225" y="288" textAnchor="middle" fill="#a99bcb" fontSize="11" fontFamily="monospace" letterSpacing="2">NIC · PCI EXPRESS</text>
  </svg>;
if (slug === "router") return <svg viewBox="0 0 440 300" role="img" aria-label={label}>
    <defs>
      <linearGradient id="nx-router" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#2a1a4d"/><stop offset="1" stopColor="#150b2b"/></linearGradient>
      <linearGradient id="nx-router-top" x1="0" x2="1"><stop stopColor="#7c3aed"/><stop offset=".5" stopColor="#22d3ee"/><stop offset="1" stopColor="#7c3aed"/></linearGradient>
    </defs>
    <ellipse cx="220" cy="254" rx="150" ry="15" fill="#22d3ee" opacity=".14"/>
    <ellipse cx="220" cy="252" rx="118" ry="11" fill="#000" opacity=".5"/>
    <line x1="132" y1="142" x2="102" y2="58" stroke="#a78bfa" strokeWidth="7" strokeLinecap="round"/>
    <line x1="308" y1="142" x2="338" y2="58" stroke="#a78bfa" strokeWidth="7" strokeLinecap="round"/>
    <circle cx="102" cy="56" r="11" fill="#22d3ee" opacity=".25"/><circle cx="102" cy="56" r="6" fill="#22d3ee"/>
    <circle cx="338" cy="56" r="11" fill="#22d3ee" opacity=".25"/><circle cx="338" cy="56" r="6" fill="#22d3ee"/>
    <rect x="95" y="135" width="250" height="97" rx="14" fill="url(#nx-router)" stroke="#a78bfa" strokeWidth="2.5"/>
    <rect x="95" y="135" width="250" height="9" rx="4.5" fill="url(#nx-router-top)"/>
    <circle cx="130" cy="160" r="8" fill="#34d399" opacity=".25"/><circle cx="130" cy="160" r="3.5" fill="#34d399"/>
    <circle cx="150" cy="160" r="8" fill="#34d399" opacity=".25"/><circle cx="150" cy="160" r="3.5" fill="#34d399"/>
    <circle cx="170" cy="160" r="8" fill="#22d3ee" opacity=".25"/><circle cx="170" cy="160" r="3.5" fill="#22d3ee"/>
    <circle cx="190" cy="160" r="8" fill="#e2a63b" opacity=".3"/><circle cx="190" cy="160" r="3.5" fill="#e2a63b"/>
    <text x="305" y="163" fill="#a99bcb" fontSize="9" fontFamily="monospace" letterSpacing="1">PWR · WAN</text>
    <rect x="112" y="182" width="30" height="24" rx="3" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/><path d="M118 188v12m6-12v12m6-12v12m6-12v12" stroke="#e8b448" strokeWidth="2"/>
    <rect x="150" y="182" width="30" height="24" rx="3" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/><path d="M156 188v12m6-12v12m6-12v12m6-12v12" stroke="#e8b448" strokeWidth="2"/>
    <rect x="188" y="182" width="30" height="24" rx="3" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/><path d="M194 188v12m6-12v12m6-12v12m6-12v12" stroke="#e8b448" strokeWidth="2"/>
    <rect x="226" y="182" width="30" height="24" rx="3" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/><path d="M232 188v12m6-12v12m6-12v12m6-12v12" stroke="#e8b448" strokeWidth="2"/>
    <rect x="268" y="182" width="30" height="24" rx="3" fill="#0d0718" stroke="#e2a63b" strokeWidth="1.5"/><path d="M274 188v12m6-12v12m6-12v12m6-12v12" stroke="#e8b448" strokeWidth="2"/>
    <path d="M112 138h216l-16 90H96Z" fill="#fff" opacity=".05"/>
    <path d="M312 150v28M319 150v28M326 150v28" stroke="#000" strokeWidth="3" opacity=".45" strokeLinecap="round"/>
    <circle cx="104" cy="144" r="3" fill="#0d0718" stroke="#a78bfa" strokeWidth="1.2"/><circle cx="336" cy="144" r="3" fill="#0d0718" stroke="#a78bfa" strokeWidth="1.2"/>
    <text x="220" y="224" textAnchor="middle" fill="#a99bcb" fontSize="9" fontFamily="monospace" letterSpacing="3">NEXA RT-01 · GIGABIT ROUTER</text>
  </svg>;
  if (slug === "switch") return <svg viewBox="0 0 440 300" role="img" aria-label={label}>
    <defs><linearGradient id="nx-switch" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#241645"/><stop offset="1" stopColor="#120a24"/></linearGradient></defs>
    <ellipse cx="220" cy="238" rx="165" ry="14" fill="#a78bfa" opacity=".16"/>
    <ellipse cx="220" cy="236" rx="135" ry="10" fill="#000" opacity=".5"/>
    <rect x="55" y="125" width="330" height="92" rx="10" fill="url(#nx-switch)" stroke="#22d3ee" strokeWidth="2" opacity="1"/>
    <rect x="55" y="125" width="330" height="7" rx="3.5" fill="#22d3ee" opacity=".55"/>
    <circle cx="76" cy="152" r="9" fill="#34d399" opacity=".25"/><circle cx="76" cy="152" r="4" fill="#34d399"/>
    <text x="70" y="172" fill="#a99bcb" fontSize="8" fontFamily="monospace">PWR</text>
    <text x="70" y="204" fill="#a99bcb" fontSize="8" fontFamily="monospace">NX-SW08</text>
    <rect x="102" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
    <rect x="132" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
    <rect x="162" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
    <rect x="192" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
    <rect x="222" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
    <rect x="252" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
    <rect x="282" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
    <rect x="312" y="142" width="26" height="26" rx="2" fill="#0d0718" stroke="#34d399" strokeWidth="1.5"/>
    <circle cx="115" cy="180" r="3" fill="#34d399"/><circle cx="145" cy="180" r="3" fill="#34d399"/><circle cx="175" cy="180" r="3" fill="#34d399"/><circle cx="205" cy="180" r="3" fill="#34d399"/><circle cx="235" cy="180" r="3" fill="#34d399"/><circle cx="265" cy="180" r="3" fill="#e2a63b"/><circle cx="295" cy="180" r="3" fill="#34d399"/><circle cx="325" cy="180" r="3" fill="#34d399"/>
    <rect x="348" y="142" width="24" height="26" rx="2" fill="#0d0718" stroke="#e2a63b" strokeWidth="1.5"/>
    <path d="M60 128h320v7H60Z" fill="#fff" opacity=".07"/>
    <circle cx="64" cy="134" r="2.5" fill="#0d0718" stroke="#22d3ee" strokeWidth="1"/><circle cx="376" cy="134" r="2.5" fill="#0d0718" stroke="#22d3ee" strokeWidth="1"/><circle cx="64" cy="208" r="2.5" fill="#0d0718" stroke="#22d3ee" strokeWidth="1"/><circle cx="376" cy="208" r="2.5" fill="#0d0718" stroke="#22d3ee" strokeWidth="1"/>
    <text x="220" y="206" textAnchor="middle" fill="#a99bcb" fontSize="9" fontFamily="monospace" letterSpacing="2">8× 1G · 1× SFP UPLINK</text>
  </svg>;
  if (slug === "access-point") return <svg viewBox="0 0 440 300" role="img" aria-label={`${label}: low-profile ceiling access point with Ethernet port`}>
    <defs>
      <linearGradient id="nx-ap-shell" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff"/><stop offset=".62" stopColor="#edf1f4"/><stop offset="1" stopColor="#bdc6cc"/></linearGradient>
      <linearGradient id="nx-ap-side" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e0e5e8"/><stop offset="1" stopColor="#88949b"/></linearGradient>
      <linearGradient id="nx-ap-base" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#7c878c"/><stop offset="1" stopColor="#3a454b"/></linearGradient>
      <linearGradient id="nx-ap-metal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d5dde0"/><stop offset="1" stopColor="#78858b"/></linearGradient>
    </defs>
    <ellipse cx="220" cy="258" rx="164" ry="20" fill="#050913" opacity=".54"/>
    <ellipse cx="220" cy="247" rx="160" ry="25" fill="#111a2c" opacity=".62"/>
    <path d="M83 215v17c0 19 61 35 137 35s137-16 137-35v-17" fill="url(#nx-ap-base)" stroke="#303a40" strokeWidth="2"/>
    <ellipse cx="220" cy="215" rx="137" ry="34" fill="url(#nx-ap-metal)" stroke="#68747b" strokeWidth="2"/>
    <ellipse cx="220" cy="215" rx="111" ry="23" fill="#505b60" opacity=".58"/>
    <path d="M107 184v-8m226 8v-8" stroke="#d8dfe2" strokeWidth="8" strokeLinecap="round"/>
    <path d="M85 177c0-21 60-39 135-39s135 18 135 39v34c0 21-60 39-135 39S85 232 85 211Z" fill="url(#nx-ap-side)" stroke="#77838a" strokeWidth="2"/>
    <ellipse cx="220" cy="177" rx="135" ry="39" fill="url(#nx-ap-shell)" stroke="#f9fbfc" strokeWidth="2"/>
    <ellipse cx="220" cy="179" rx="121" ry="30" fill="none" stroke="#c7d0d4" strokeWidth="1.5"/>
    <ellipse cx="220" cy="173" rx="91" ry="18" fill="none" stroke="#fff" strokeWidth="2" opacity=".88"/>
    <ellipse cx="220" cy="153" rx="15" ry="4" fill="#8b969c" opacity=".32"/>
    <circle cx="220" cy="152" r="3" fill="#2fc8b0"/>
    <circle cx="220" cy="152" r="7" fill="#36d6bd" opacity=".14"/>
    <g fill="#9ca8ad" opacity=".8"><circle cx="153" cy="176" r="1.5"/><circle cx="166" cy="188" r="1.5"/><circle cx="282" cy="188" r="1.5"/><circle cx="295" cy="176" r="1.5"/></g>
    <path d="M326 190h24v15h-24z" fill="#222c31" stroke="#7c898f" strokeWidth="1.5"/>
    <path d="M330 194h16v8h-16z" fill="#080d12"/>
    <path d="M332 195v6m3-6v6m3-6v6m3-6v6m3-6v6" stroke="#d8a649" strokeWidth="1.2"/>
    <circle cx="319" cy="197" r="2" fill="#121920" stroke="#b3bec2" strokeWidth="1"/>
    <path d="M112 181c12-17 39-28 67-31" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".72"/>
    <text x="220" y="287" textAnchor="middle" fill="#aebbd0" fontSize="10" fontFamily="monospace" letterSpacing="2">CEILING ACCESS POINT · PoE</text>
  </svg>;
  return <svg viewBox="0 0 440 300" role="img" aria-label={label}>
    <ellipse cx="220" cy="252" rx="130" ry="15" fill="#a78bfa" opacity=".18"/>
    <ellipse cx="220" cy="250" rx="105" ry="11" fill="#000" opacity=".5"/>
    <g className="three-d-device">
      <path d="M95 145 220 80 345 145 220 210Z" fill="#2a1a4d" stroke="#a78bfa" strokeWidth="2"/>
      <path d="M95 145v45l125 65v-45Z" fill="#1c1033" stroke="#7c3aed" strokeWidth="2"/>
      <path d="M345 145v45l-125 65v-45Z" fill="#120a24" stroke="#7c3aed" strokeWidth="2"/>
      <path d="M160 151 220 120 280 151 220 182Z" fill="#0d0718" stroke="#22d3ee" strokeWidth="1.5"/>
      <path d="M170 151h100M185 159h70M199 167h42" stroke="#22d3ee" strokeWidth="2" opacity=".8"/>
      <circle cx="210" cy="179" r="6" fill="#e2a63b" opacity=".3"/><circle cx="210" cy="179" r="2.5" fill="#e2a63b"/>
      <circle cx="222" cy="173" r="6" fill="#22d3ee" opacity=".3"/><circle cx="222" cy="173" r="2.5" fill="#22d3ee"/>
      <circle cx="234" cy="167" r="6" fill="#34d399" opacity=".3"/><circle cx="234" cy="167" r="2.5" fill="#34d399"/>
    </g>
  </svg>;
}

export default function ThreeDModelCatalog({ models, initialSlug }: { models: ThreeDModel[]; initialSlug?: string }) {
  const { t, locale } = useLanguage();
  const [slug, setSlug] = useState(() => models.some((model) => model.slug === initialSlug) ? initialSlug! : models[0]?.slug ?? "");
  const [activeHotspot, setActiveHotspot] = useState(0);
  const [viewerState, setViewerState] = useState<{ url: string; status: "ready" | "error" } | null>(null);
  const model = models.find((item) => item.slug === slug) ?? models[0];
  const selected = model?.hotspots[activeHotspot];
  const viewerStatus = model?.modelUrl ? (viewerState?.url === model.modelUrl ? viewerState.status : "loading") : "error";

  useEffect(() => {
    const modelUrl = model?.modelUrl;
    if (!modelUrl) return;
    let active = true;
    const scriptId = "nexanet-model-viewer";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    const markFailed = () => {
      script?.setAttribute("data-failed", "true");
      if (active) setViewerState({ url: modelUrl, status: "error" });
    };
    const markReady = () => { if (active) setViewerState({ url: modelUrl, status: "ready" }); };
    if (script?.dataset.failed === "true") {
      queueMicrotask(markFailed);
      return () => { active = false; };
    }
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js";
      script.onerror = markFailed;
      document.head.appendChild(script);
    }
    if (window.customElements.get("model-viewer")) queueMicrotask(markReady);
    else window.customElements.whenDefined("model-viewer").then(markReady).catch(markFailed);
    return () => { active = false; };
  }, [model?.modelUrl]);

  if (!model) return <div className="demo-callout">{t("threeD.noModels")}</div>;
  const modelReady = Boolean(model.modelUrl && viewerStatus === "ready");
  const statusText = modelReady ? t("threeD.modelReady") : viewerStatus === "loading" ? t("threeD.loading") : model.modelUrl ? t("threeD.loadError") : t("threeD.illustration");

  return <div className="three-d-lab">
    <header className="three-d-lab-heading">
      <div>
        <span className="three-d-lab-eyebrow"><i />{t("threeD.eyebrow")}</span>
        <h2>{t("threeD.title")}</h2>
        <p>{t("threeD.intro")}</p>
      </div>
      <div className="three-d-lab-count"><span>{t("threeD.devices")}</span><b>{String(models.length).padStart(2, "0")} <small>3D</small></b></div>
    </header>

    <section className="three-d-device-section" aria-label={t("threeD.chooseDevice")}>
      <div className="three-d-section-label"><span>{t("threeD.chooseDevice")}</span><small>{t("threeD.chooseHint")}</small></div>
      <div className="three-d-device-picker">
        {models.map((item, index) => <button type="button" className={"three-d-device-option" + (model.id === item.id ? " active" : "")} aria-pressed={model.id === item.id} onClick={() => { setSlug(item.slug); setActiveHotspot(0); }} key={item.id}>
          <span className="three-d-device-index">{String(index + 1).padStart(2, "0")}</span>
          <span className="three-d-device-glyph" aria-hidden="true">{item.title.charAt(0)}</span>
          <span className="three-d-device-name"><b>{item.title}</b><small>{item.modelUrl ? t("threeD.modelReady") : t("threeD.illustration")}</small></span>
          <span className="three-d-device-arrow" aria-hidden="true">↗</span>
        </button>)}
      </div>
    </section>

    <div className="three-d-workspace">
      <section className="three-d-viewer-card" aria-label={t("threeD.livePreview")}>
        <div className="three-d-viewer-toolbar"><div className="three-d-scene-title"><span>{t("threeD.livePreview")}</span><b>{model.title}</b></div></div>
        <div className="three-d-stage">
          <div className="three-d-stage-grid" aria-hidden="true" />
          <div className="three-d-stage-glow" aria-hidden="true" />
          {modelReady ? <model-viewer className="three-d-stage-model" src={model.modelUrl!} poster={model.thumbnailUrl ?? undefined} alt={(locale === "id" ? "Model 3D " : "3D model of ") + model.title} camera-controls auto-rotate rotation-per-second="18deg" touch-action="pan-y" shadow-intensity="1" exposure="1.1" environment-image="neutral" loading="lazy" onError={() => setViewerState({ url: model.modelUrl!, status: "error" })}>
            {model.hotspots.map((hotspot, index) => <button type="button" slot={"hotspot-" + hotspot.id} data-position={modelHotspotPosition(model.slug, hotspot, index)} data-normal="0m 1m 0m" className={"three-d-hotspot-marker" + (index === activeHotspot ? " active" : "")} aria-label={(locale === "id" ? "Lihat " : "View ") + hotspot.title} onClick={() => setActiveHotspot(index)} key={hotspot.id}>{index + 1}</button>)}
          </model-viewer> : <div className="three-d-illustration"><DeviceIllustration slug={model.slug} title={model.title}/></div>}
          <span className="three-d-scene-status" role={viewerStatus === "error" && model.modelUrl ? "alert" : "status"}>{statusText}</span>
        </div>
        <p className="three-d-viewer-hint"><span aria-hidden="true">↔</span>{t("threeD.sceneHint")}</p>
      </section>

      <aside className="three-d-inspector">
        <div className="three-d-inspector-heading"><span className="three-d-inspector-eyebrow">{t("threeD.deviceOverview")}</span><h3>{model.title}</h3><p>{model.purpose}</p></div>
        <div className="three-d-inspector-section"><div className="three-d-inspector-section-heading"><b>{t("threeD.components")}</b><span>{String(model.components.length).padStart(2, "0")}</span></div>
          <ul className="three-d-component-list">{model.components.map((component, index) => <li key={component}><span>{String(index + 1).padStart(2, "0")}</span>{component}</li>)}</ul>
        </div>
        {selected && <div className="three-d-selected-point"><span className="three-d-inspector-eyebrow">{t("threeD.selectedPoint")} · {String(activeHotspot + 1).padStart(2, "0")}</span><h4>{selected.title}</h4><p>{selected.description}</p><b>{t("threeD.example")}</b><p>{selected.example}</p></div>}
        {model.hotspots.length > 0 && <div className="three-d-learning-points"><b>{t("threeD.learningPoints")}</b><div>{model.hotspots.map((hotspot, index) => <button type="button" key={hotspot.id} className={index === activeHotspot ? "active" : ""} aria-pressed={index === activeHotspot} onClick={() => setActiveHotspot(index)}><span>{String(index + 1).padStart(2, "0")}</span>{hotspot.title}</button>)}</div></div>}
      </aside>
    </div>
  </div>;
}
