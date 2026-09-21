'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CONTACT_CONFIG, SiteContactConfig } from '@/lib/contact-config';

interface ContactContextType {
  contact: SiteContactConfig;
  isLoading: boolean;
  refreshContact: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType>({
  contact: DEFAULT_CONTACT_CONFIG,
  isLoading: false,
  refreshContact: async () => {},
});

export function ContactProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig?: SiteContactConfig;
}) {
  const [contact, setContact] = useState<SiteContactConfig>(
    initialConfig || DEFAULT_CONTACT_CONFIG
  );
  const [isLoading, setIsLoading] = useState(!initialConfig);

  const fetchContact = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setContact(json.data);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải cấu hình liên hệ:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  return (
    <ContactContext.Provider value={{ contact, isLoading, refreshContact: fetchContact }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  return context || { contact: DEFAULT_CONTACT_CONFIG, isLoading: false, refreshContact: async () => {} };
}
