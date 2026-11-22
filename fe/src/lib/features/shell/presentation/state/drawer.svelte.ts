const SIDEBAR_COLLAPSED_KEY = 'kka_sidebar_collapsed';

export class DrawerController {
  mobileOpen = $state(false);
  desktopCollapsed = $state(false);

  // Backward compatibility getter/setter for open
  get open(): boolean {
    return this.mobileOpen;
  }
  set open(val: boolean) {
    this.mobileOpen = val;
  }

  init(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored !== null) {
        this.desktopCollapsed = stored === 'true';
      }
    } catch {
      // Ignore storage errors
    }
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  openDrawer(): void {
    this.mobileOpen = true;
  }

  closeDrawer(): void {
    this.mobileOpen = false;
  }

  toggleDesktop(): void {
    this.desktopCollapsed = !this.desktopCollapsed;
    this.saveDesktopPref();
  }

  collapseDesktop(): void {
    this.desktopCollapsed = true;
    this.saveDesktopPref();
  }

  extendDesktop(): void {
    this.desktopCollapsed = false;
    this.saveDesktopPref();
  }

  private saveDesktopPref(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(this.desktopCollapsed));
    } catch {
      // Ignore
    }
  }
}

export const drawerController = new DrawerController();
