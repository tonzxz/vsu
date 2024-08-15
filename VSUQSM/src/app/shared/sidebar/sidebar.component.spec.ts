import { Component, AfterViewInit, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  icon: string;
  title: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild('menuToggle') menuToggle!: ElementRef<HTMLElement>;
  @ViewChild('navigation') navigation!: ElementRef<HTMLElement>;
  @ViewChildren('listItem') listItems!: QueryList<ElementRef<HTMLElement>>;

  isExpanded: boolean = true;

  menuItems: MenuItem[] = [
    { icon: 'fas fa-users', title: 'Administración', active: true },
    { icon: 'fas fa-cog', title: 'Configuración', active: false },
    { icon: 'fas fa-file-alt', title: 'Reporte', active: false },
    { icon: 'fas fa-bell', title: 'Alarmas', active: false },
    { icon: 'fas fa-code-branch', title: 'Versión', active: false }
  ];

  ngAfterViewInit(): void {
    // Initial setup is handled by template bindings
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  setActiveItem(index: number): void {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
  }
}