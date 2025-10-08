// ---- Site Parametreleri ----
window.APP_CONFIG = {
  LANG_DEFAULT: 'tr',
  SHOW_SMS: false,           // true yaparsan SMS butonu görünür
  SHOW_LOCATION: false,      // true -> heroMeta görünür

  TELEGRAM: {
    ENABLED: true,
    BOT_TOKEN: '8463888693:AAHS2xsejdWebakw3DOklRljfR9SwQjOCak', // Canlıda token'ı istemcide tutmak güvenli değildir.
    CHAT_ID: '6069420562',          // Sana/kanalına gidecek mesajların chat_id'si
    BOT_USERNAME: 'mustafaferhatimamoglu', // t.me/@kullaniciadi (login/approval linkleri için)
    START_PAYLOAD_PREFIX: 'site_',     // /start site_XXXXX gibi payload üretir
  },

  CONTACT: {
    PHONE_E164: '+905550051800',
    PHONE_HUMAN: '+90 555 005 18 00',
    WHATS_TEXT: 'Merhaba Mustafa, portföy sitenden yazıyorum.'
  }
};