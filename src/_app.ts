import type { App } from 'vue';
import { createVuestic } from 'vuestic-ui'

export default (app: App) => {
  app.use(
    createVuestic({
      config: {
        colors: {
          variables: {

          },
        },
      }
    })
  );
}