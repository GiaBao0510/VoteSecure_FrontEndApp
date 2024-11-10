import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'; // Or any other icon set
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  display:{
    mobileBreakpoint: 'sm',
  },
  icons: {
    defaultSet: 'mdi', // or other icon sets: 'md' || 'fa' || 'mdiSvg' || 'mdi'
  },
});