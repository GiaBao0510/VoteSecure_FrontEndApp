import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Or any other icon set

export default createVuetify({
  icons: {
    defaultSet: 'mdi', // or other icon sets: 'md' || 'fa' || 'mdiSvg' || 'mdi'
  },
});