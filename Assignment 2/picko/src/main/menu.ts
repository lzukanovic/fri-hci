import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  ipcMain,
} from 'electron';
import { Theme } from '../renderer/context/ThemeContext';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;
  currentTheme: Theme;

  constructor(mainWindow: BrowserWindow, currentTheme: Theme) {
    this.mainWindow = mainWindow;
    this.currentTheme = currentTheme;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Picko',
      submenu: [
        {
          label: 'About Picko',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Theme',
          submenu: [
            {
              label: 'System',
              type: 'radio',
              checked: this.currentTheme === 'system',
              click: () => {
                this.mainWindow.webContents.send('change-theme', 'system');
              },
            },
            {
              label: 'Light',
              type: 'radio',
              checked: this.currentTheme === 'light',
              click: () => {
                this.mainWindow.webContents.send('change-theme', 'light');
              },
            },
            {
              label: 'Dark',
              type: 'radio',
              checked: this.currentTheme === 'dark',
              click: () => {
                this.mainWindow.webContents.send('change-theme', 'dark');
              },
            },
          ],
        },
        { type: 'separator' },
        {
          label: 'Reset Data...',
          click: () => ipcMain.emit('reset-data'),
        },
        {
          label: 'Delete All Data...',
          click: () => ipcMain.emit('clear-data'),
        },
        // { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        // {
        //   label: 'Hide Others',
        //   accelerator: 'Command+Shift+H',
        //   selector: 'hideOtherApplications:',
        // },
        // { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    // const subMenuHelp: MenuItemConstructorOptions = {
    //   label: 'Help',
    //   submenu: [
    //     {
    //       label: 'Learn More',
    //       click() {
    //         shell.openExternal('https://electronjs.org');
    //       },
    //     },
    //     {
    //       label: 'Documentation',
    //       click() {
    //         shell.openExternal(
    //           'https://github.com/electron/electron/tree/main/docs#readme',
    //         );
    //       },
    //     },
    //     {
    //       label: 'Community Discussions',
    //       click() {
    //         shell.openExternal('https://www.electronjs.org/community');
    //       },
    //     },
    //     {
    //       label: 'Search Issues',
    //       click() {
    //         shell.openExternal('https://github.com/electron/electron/issues');
    //       },
    //     },
    //   ],
    // };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Reset Data...',
            click: () => ipcMain.emit('reset-data'),
          },
          {
            label: '&Delete All Data...',
            click: () => ipcMain.emit('clear-data'),
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
              ],
      },
      // {
      //   label: 'Help',
      //   submenu: [
      //     {
      //       label: 'Learn More',
      //       click() {
      //         shell.openExternal('https://electronjs.org');
      //       },
      //     },
      //     {
      //       label: 'Documentation',
      //       click() {
      //         shell.openExternal(
      //           'https://github.com/electron/electron/tree/main/docs#readme',
      //         );
      //       },
      //     },
      //     {
      //       label: 'Community Discussions',
      //       click() {
      //         shell.openExternal('https://www.electronjs.org/community');
      //       },
      //     },
      //     {
      //       label: 'Search Issues',
      //       click() {
      //         shell.openExternal('https://github.com/electron/electron/issues');
      //       },
      //     },
      //   ],
      // },
    ];

    return templateDefault;
  }
}
