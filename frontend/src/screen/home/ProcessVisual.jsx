import { createElement, useId } from 'react';
import { motion as Motion } from 'framer-motion';
import { FiTarget, FiUsers, FiFlag, FiCode, FiServer, FiDatabase, FiArrowUpRight } from 'react-icons/fi';
import { buildProcessColors } from './phaseColors';

const descriptions = [
  'A product brief connects audience, problem and launch priorities into a clear starting point.',
  'The product experience branches into discover, explore and take action, with clear entry points and next steps.',
  'Desktop and mobile wireframes share typography, colors and reusable interface components.',
  'A React interface communicates with a Node.js API over HTTPS. The API connects to MongoDB and shared validation.',
  'A release checklist covers responsive layouts, keyboard navigation, API error handling and production configuration.',
  'Build, preview and verify, deploy, then support the live product through learning and improvement.',
];

// Six geometric diagrams following the existing deliverables and stage order.
export const ProcessVisual = ({ index, reduced, caption, direction = 1, accent = buildProcessColors[index] }) => {
  const arrowId = `process-arrow-${useId().replace(/:/g, '')}-${index}`;
  const wire = (d, delay = 0, arrow = true) => <g key={d}><Motion.path d={d} fill="none" stroke="var(--visual-accent)" strokeWidth="1.6" strokeLinecap="round"
    markerEnd={arrow ? `url(#${arrowId})` : undefined}
    initial={{ pathLength: reduced ? 1 : .18 }} animate={{ pathLength: 1 }}
    transition={{ duration: reduced ? 0 : .65, delay: reduced ? 0 : delay, ease: [.16, 1, .3, 1] }} />
    {!reduced && arrow && <Motion.path d={d} fill="none" stroke="var(--home-ink)" strokeWidth="2.5" strokeLinecap="round"
      initial={{ pathLength: .08, pathOffset: 0, opacity: 0 }} animate={{ pathLength: .08, pathOffset: [0, .92], opacity: [0, .9, 0] }}
      transition={{ duration: .8, delay: delay + .25, ease: 'easeInOut' }} />}</g>;
  const tile = (x, y, w, h, label, accent = false) => <Motion.g key={`${x}-${y}`} initial={reduced ? false : { opacity: .55, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : x / 520 * .12, ease: [.16, 1, .3, 1] }}>
    <rect x={x} y={y} width={w} height={h} rx="8" className={accent ? 'phase-visual__accent-surface' : 'phase-visual__surface'} />
    <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="phase-visual__node-label">{label}</text>
  </Motion.g>;
  const icon = (Icon, x, y, size = 22) => createElement(Icon, { x, y, width: size, height: size, className: 'phase-visual__icon', 'aria-hidden': true });

  const slide = {
    enter: (way) => ({ opacity: .4, x: reduced ? 0 : way * 12, filter: reduced ? 'blur(0px)' : 'blur(2px)' }),
    present: { opacity: 1, x: 0, filter: 'blur(0px)' },
  };
  return <Motion.figure className="phase-visual" initial={false} animate={{ '--visual-accent': accent, '--visual-tint': `${accent}12` }} transition={{ duration: reduced ? 0 : .35 }}>
    <Motion.svg key={index} viewBox="0 0 520 236" role="img" aria-label={descriptions[index]}
      custom={direction} variants={slide} initial="enter" animate="present" transition={{ duration: reduced ? 0 : .4, ease: [.16, 1, .3, 1] }}>
      <defs><marker id={arrowId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 5 3-5 3" fill="none" stroke="var(--visual-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></marker></defs>
      {index === 0 && <>
        <rect x="106" y="14" width="312" height="178" rx="12" className="phase-visual__surface" />
        <text x="129" y="44" className="phase-visual__title">The product brief</text>
        <path d="M128 59H396" className="phase-visual__rule" />
        {[['Who are we building for?', FiUsers], ['What problem are we solving?', FiTarget], ['What matters at launch?', FiFlag]].map(([label, Icon], i) => <Motion.g key={label} initial={reduced ? false : { opacity: .5, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0 : .4, delay: reduced ? 0 : i * .07 }}>{icon(Icon, 128, 74 + i * 34, 18)}<text x="158" y={88 + i * 34}>{label}</text></Motion.g>)}
        {wire('M262 192V202', .1)}{tile(158, 202, 208, 30, 'A clear starting point', true)}
      </>}
      {index === 1 && <>
        {wire('M260 62V95H94V126')}{wire('M260 95V126', .08)}{wire('M260 95H426V126', .16)}
        {tile(166, 18, 188, 44, 'Product experience', true)}
        {tile(28, 128, 132, 44, 'Discover')}{tile(194, 128, 132, 44, 'Explore')}{tile(360, 128, 132, 44, 'Take action')}
        <circle cx="260" cy="95" r="4" fill="var(--visual-accent)" />
        <path d="M94 172V190 M426 172V190" className="phase-visual__rule" />
        <text x="94" y="214" textAnchor="middle" className="phase-visual__secondary">Clear entry points</text>
        <text x="426" y="214" textAnchor="middle" className="phase-visual__secondary">Purposeful next steps</text>
      </>}
      {index === 2 && <>
        <rect x="30" y="34" width="315" height="174" rx="10" className="phase-visual__surface" />
        <path d="M30 60H345" className="phase-visual__rule" />
        {[46,57,68].map(x => <circle key={x} cx={x} cy="47" r="2.5" fill="var(--home-muted)" />)}
        <text x="302" y="50" textAnchor="end" className="phase-visual__secondary">Desktop</text>
        <rect x="50" y="82" width="124" height="9" rx="3" fill="var(--visual-accent)" />
        <path d="M50 109H184 M50 121H157" stroke="var(--home-muted)" strokeWidth="3" strokeLinecap="round" />
        {tile(50,148,91,32,'Explore',true)}
        <rect x="215" y="82" width="109" height="104" rx="6" className="phase-visual__accent-surface" />
        <path d="m236 145 20-23 15 17 15-13 19 27" fill="none" stroke="var(--visual-accent)" strokeWidth="1.5" />
        <Motion.rect x="333" y="83" width="88" height="142" rx="12" className="phase-visual__surface" initial={reduced ? false : { opacity: .6, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .55, ease: [.16, 1, .3, 1] }} />
        <path d="M361 94H393" stroke="var(--visual-accent)" strokeWidth="3" strokeLinecap="round" />
        <rect x="344" y="109" width="66" height="57" rx="4" className="phase-visual__accent-surface" />
        <path d="M345 181H406 M345 192H390" stroke="var(--home-muted)" strokeWidth="2" />
        <rect x="344" y="204" width="39" height="9" rx="3" fill="var(--visual-accent)" />
        <text x="428" y="218" className="phase-visual__secondary">Mobile</text>
        {['#92d8df','#c3b7ee','#eab997'].map((color,i) => <circle key={color} cx={389+i*30} cy="45" r="9" fill={color} />)}
      </>}
      {index === 3 && <>
        <text x="260" y="28" textAnchor="middle" className="phase-visual__title">One connected application</text>
        {wire('M173 111H187')}{wire('M333 111H347',.12)}{wire('M260 159V188',.2)}
        {[[27,'React interface','Frontend',FiCode],[187,'Node.js API','Application logic',FiServer],[347,'MongoDB','Product data',FiDatabase]].map(([x,label,detail,Icon],i) => <Motion.g key={label} initial={reduced ? false : { opacity: .55, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .5, delay: reduced ? 0 : i * .07, ease: [.16, 1, .3, 1] }}>
          <rect x={x} y="62" width="146" height="97" rx="10" className={i === 1 ? 'phase-visual__accent-surface' : 'phase-visual__surface'} />
          {icon(Icon,x+62,76)}
          <text x={x+73} y="122" textAnchor="middle" className="phase-visual__node-label">{label}</text>
          <text x={x+73} y="145" textAnchor="middle" className="phase-visual__secondary">{detail}</text>
        </Motion.g>)}
        <text x="180" y="53" textAnchor="middle" className="phase-visual__secondary">HTTPS</text>
        <text x="340" y="53" textAnchor="middle" className="phase-visual__secondary">Data</text>
        {tile(171,190,178,32,'Shared validation',true)}
      </>}
      {index === 4 && <>
        <text x="44" y="29" className="phase-visual__title">Release checklist</text>
        {['Responsive layouts','Keyboard navigation','API error handling','Production configuration'].map((label,i) => <g key={label}>
          <path d={`M44 ${48+i*44}H476`} className="phase-visual__rule" />
          <text x="50" y={77+i*44} className="phase-visual__node-label">{label}</text>
          <rect x="445" y={59+i*44} width="24" height="24" rx="6" className="phase-visual__accent-surface" />
          {wire(`M451 ${71+i*44}l4 4 9-10`,i*.06,false)}
        </g>)}
      </>}
      {index === 5 && <>
        {wire('M70 122H446')}{wire('M164 116V56H181',.08)}{wire('M270 128V197H297',.16)}
        {[70,164,270,446].map(x => <circle key={x} cx={x} cy="122" r="7" fill="var(--home-panel)" stroke="var(--visual-accent)" strokeWidth="2" />)}
        {tile(181,36,173,40,'Preview & verify',true)}{tile(297,177,165,40,'Learn & improve',true)}
        <text x="70" y="156" textAnchor="middle" className="phase-visual__node-label">Build</text>
        <text x="270" y="103" textAnchor="middle" className="phase-visual__node-label">Deploy</text>
        <text x="446" y="156" textAnchor="middle" className="phase-visual__node-label">Live</text>
      </>}
    </Motion.svg>
    <Motion.figcaption key={caption} initial={{ opacity: .4 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}><FiArrowUpRight aria-hidden="true" />{caption}</Motion.figcaption>
  </Motion.figure>;
};
