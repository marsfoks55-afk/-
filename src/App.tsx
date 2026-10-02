import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { UpgraderView } from './views/UpgraderView';
import { CasesView } from './views/CasesView';
import { MarketView } from './views/MarketView';
import { InventoryView } from './views/InventoryView';
import { ProfileView } from './views/ProfileView';
import { LegalView } from './views/LegalView';
import { DepositModal } from './components/modals/DepositModal';
import { UpgradeResultModal } from './components/modals/UpgradeResultModal';
import { SteamAuthModal } from './components/modals/SteamAuthModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { ToastContainer } from './components/ui/Toast';
import { Skin } from './types';

const MainLayout: React.FC = () => {
  const { activePage, setActivePage, toasts, dismissToast } = useApp();
  const [upgradeOutcome, setUpgradeOutcome] = useState<{
    won: boolean;
    skin: Skin;
    chance: number;
  } | null>(null);

  const renderActiveView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'upgrader':
        return <UpgraderView onUpgradeResult={(res) => setUpgradeOutcome(res)} />;
      case 'cases':
        return <CasesView />;
      case 'market':
        return <MarketView />;
      case 'inventory':
        return <InventoryView />;
      case 'profile':
      case 'history':
        return <ProfileView />;
      case 'terms':
        return <LegalView initialTab="terms" />;
      case 'privacy':
        return <LegalView initialTab="privacy" />;
      case 'faq':
        return <LegalView initialTab="faq" />;
      case 'changelog':
        return <LegalView initialTab="changelog" />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F4F5F7] flex flex-col font-sans select-none antialiased">
      {/* Header */}
      <Header />

      {/* Main View Area with Motion Page Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <DepositModal />
      <SteamAuthModal />
      <FeedbackModal />

      <UpgradeResultModal
        result={upgradeOutcome}
        onClose={() => setUpgradeOutcome(null)}
        onContinueUpgrade={() => {
          setUpgradeOutcome(null);
          setActivePage('upgrader');
        }}
      />

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
