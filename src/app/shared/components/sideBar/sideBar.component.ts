import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule,
  ],
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.scss'],
})
export class SidebarComponent {
  collapsed = signal(false);
  toggle() { this.collapsed.update(v => !v); }

  nav = [
    { icon: 'inventory_2', label: 'Products', link: '/app/products' },
    { icon: 'add',         label: 'New Product', link: '/app/products/create' },
    { icon: 'settings',    label: 'Settings', link: '/app/settings' },
  ];
}