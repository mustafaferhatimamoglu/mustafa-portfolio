// ---- Site Parametreleri ----
window.APP_CONFIG = {
  LANG_DEFAULT: 'tr',       // index.html için TR varsayılan
  SHOW_SMS: false,
  SHOW_LOCATION: false,

  TELEGRAM: {
    ENABLED: true,
    BOT_TOKEN: '8463888693:AAHS2xsejdWebakw3DOklRljfR9SwQjOCak', // Canlıda .env + proxy önerilir
    CHAT_ID: '6069420562',
    BOT_USERNAME: 'mustafaferhatimamoglu',
    START_PAYLOAD_PREFIX: 'site_',
  },

  CONTACT: {
    PHONE_E164: '+905550051800',
    PHONE_HUMAN: '+90 555 005 18 00',
    WHATS_TEXT: 'Hello Mustafa, writing from your portfolio website.'
  }
};
