import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Box, Sparkles, Shield, Database, ChevronRight, Layers, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CS2_CASES } from '../data/cases';
import { SKINS_DATABASE } from '../data/skins';
import { SkinImage } from '../components/ui/SkinImage';
import { sound } from '../utils/sound';

export const HomeView: React.FC = () => {
  const { setActivePage, formatPrice } = useApp();

  const showcaseSkins = SKINS_DATABASE.slice(0, 8);
  const popularCases = CS2_CASES.slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-20 select-none">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0D0F13] border border-[#262B34] p-8 sm:p-14 lg:p-16">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151A] border border-[#262B34] text-xs font-medium text-[#969EAA]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B84D]" />
            <span>CASER.GG Architecture • Alpha Hardening 0.1.1</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4F5F7] tracking-tight leading-[1.08] text-balance"
          >
            THE NEXT LEVEL OF <br />
            <span className="text-[#969EAA]">SKIN SIMULATION.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-sm sm:text-base text-[#969EAA] max-w-xl leading-relaxed"
          >
            Explore collections, analyze CS2 probabilities and experience upgrader mechanics in a transparent, zero-monetary sandbox prototype.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <button
              onClick={() => {
                sound.playClick();
                setActivePage('cases');
              }}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-[#E5E5E5] transition-all flex items-center gap-2 shadow-lg shadow-white/5 active:scale-95"
            >
              <span>Explore Cases</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActivePage('upgrader');
              }}
              className="px-6 py-3 rounded-xl bg-[#12151A] hover:bg-[#191D24] text-white border border-[#262B34] font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#969EAA]" />
              <span>Open Upgrader</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Visual Composition using Unified SkinImage */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-96 space-y-3 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#12151A] border border-[#262B34] rounded-2xl p-4 shadow-2xl flex items-center gap-4 transform rotate-1"
          >
            <div className="w-20 h-16 shrink-0">
              <SkinImage
                src={SKINS_DATABASE[0].image}
                alt={SKINS_DATABASE[0].name}
                category={SKINS_DATABASE[0].category}
                rarity={SKINS_DATABASE[0].rarity}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{SKINS_DATABASE[0].weapon} | {SKINS_DATABASE[0].name}</p>
              <p className="text-xs text-[#969EAA] font-mono-num">{formatPrice(SKINS_DATABASE[0].price)}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-[#12151A] border border-[#262B34] rounded-2xl p-4 shadow-2xl flex items-center gap-4 transform -rotate-2 ml-6"
          >
            <div className="w-20 h-16 shrink-0">
              <SkinImage
                src={SKINS_DATABASE[1].image}
                alt={SKINS_DATABASE[1].name}
                category={SKINS_DATABASE[1].category}
                rarity={SKINS_DATABASE[1].rarity}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{SKINS_DATABASE[1].weapon} | {SKINS_DATABASE[1].name}</p>
              <p className="text-xs text-[#969EAA] font-mono-num">{formatPrice(SKINS_DATABASE[1].price)}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Honest Feature Pillar Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#12151A] border border-[#262B34] flex items-center justify-center text-white">
            <Cpu className="w-5 h-5 text-[#E5B84D]" />
          </div>
          <h3 className="text-base font-bold text-[#F4F5F7]">Mathematical Model</h3>
          <p className="text-xs text-[#969EAA] leading-relaxed">
            Открытые математические соотношения шансов (RTP 95%) в изолированном симуляторе без риска финансовых потерь.
          </p>
        </div>

        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#12151A] border border-[#262B34] flex items-center justify-center text-white">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-base font-bold text-[#F4F5F7]">Official Item Registry</h3>
          <p className="text-xs text-[#969EAA] leading-relaxed">
            Аутентичные рендеры скинов и официальных кейсов Valve CS2, сохраненные локально для высокой скорости работы.
          </p>
        </div>

        <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 space-y-3 hover:border-white/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#12151A] border border-[#262B34] flex items-center justify-center text-white">
            <Shield className="w-5 h-5 text-[#A8B4C5]" />
          </div>
          <h3 className="text-base font-bold text-[#F4F5F7]">Transparent Architecture</h3>
          <p className="text-xs text-[#969EAA] leading-relaxed">
            Никаких скрытых списаний, фейковых транзакций или ботов. Полная изоляция Alpha 0.1.1 от реальных денег.
          </p>
        </div>
      </section>

      {/* Popular Cases Section with Unified SkinImage */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Популярные кейсы</h2>
            <p className="text-xs text-[#969EAA] mt-0.5">Официальные тиражи Counter-Strike 2 в режиме бесплатной симуляции</p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActivePage('cases');
            }}
            className="flex items-center gap-1.5 text-xs text-[#969EAA] hover:text-white transition-colors"
          >
            <span>Весь каталог</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularCases.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                sound.playClick();
                setActivePage('cases');
              }}
              className="group bg-[#0D0F13] hover:bg-[#12151A] border border-[#262B34] hover:border-[#3B4252] rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold text-[#969EAA] uppercase">
                    {c.category}
                  </span>
                  <span className="text-xs font-mono-num font-semibold text-white bg-[#12151A] px-2 py-0.5 rounded border border-[#262B34]">
                    {formatPrice(c.price)}
                  </span>
                </div>

                <div className="h-36 flex items-center justify-center my-3">
                  <SkinImage
                    src={c.image}
                    alt={c.name}
                    isCase={true}
                    className="max-h-full group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                <h3 className="text-sm font-bold text-white">
                  {c.name}
                </h3>
                <p className="text-[11px] text-[#969EAA] mt-1 line-clamp-2">
                  {c.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#262B34] flex items-center justify-between text-[11px] text-[#969EAA]">
                <span>{c.skins.length} скинов</span>
                <span className="text-white font-medium group-hover:translate-x-0.5 transition-transform">
                  Симуляция →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Horizontal Skin Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Витрина предметов CS2</h2>
            <p className="text-xs text-[#969EAA] mt-0.5">Официальные скины для моделирования апгрейдов</p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setActivePage('market');
            }}
            className="flex items-center gap-1.5 text-xs text-[#969EAA] hover:text-white transition-colors"
          >
            <span>В каталог</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {showcaseSkins.map((skin) => (
            <motion.div
              key={skin.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.15 }}
              onClick={() => {
                sound.playClick();
                setActivePage('market');
              }}
              className="bg-[#0D0F13] hover:bg-[#12151A] border border-[#262B34] hover:border-[#3B4252] rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-colors h-44"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#969EAA] font-mono-num">{skin.wear || 'FN'}</span>
                <span className="font-mono-num font-semibold text-white">{formatPrice(skin.price)}</span>
              </div>

              <div className="flex-1 flex items-center justify-center p-1.5">
                <SkinImage
                  src={skin.image}
                  alt={skin.name}
                  category={skin.category}
                  rarity={skin.rarity}
                />
              </div>

              <div className="leading-tight">
                <p className="text-[10px] text-[#969EAA] truncate">{skin.weapon}</p>
                <p className="text-xs font-semibold text-white truncate">{skin.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
