import {ToastNotification}from 'electron-windows-notifications';

const appId = 'de.nordgedanken.lornsenschule_v2'

const do_notification = (title, text) => {
  let notification = new ToastNotification({
    appId: appId,
    template: `<toast><visual><binding template="ToastText01"><text id="1">%s</text></binding></visual></toast>`,
    strings: ['Hi!']
  })
  notification.on('activated', () => console.log('Activated!'))
  notification.show();
}

export default do_notification;
