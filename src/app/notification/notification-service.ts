import { Injectable, Component, ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" [class.success]="type === 'success'" [class.error]="type === 'error'">
      {{ message }}
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 4px;
      color: white;
      font-size: 14px;
      max-width: 350px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease-out forwards;
      z-index: 1000;
    }

    .success {
      background-color: #4caf50;
    }

    .error {
      background-color: #f44336;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  message: string = '';
  type: 'success' | 'error' = 'success';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private toastTimeout = 3000; // 3 seconds

  private show(message: string, type: 'success' | 'error') {
    // Create and attach the component
    const componentRef = createComponent(ToastComponent, {
      environmentInjector: this.injector
    });

    // Set the data
    componentRef.instance.message = message;
    componentRef.instance.type = type;

    // Add to the DOM
    document.body.appendChild(componentRef.location.nativeElement);

    // Attach to the application
    this.appRef.attachView(componentRef.hostView);

    // Remove after timeout
    setTimeout(() => {
      this.removeToast(componentRef);
    }, this.toastTimeout);
  }

  private removeToast(componentRef: ComponentRef<ToastComponent>) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showError(message: string) {
    this.show(message, 'error');
  }
}
