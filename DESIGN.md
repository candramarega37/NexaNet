---
name: "NexaNet"
description: "Learn. Practice. Troubleshoot. — A measured-gain TKJ learning loop"
colors:
  deep-violet: "#7c3aed"
  deep-violet-bright: "#a78bfa"
  electric-cyan: "#22d3ee"
  amber-gold: "#e2a63b"
  green-success: "#34d399"
  red-error: "#f87171"
  bg-deep: "#0c0616"
  bg-mid: "#120a24"
  surface: "#17102b"
  surface-elevated: "#1e1436"
  surface-high: "#251b45"
  line: "#35265c"
  line-soft: "#2a1d4c"
  ink: "#f2ecfd"
  muted: "#a99bcb"
  faint: "#7c6fa3"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(44px, 4.8vw, 66px)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "clamp(30px, 3vw, 42px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.8
  body-sm:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.08em"
  label-sm:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.12em"
  label-xs:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "8px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.14em"
  mono:
    fontFamily: "monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.6
  mono-sm:
    fontFamily: "monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.6
  mono-xs:
    fontFamily: "monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "14px"
  xxl: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  xxxl: "32px"
components:
  button-primary:
    backgroundColor: "linear-gradient(135deg, {colors.deep-violet}, #5b21b6)"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "linear-gradient(135deg, #8b5cf6, #6d28d9)"
  button-dark:
    backgroundColor: "#1c1033"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
    borderColor: "{colors.line}"
  button-ghost:
    backgroundColor: "#ffffff08"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
    borderColor: "{colors.line}"
  button-light:
    backgroundColor: "#e9e2fb"
    textColor: "#2e1a5e"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
  button-outline-light:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
    borderColor: "#6d5aa8"
  input-base:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "44px"
    borderColor: "{colors.line}"
  card-base:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.line}"
    rounded: "{rounded.xl}"
    padding: "16px"
  stat-card:
    backgroundColor: "linear-gradient(160deg, {colors.surface-elevated}, {colors.surface})"
    borderColor: "{colors.line}"
    rounded: "{rounded.xl}"
    padding: "17px"
  nav-link:
    textColor: "{colors.muted}"
    fontSize: "11px"
    fontWeight: 400
  nav-link-active:
    textColor: "{colors.ink}"
  sidebar-link:
    textColor: "{colors.muted}"
    padding: "10px"
    rounded: "{rounded.md}"
  sidebar-link-active:
    backgroundColor: "linear-gradient(135deg, {colors.deep-violet}, #5b21b6)"
    textColor: "{colors.ink}"
    boxShadow: "inset 3px 0 {colors.electric-cyan}"