import React, { useState } from 'react';
import { FileText, Lock, HelpCircle, Mail, AlertTriangle, GitCommit, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface LegalViewProps {
  initialTab?: 'terms' | 'privacy' | 'faq' | 'changelog';
}

export const LegalView: React.FC<LegalViewProps> = ({ initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'faq' | 'changelog'>(initialTab);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 select-none">
      
      {/* Top Banner with Clear Demo Disclaimer */}
      <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 flex items-start gap-4 shadow-lg">
        <div className="p-2 rounded-xl bg-white/5 border border-[#262B34] text-white shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-[#E5B84D]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Правовой статус и архитектура Alpha Hardening 0.1.1
          </h2>
          <p className="text-xs text-[#969EAA] leading-relaxed">
            CASER.GG функционирует в режиме бесплатного демонстрационного прототипа (Closed Alpha Sandbox). В релизе 0.1.1 полностью удалены фиктивные аккаунты, искусственные депозиты и имитация финансовых операций. Платформа не принимает реальные деньги и не осуществляет торговлю реальными скинами.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#262B34] pb-3 text-xs overflow-x-auto">
        {[
          { id: 'terms', label: 'Условия использования', icon: FileText },
          { id: 'privacy', label: 'Политика конфиденциальности', icon: Lock },
          { id: 'faq', label: 'FAQ и Поддержка', icon: HelpCircle },
          { id: 'changelog', label: 'Журнал изменений (Changelog)', icon: GitCommit },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#0D0F13] border border-[#262B34] text-[#969EAA] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-[#0D0F13] border border-[#262B34] rounded-2xl p-6 sm:p-8 text-xs text-[#969EAA] leading-relaxed space-y-6 shadow-xl">
        
        {activeTab === 'terms' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white">Условия использования платформы CASER.GG</h3>
            <p>
              1. <strong>Статус прототипа:</strong> CASER.GG является независимым аналитико-симуляционным интерфейсом. Сервис не является азартной игрой, не принимает депозитов и не осуществляет денежных выплат.
            </p>
            <p>
              2. <strong>Отсутствие финансовых обязательств:</strong> Баланс пользователя в Alpha равен €0.00. Все взаимодействия с кейсами и апгрейдером проводятся в бесплатном симуляционном режиме (Free Sandbox).
            </p>
            <p>
              3. <strong>Интеллектуальная собственность:</strong> Counter-Strike 2, наименования оружия, скинов и графические материалы являются зарегистрированными товарными знаками Valve Corporation. Платформа не аффилирована с Valve.
            </p>
            <p>
              4. <strong>Математическая модель:</strong> Вероятности в апгрейдере рассчитываются по формуле: (Оценка ставки / Стоимость цели) × 95% (максимальный шанс 85%).
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-white">Политика конфиденциальности</h3>
            <p>
              1. <strong>Сбор данных:</strong> Платформа не запрашивает и не хранит пароли, реквизиты платёжных карт или персональные данные.
            </p>
            <p>
              2. <strong>Steam OpenID:</strong> В текущей версии Alpha авторизация находится в статусе «Coming Soon». Никаких сторонних скриптов для сбора данных не используется.
            </p>
            <p>
              3. <strong>Локальное хранилище:</strong> Для сессионных демонстрационных предметов используется временная память браузера.
            </p>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Часто задаваемые вопросы (FAQ)</h3>
            
            <div className="space-y-2">
              <h4 className="font-bold text-white">Почему баланс равен €0.00?</h4>
              <p>
                В Alpha 0.1.1 мы убрали фиктивные балансы и симуляции денежных депозитов. Платформа честно отображает нулевой кошелёк, а все тесты кейсов и апгрейдера доступны бесплатно.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white">Когда заработает Steam Login?</h4>
              <p>
                Авторизация через официальный Valve OpenID 2.0 запланирована на релиз Alpha 0.2.0 после развертывания защищенного бэкенда для верификации callback.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white">Где хранятся изображения скинов?</h4>
              <p>
                Все 26 скинов и 6 тиражей кейсов сохранены локально в директории приложения <code>public/images/</code> для мгновенной загрузки без зависимости от внешних CDN.
              </p>
            </div>

            <div className="pt-4 border-t border-[#262B34] flex items-center gap-3">
              <Mail className="w-4 h-4 text-white" />
              <span>Техническая поддержка и баг-трекер: <strong className="text-white">alpha-desk@caser.gg</strong></span>
            </div>
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Журнал изменений (Changelog)</h3>
            
            <div className="space-y-4">
              <div className="space-y-2 border-l-2 border-[#E5B84D] pl-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#E5B84D]/15 text-[#E5B84D] font-mono-num font-bold text-[10px]">
                    v0.1.1 (Alpha Hardening)
                  </span>
                  <span className="text-[#656D7B] text-[11px]">Текущая версия</span>
                </div>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-[#969EAA]">
                  <li><strong>Удалена имитация авторизации:</strong> убран mockUser, случайные Steam ID и фиктивные аватары. Статус заменен на честный «Steam Login — Coming Soon».</li>
                  <li><strong>Удален фиктивный баланс:</strong> убран стартовый баланс 100€/450€ и переключатель «Live Wallet». Кошелёк отображает реальный начальный статус €0.00.</li>
                  <li><strong>Запрет фиктивных финансовых операций:</strong> отключены фиктивные покупки и продажи за деньги. Апгрейдер и Кейсы переведены в режим бесплатного визуального симулятора с маркировкой [SIMULATION].</li>
                  <li><strong>Инспекция ассетов:</strong> внедрен универсальный компонент <code>SkinImage</code> для скинов и кейсов с автоматической валидацией локальных файлов (100% покрытие).</li>
                  <li><strong>Добавлена форма обратной связи:</strong> модальное окно Feedback для сбора багов и предложений.</li>
                </ul>
              </div>

              <div className="space-y-2 border-l-2 border-[#262B34] pl-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#12151A] text-[#969EAA] font-mono-num font-bold text-[10px]">
                    v0.1.0 (Alpha Baseline)
                  </span>
                  <span className="text-[#656D7B] text-[11px]">Предыдущий релиз</span>
                </div>
                <ul className="space-y-1 list-disc pl-4 text-xs text-[#656D7B]">
                  <li>Развертывание дизайн-системы Dark Fintech.</li>
                  <li>Интеграция Framer Motion (Page transitions, hover feedback, circular wheel).</li>
                  <li>Локализация библиотеки изображений скинов и тиражей кейсов.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
