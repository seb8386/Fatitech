"use client";

import { useState, useRef } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Check,
  Upload,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ----------------------------------------------------------------------
// Dictionnaire pour l'internationalisation (i18n)
// ----------------------------------------------------------------------
type Language = "fr" | "en" | "es" | "de";

const TRANSLATIONS = {
  fr: {
    title: "Paramètres",
    subtitle: "Gérez votre compte et vos préférences",
    tabs: {
      profile: "Profil",
      security: "Sécurité",
      notifications: "Notifications",
      subscription: "Abonnement",
      preferences: "Préférences",
    },
    profile: {
      title: "Informations du profil",
      changePhoto: "Changer la photo",
      removePhoto: "Supprimer",
      photoHint: "JPG, PNG max 5MB",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      domain: "Domaine",
      timezone: "Fuseau horaire",
      bio: "Bio / Description",
      bioPlaceholder: "Parlez de vous et de votre activité...",
      save: "Sauvegarder les modifications",
      saved: "Sauvegardé !",
    },
    security: {
      passwordTitle: "Modifier le mot de passe",
      currentPassword: "Mot de passe actuel",
      newPassword: "Nouveau mot de passe",
      confirmPassword: "Confirmer le nouveau mot de passe",
      updatePasswordBtn: "Mettre à jour le mot de passe",
      twoFactorTitle: "Authentification à deux facteurs",
      twoFactorDesc: "Sécurisez votre compte avec la 2FA",
      notEnabled: "Non activé",
      twoFactorWarning: "⚠️ Activez la 2FA pour protéger votre compte contre les accès non autorisés",
      authApp: "Application d'authentification",
      sms: "SMS",
      activeSessions: "Sessions actives",
      current: "Actuelle",
      revoke: "Révoquer",
    },
    subscription: {
      currentPlan: "Plan actuel",
      freePlan: "Plan Gratuit",
      freeDetails: "2 comptes · 30 posts/mois · 50 crédits IA",
      usedCredits: "15 / 50 crédits IA utilisés ce mois",
      changePlan: "Changer de plan",
      popular: "Populaire",
      choose: "Choisir",
      unlimited: "illimités",
      perMonth: "/mois",
    },
    preferences: {
      title: "Préférences",
      interfaceLang: "Langue de l'interface",
      aiLang: "Langue du contenu IA",
      aiModel: "Modèle IA préféré",
      currency: "Devise",
      save: "Sauvegarder",
      saved: "Sauvegardé !",
    },
    notifications: {
      title: "Préférences de notifications",
      list: [
        { label: "Email - Publications", description: "Notifications par email pour les publications" },
        { label: "Email - Rapports hebdomadaires", description: "Résumé de performance chaque semaine" },
        { label: "Push - Alertes en temps réel", description: "Notifications push dans le navigateur" },
        { label: "Push - Recommandations IA", description: "Conseils personnalisés de l'IA" },
        { label: "Push - Alertes de sécurité", description: "Connexions suspectes" },
      ],
    },
  },
  en: {
    title: "Settings",
    subtitle: "Manage your account and preferences",
    tabs: {
      profile: "Profile",
      security: "Security",
      notifications: "Notifications",
      subscription: "Subscription",
      preferences: "Preferences",
    },
    profile: {
      title: "Profile Information",
      changePhoto: "Change photo",
      removePhoto: "Remove",
      photoHint: "JPG, PNG max 5MB",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone Number",
      domain: "Domain",
      timezone: "Timezone",
      bio: "Bio / Description",
      bioPlaceholder: "Tell us about yourself and your activity...",
      save: "Save Changes",
      saved: "Saved!",
    },
    security: {
      passwordTitle: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      updatePasswordBtn: "Update Password",
      twoFactorTitle: "Two-Factor Authentication",
      twoFactorDesc: "Secure your account with 2FA",
      notEnabled: "Not Enabled",
      twoFactorWarning: "⚠️ Enable 2FA to protect your account against unauthorized access",
      authApp: "Authenticator App",
      sms: "SMS",
      activeSessions: "Active Sessions",
      current: "Current",
      revoke: "Revoke",
    },
    subscription: {
      currentPlan: "Current Plan",
      freePlan: "Free Plan",
      freeDetails: "2 accounts · 30 posts/month · 50 AI credits",
      usedCredits: "15 / 50 AI credits used this month",
      changePlan: "Change Plan",
      popular: "Popular",
      choose: "Choose",
      unlimited: "unlimited",
      perMonth: "/month",
    },
    preferences: {
      title: "Preferences",
      interfaceLang: "Interface Language",
      aiLang: "AI Content Language",
      aiModel: "Preferred AI Model",
      currency: "Currency",
      save: "Save",
      saved: "Saved!",
    },
    notifications: {
      title: "Notification Preferences",
      list: [
        { label: "Email - Publications", description: "Email notifications for new publications" },
        { label: "Email - Weekly Reports", description: "Weekly performance recap" },
        { label: "Push - Real-time Alerts", description: "In-browser push notifications" },
        { label: "Push - AI Recommendations", description: "Personalized AI suggestions" },
        { label: "Push - Security Alerts", description: "Suspicious login attempts" },
      ],
    },
  },
  es: {
    title: "Configuración",
    subtitle: "Gestione su cuenta y preferencias",
    tabs: {
      profile: "Perfil",
      security: "Seguridad",
      notifications: "Notificaciones",
      subscription: "Suscripción",
      preferences: "Preferencias",
    },
    profile: {
      title: "Información del perfil",
      changePhoto: "Cambiar foto",
      removePhoto: "Eliminar",
      photoHint: "JPG, PNG máx 5MB",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      phone: "Teléfono",
      domain: "Dominio",
      timezone: "Zona horaria",
      bio: "Biografía",
      bioPlaceholder: "Cuéntenos sobre usted...",
      save: "Guardar cambios",
      saved: "¡Guardado!",
    },
    security: {
      passwordTitle: "Cambiar contraseña",
      currentPassword: "Contraseña actual",
      newPassword: "Nueva contraseña",
      confirmPassword: "Confirmar contraseña",
      updatePasswordBtn: "Actualizar contraseña",
      twoFactorTitle: "Autenticación de dos factores",
      twoFactorDesc: "Proteja su cuenta con 2FA",
      notEnabled: "No activado",
      twoFactorWarning: "⚠️ Active 2FA para proteger su cuenta",
      authApp: "Aplicación de autenticación",
      sms: "SMS",
      activeSessions: "Sesiones activas",
      current: "Actual",
      revoke: "Revocar",
    },
    subscription: {
      currentPlan: "Plan actual",
      freePlan: "Plan Gratuito",
      freeDetails: "2 cuentas · 30 publicaciones/mes · 50 créditos IA",
      usedCredits: "15 / 50 créditos IA usados este mes",
      changePlan: "Cambiar de plan",
      popular: "Popular",
      choose: "Elegir",
      unlimited: "ilimitados",
      perMonth: "/mes",
    },
    preferences: {
      title: "Preferencias",
      interfaceLang: "Idioma de la interfaz",
      aiLang: "Idioma del contenido IA",
      aiModel: "Modelo IA preferido",
      currency: "Moneda",
      save: "Guardar",
      saved: "¡Guardado!",
    },
    notifications: {
      title: "Preferencias de notificaciones",
      list: [
        { label: "Correo - Publicaciones", description: "Notificaciones por correo sobre publicaciones" },
        { label: "Correo - Informes semanales", description: "Resumen de rendimiento semanal" },
        { label: "Push - Alertas en tiempo real", description: "Notificaciones en el navegador" },
        { label: "Push - Recomendaciones IA", description: "Consejos personalizados" },
        { label: "Push - Alertas de seguridad", description: "Inicios de sesión sospechosos" },
      ],
    },
  },
  de: {
    title: "Einstellungen",
    subtitle: "Verwalten Sie Ihr Konto und Ihre Einstellungen",
    tabs: {
      profile: "Profil",
      security: "Sicherheit",
      notifications: "Benachrichtigungen",
      subscription: "Abonnement",
      preferences: "Einstellungen",
    },
    profile: {
      title: "Profilinformationen",
      changePhoto: "Foto ändern",
      removePhoto: "Entfernen",
      photoHint: "JPG, PNG max 5MB",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail",
      phone: "Telefon",
      domain: "Bereich",
      timezone: "Zeitzone",
      bio: "Biografie",
      bioPlaceholder: "Erzählen Sie uns etwas über sich...",
      save: "Änderungen speichern",
      saved: "Gespeichert!",
    },
    security: {
      passwordTitle: "Passwort ändern",
      currentPassword: "Aktuelles Passwort",
      newPassword: "Neues Passwort",
      confirmPassword: "Neues Passwort bestätigen",
      updatePasswordBtn: "Passwort aktualisieren",
      twoFactorTitle: "Zwei-Faktor-Authentifizierung",
      twoFactorDesc: "Sichern Sie Ihr Konto mit 2FA",
      notEnabled: "Nicht aktiviert",
      twoFactorWarning: "⚠️ Aktivieren Sie 2FA zum Schutz Ihres Kontos",
      authApp: "Authenticator-App",
      sms: "SMS",
      activeSessions: "Aktive Sitzungen",
      current: "Aktuell",
      revoke: "Widerrufen",
    },
    subscription: {
      currentPlan: "Aktueller Tarif",
      freePlan: "Kostenloser Tarif",
      freeDetails: "2 Konten · 30 Beiträge/Monat · 50 KI-Guthaben",
      usedCredits: "15 / 50 KI-Guthaben diesen Monat genutzt",
      changePlan: "Tarif wechseln",
      popular: "Beliebt",
      choose: "Wählen",
      unlimited: "unbegrenzt",
      perMonth: "/Monat",
    },
    preferences: {
      title: "Einstellungen",
      interfaceLang: "Oberflächensprache",
      aiLang: "KI-Inhaltssprache",
      aiModel: "Bevorzugtes KI-Modell",
      currency: "Währung",
      save: "Speichern",
      saved: "Gespeichert!",
    },
    notifications: {
      title: "Benachrichtigungseinstellungen",
      list: [
        { label: "E-Mail - Veröffentlichungen", description: "E-Mail-Benachrichtigungen für Beiträge" },
        { label: "E-Mail - Wochenberichte", description: "Wöchentliche Zusammenfassung" },
        { label: "Push - Echtzeit-Benachrichtigungen", description: "Browser-Push-Benachrichtigungen" },
        { label: "Push - KI-Empfehlungen", description: "Personalisierte Ratschläge" },
        { label: "Push - Sicherheitswarnungen", description: "Verdächtige Anmeldungen" },
      ],
    },
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // 1. État pour la langue
  const [language, setLanguage] = useState<Language>("fr");
  const t = TRANSLATIONS[language]; // Raccourci vers les traductions de la langue courante

  // 2. État et référence pour l'avatar photo
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Gestionnaire de changement de photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(language === "fr" ? "Le fichier dépasse la limite de 5 Mo." : "File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const TABS = [
    { id: "profile", label: t.tabs.profile, icon: <User size={16} /> },
    { id: "security", label: t.tabs.security, icon: <Shield size={16} /> },
    { id: "notifications", label: t.tabs.notifications, icon: <Bell size={16} /> },
    { id: "subscription", label: t.tabs.subscription, icon: <CreditCard size={16} /> },
    { id: "preferences", label: t.tabs.preferences, icon: <Globe size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 space-y-6">
      {/* Input de fichier caché */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white">{t.title}</h1>
        <p className="text-slate-400 mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar tabs */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 h-fit">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="xl:col-span-3 space-y-6">
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-6">
              <h2 className="text-xl font-bold text-white">{t.profile.title}</h2>

              {/* Avatar dynamique */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg overflow-hidden shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "U"
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-slate-300 border border-white/10 transition-all cursor-pointer"
                    >
                      <Upload size={14} />
                      {t.profile.changePhoto}
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                        title={t.profile.removePhoto}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{t.profile.photoHint}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t.profile.firstName} placeholder="Jean" defaultValue="" />
                <Input label={t.profile.lastName} placeholder="Dupont" defaultValue="" />
                <Input label={t.profile.email} type="email" placeholder="jean@exemple.com" defaultValue="" />
                <Input label={t.profile.phone} placeholder="+33 6 00 00 00 00" />
                <Input label={t.profile.domain} placeholder="Marketing digital, Tech..." />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.profile.timezone}</label>
                  <select className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all">
                    <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.profile.bio}</label>
                <textarea
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 resize-none transition-all"
                  placeholder={t.profile.bioPlaceholder}
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  {saved ? (
                    <>
                      <Check size={16} className="mr-2" />
                      {t.profile.saved}
                    </>
                  ) : (
                    t.profile.save
                  )}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">{t.security.passwordTitle}</h2>
                <Input
                  label={t.security.currentPassword}
                  type={showPassword ? "text" : "password"}
                  icon={
                    <button onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <Input label={t.security.newPassword} type="password" />
                <Input label={t.security.confirmPassword} type="password" />
                <Button>{t.security.updatePasswordBtn}</Button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{t.security.twoFactorTitle}</h2>
                    <p className="text-sm text-slate-400 mt-1">{t.security.twoFactorDesc}</p>
                  </div>
                  <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">{t.security.notEnabled}</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-500/30">
                  <p className="text-sm text-amber-300">
                    {t.security.twoFactorWarning}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm border border-white/10 transition-all">
                    <Smartphone size={16} />
                    {t.security.authApp}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm border border-white/10 transition-all">
                    <Key size={16} />
                    {t.security.sms}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
                <h2 className="text-xl font-bold text-white">{t.security.activeSessions}</h2>
                {[
                  { device: "Chrome · Windows 11", location: "Paris, France", current: true, time: "Maintenant" },
                  { device: "Safari · iPhone 15", location: "Paris, France", current: false, time: "Il y a 2h" },
                  { device: "Firefox · MacOS", location: "Lyon, France", current: false, time: "Il y a 3 jours" },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div>
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        {session.device}
                        {session.current && (
                          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{t.security.current}</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">{session.location} · {session.time}</p>
                    </div>
                    {!session.current && (
                      <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
                        {t.security.revoke}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-violet-500/30 bg-violet-900/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{t.subscription.currentPlan}</p>
                    <h2 className="text-2xl font-black text-white mt-1">{t.subscription.freePlan}</h2>
                    <p className="text-sm text-slate-400 mt-2">{t.subscription.freeDetails}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">0€</p>
                    <p className="text-sm text-slate-400">{t.subscription.perMonth}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-full w-[30%] rounded-full bg-violet-500" />
                </div>
                <p className="text-xs text-slate-400 mt-1">{t.subscription.usedCredits}</p>
              </div>

              <h2 className="text-xl font-bold text-white">{t.subscription.changePlan}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { name: "Starter", price: 19, accounts: 5, posts: 100, credits: 200, popular: false },
                  { name: "Pro", price: 49, accounts: 15, posts: 500, credits: 1000, popular: true },
                  { name: "Business", price: 149, accounts: 50, posts: 2000, credits: 5000, popular: false },
                  { name: "Enterprise", price: 499, accounts: -1, posts: -1, credits: -1, popular: false },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-2xl border p-5 relative ${
                      plan.popular
                        ? "border-violet-500 bg-violet-900/20"
                        : "border-white/10 bg-slate-900/80"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-violet-600 text-white">
                        {t.subscription.popular}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="my-3">
                      <span className="text-3xl font-black text-white">{plan.price}€</span>
                      <span className="text-slate-400 text-sm">{t.subscription.perMonth}</span>
                    </div>
                    <ul className="space-y-1.5 text-sm text-slate-400 mb-4">
                      <li className="flex items-center gap-1.5">
                        <Check size={13} className="text-emerald-400" />
                        {plan.accounts === -1 ? `Comptes ${t.subscription.unlimited}` : `${plan.accounts} comptes`}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check size={13} className="text-emerald-400" />
                        {plan.posts === -1 ? `Posts ${t.subscription.unlimited}` : `${plan.posts} posts${t.subscription.perMonth}`}
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check size={13} className="text-emerald-400" />
                        {plan.credits === -1 ? `Crédits IA ${t.subscription.unlimited}` : `${plan.credits} crédits IA`}
                      </li>
                    </ul>
                    <Button variant={plan.popular ? "default" : "outline"} size="sm" className="w-full">
                      {t.subscription.choose} {plan.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-6">
              <h2 className="text-xl font-bold text-white">{t.preferences.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    {t.preferences.interfaceLang}
                  </label>
                  {/* Sélecteur de langue fonctionnel */}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all cursor-pointer"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    {t.preferences.aiLang}
                  </label>
                  <select className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    {t.preferences.aiModel}
                  </label>
                  <select className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all">
                    <option value="gpt4o">GPT-4o (OpenAI)</option>
                    <option value="claude">Claude 3.5 (Anthropic)</option>
                    <option value="gemini">Gemini 1.5 Pro (Google)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    {t.preferences.currency}
                  </label>
                  <select className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-all">
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  {saved ? (
                    <>
                      <Check size={16} className="mr-2" />
                      {t.preferences.saved}
                    </>
                  ) : (
                    t.preferences.save
                  )}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 space-y-4">
              <h2 className="text-xl font-bold text-white">{t.notifications.title}</h2>
              <div className="space-y-3">
                {t.notifications.list.map((pref, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">{pref.label}</p>
                      <p className="text-xs text-slate-400">{pref.description}</p>
                    </div>
                    <div className="w-10 h-5 rounded-full bg-violet-600 relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}