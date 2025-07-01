import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngFor="let notification of notifications" 
         class="notification notification-{{ notification.type }}">
      <div class="notification-content">
        <span>{{ notification.message }}</span>
        <button (click)="removeNotification(notification.id)" class="notification-close">×</button>
      </div>
    </div>
  `,
  styles: [`
    /* Los estilos están en el archivo global styles.css */
  `]
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  removeNotification(id: number): void {
    this.notificationService.remove(id);
  }
} 