import { Component } from '@angular/core';

interface MenuItem {
  icon: string;
  title: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  appTitle = 'Visayas State University';

  menuItems: MenuItem[] = [
    { icon: 'people-outline', title: 'Administración', active: true },
    { icon: 'settings-outline', title: 'Configuración', active: false },
    { icon: 'document-text-outline', title: 'Reporte', active: false },
    { icon: 'alarm-outline', title: 'Alarmas', active: false },
    { icon: 'git-branch-outline', title: 'Versión', active: false }
  ];

  setActiveItem(index: number): void {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
  }
}
